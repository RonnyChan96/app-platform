/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {NODE_STATUS} from '@/common/Consts.js';
import {setBranchDisabled} from '@/components/util/BranchUtil.js';
import {isBackwardLink} from '@/components/base/validator.js';

/**
 * 正常页面中节点运行时 runner.
 *
 * @param node 节点.
 * @return {{}} runner 对象.
 */
export const standardRunner = (node) => {
    const self = {};

    /**
     * 开始调试.
     */
    self.testRun = () => {
        node.statusManager.setRunStatus(NODE_STATUS.UN_RUNNING);
        node.statusManager.setDisabled(true);
        node.statusManager.setReferenceDisabled(true);
        node.moveable = false;
    };

    /**
     * 停止调试.
     *
     * @param dataList 数据列表.
     */
    self.stopRun = (dataList) => {
        node.moveable = true;
        node.emphasized = false;
        self.refreshRun(dataList);
        node.statusManager.setDisabled(false);
        node.statusManager.setReferenceDisabled(false);
    };

    /**
     * 刷新调试.
     *
     * @param dataList 数据列表.
     */
    self.refreshRun = (dataList) => {
        const data = dataList?.find(d => d.nodeId === node.id);
        if (data) {
            node.statusManager.setRunStatus(data.status);
            node.setRunReportSections(data);
        } else {
            const preNodes = node.getDirectPreNodeIds();
            if (preNodes && preNodes.length > 0 && preNodes.every(preNode => _isPreNodeFinished(preNode, dataList))) {
                node.statusManager.setRunStatus(NODE_STATUS.RUNNING);
            }
        }
    };

    /**
     * 重置调试.
     */
    self.resetRun = () => {
        node.statusManager.setRunStatus(NODE_STATUS.DEFAULT)
        node.moveable = true;
        delete node.output;
        delete node.input;
        delete node.cost;
        node.statusManager.setDisabled(false);
        node.statusManager.setReferenceDisabled(false);
    };

    const _isPreNodeFinished = (preNode, dataList) => {
        if (preNode.type.endsWith('Condition')) {
            return false;
        }
        const data = dataList.find(d => d.nodeId === preNode.id);
        return data && data.status === NODE_STATUS.SUCCESS;
    };

    return self;
};

/**
 * 正常页面中条件节点运行时 runner.
 *
 * @param node 节点.
 * @return {{}} runner 对象.
 */
export const conditionRunner = (node) => {
    const self = standardRunner(node);
    
    // 循环检测：记录每个节点被回连执行的次数，避免无限循环
    const loopDetectionMap = new Map();
    const MAX_LOOP_COUNT = 100; // 最大循环次数

    // 待处理的回连重置任务，避免重复调度
    const pendingBackwardResets = new Set();

    // 防止在 refreshRun 执行期间重复处理回连
    let isHandlingBackwardLinks = false;

    /**
     * @override
     */
    const testRun = self.testRun;
    self.testRun = () => {
        testRun.apply(self);
        _setBranchDisable(true);
        // 重置循环检测
        loopDetectionMap.clear();
        isHandlingBackwardLinks = false;
    };

    /**
     * @override
     */
    const resetRun = self.resetRun;
    self.resetRun = () => {
        resetRun.apply(self);
        _setBranchDisable(false);
        // 重置循环检测
        loopDetectionMap.clear();
        isHandlingBackwardLinks = false;
    };

    /**
     * @override
     */
    const refreshRun = self.refreshRun;
    self.refreshRun = (dataList) => {
        // 如果正在处理回连，跳过以避免递归
        if (isHandlingBackwardLinks) {
            refreshRun.apply(self, [dataList]);
            return;
        }

        refreshRun.apply(self, [dataList]);

        // 检查条件节点执行结果，处理回连分支
        if (!isHandlingBackwardLinks) {
            isHandlingBackwardLinks = true;
            try {
                _handleBackwardLinks(dataList);
            } finally {
                isHandlingBackwardLinks = false;
            }
        }
    };

    /**
     * @override
     */
    const stopRun = self.stopRun;
    self.stopRun = (dataList) => {
        stopRun.apply(self, [dataList]);
        _setBranchDisable(false);
        // 重置循环检测
        loopDetectionMap.clear();
    };

    /**
     * 处理回连分支
     * 
     * @param dataList 执行结果数据列表
     */
    const _handleBackwardLinks = (dataList) => {
        console.debug('[FlowRunner][conditionRunner] handle backward links', {
            nodeId: node.id,
            dataListLength: dataList?.length
        });
        const conditionData = dataList.find(d => d.nodeId === node.id);
        if (!conditionData || conditionData.status !== NODE_STATUS.SUCCESS) {
            console.debug('[FlowRunner][conditionRunner] no success data for condition node', {
                nodeId: node.id,
                hasConditionData: Boolean(conditionData),
                status: conditionData?.status
            });
            return;
        }

        // 获取条件节点执行后走的分支（通过 nextLineId）
        const nextLineId = conditionData.nextLineId;
        if (!nextLineId) {
            console.debug('[FlowRunner][conditionRunner] condition produced no next line', {
                nodeId: node.id,
                conditionData
            });
            return;
        }

        // 找到对应的 event（nextLineId 是 event 的 id）
        const nextEvent = node.page.getEvents().find(e => e.id === nextLineId);
        if (!nextEvent) {
            console.warn('[FlowRunner][conditionRunner] next event not found', {
                nodeId: node.id,
                nextLineId
            });
            return;
        }

        // 获取目标节点
        const targetNodeId = nextEvent.toShape;
        const targetNode = node.page.getShapeById(targetNodeId);
        if (!targetNode) {
            console.warn('[FlowRunner][conditionRunner] target node not found', {
                nodeId: node.id,
                targetNodeId
            });
            return;
        }

        // 判断是否是回连
        const isBackward = isBackwardLink(node, targetNodeId);
        if (!isBackward) {
            console.debug('[FlowRunner][conditionRunner] forward branch, skipping', {
                nodeId: node.id,
                targetNodeId
            });
            return;
        }

        const currentStatus = targetNode.statusManager?.getRunStatus?.() || targetNode.runStatus;
        if (currentStatus === NODE_STATUS.RUNNING) {
            console.debug('[FlowRunner][conditionRunner] target already running, skip reset', {
                nodeId: node.id,
                targetNodeId
            });
            return;
        }

        if (pendingBackwardResets.has(targetNodeId)) {
            console.debug('[FlowRunner][conditionRunner] reset already pending', {
                nodeId: node.id,
                targetNodeId
            });
            return;
        }

        // 回连分支：检查循环次数
        const loopCount = loopDetectionMap.get(targetNodeId) || 0;
        if (loopCount >= MAX_LOOP_COUNT) {
            console.error('[FlowRunner][conditionRunner] loop count exceeded', {
                nodeId: node.id,
                targetNodeId,
                loopCount,
                maxLoop: MAX_LOOP_COUNT
            });
            node.statusManager.setRunStatus(NODE_STATUS.ERROR);
            return;
        }

        // 增加循环计数
        loopDetectionMap.set(targetNodeId, loopCount + 1);

        // 重置目标节点状态（异步调度，避免同步递归）
        pendingBackwardResets.add(targetNodeId);
        console.info('[FlowRunner][conditionRunner] scheduling backward reset', {
            nodeId: node.id,
            targetNodeId,
            loopCount: loopCount + 1
        });
        Promise.resolve().then(() => {
            try {
                _resetTargetNodeForBackwardLink(targetNode);
            } finally {
                pendingBackwardResets.delete(targetNodeId);
            }
        });
    };

    /**
     * 重置回连目标节点状态，准备重新执行
     * 
     * @param targetNode 目标节点
     */
    const _resetTargetNodeForBackwardLink = (targetNode) => {
        console.info('[FlowRunner][conditionRunner] resetting target for backward link', {
            sourceNodeId: node.id,
            targetNodeId: targetNode.id
        });
        // 重置节点状态为默认状态
        targetNode.statusManager.setRunStatus(NODE_STATUS.DEFAULT);
        // 清除节点的执行结果
        delete targetNode.output;
        delete targetNode.input;
        delete targetNode.cost;
        // 重置节点状态，使其可以重新执行
        targetNode.statusManager.setDisabled(false);
        targetNode.statusManager.setReferenceDisabled(false);
        
        // 将节点状态设置为 RUNNING，触发重新执行
        // 注意：实际的重新执行需要后端配合，这里只是重置状态
        targetNode.statusManager.setRunStatus(NODE_STATUS.RUNNING);

        // 注意：不在这里调用 refreshRun，避免无限递归
        // 节点状态的重新执行应该由后端驱动，这里只负责重置状态
    };

    const _setBranchDisable = (disabled) => {
        setBranchDisabled(node, disabled);
    };

    return self;
};

/**
 * 正常页面中游离节点运行时 runner.
 *
 * @param node 节点.
 * @return {{}} runner对象.
 */
export const inactiveNodeRunner = (node) => {
    const self = {};

    /**
     * 开始调试.
     */
    self.testRun = () => {
        node.ignoreChange(() => {
            node.statusManager.setRunStatus(NODE_STATUS.DEFAULT);
            node.statusManager.setDisabled(true);
            node.moveable = false;
        });
    };

    /**
     * 停止调试.
     */
    self.stopRun = () => {
        node.ignoreChange(() => {
            node.moveable = true;
            node.emphasized = false;
            node.statusManager.setDisabled(false);
        });
    };

    /**
     * 刷新调试.
     *
     */
    self.refreshRun = () => {
        // 无需实现
    };

    /**
     * 重置调试.
     */
    self.resetRun = () => {
        node.ignoreChange(() => {
            node.moveable = true;
            node.statusManager.setDisabled(false);
        });
    };

    return self;
};