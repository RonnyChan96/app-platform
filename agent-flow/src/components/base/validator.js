/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class Validator {
  constructor(node) {
    this.node = node;
  }

  validate() {
    throw new Error('Method \'validate()\' must be implemented.');
  }
}

export class FormValidator extends Validator {
  validate() {
    return new Promise((resolve, reject) => {
      try {
        this.node.validateForm().then(resolve).catch(reject);
      } catch (error) {
        reject({
          errorFields: [{
            errors: [error.message],
            name: 'node-error',
          }],
        });
      }
    });
  }
}

export class NormalNodeConnectorValidator extends Validator {
  validate() {
    const nextEvents = this.node.getNextRunnableEvents();
    const i18n = this.node.graph.i18n;
    if (nextEvents.length !== 1) {
      return Promise.reject({
        errorFields: [{
          errors: [`${i18n?.t('node') ?? 'node'} ${this.node.text} ${i18n?.t('problemWithConnection') ?? 'problemWithConnection'}`],
          name: 'link-error',
        }],
      });
    }
    return Promise.resolve();
  }
}

/**
 * 判断目标节点是否在源节点的前置路径中（用于判断回连）
 * 
 * @param sourceNode 源节点
 * @param targetNodeId 目标节点ID
 * @returns {boolean} 如果目标节点在源节点的前置路径中，返回true
 */
export const isBackwardLink = (sourceNode, targetNodeId) => {
  const preNodeInfos = sourceNode.getPreNodeInfos();
  return preNodeInfos.some(preNode => preNode.id === targetNodeId);
};

/**
 * 记录回连信息用于调试
 * 
 * @param sourceNode 源节点
 * @param targetNodeId 目标节点ID
 */
export const logBackwardLinkInfo = (sourceNode, targetNodeId) => {
  const preNodeInfos = sourceNode.getPreNodeInfos();
  const preNodeIds = preNodeInfos.map(preNode => preNode.id);
  const isBackward = isBackwardLink(sourceNode, targetNodeId);
  
  console.log('=== 回连检测调试信息 ===');
  console.log('源节点ID:', sourceNode.id);
  console.log('源节点名称:', sourceNode.text);
  console.log('目标节点ID:', targetNodeId);
  console.log('源节点的所有前置节点ID:', preNodeIds);
  console.log('是否识别为回连:', isBackward);
  console.log('====================');
  
  return isBackward;
};

export class ConditionNodeConnectorValidator extends Validator {
  validate() {
    const nextEvents = this.node.getNextRunnableEvents();
    const i18n = this.node.graph.i18n;
    const runnableBranches = this.node.getBranches().filter(b => b.runnable);
    
    // 条件节点的每个可运行分支都应该有一条连接（可以是正常连接或回连）
    // 回连是允许的，不计入连接数量限制
    if (nextEvents.length !== runnableBranches.length) {
      return Promise.reject({
        errorFields: [{
          errors: [`${i18n?.t('node') ?? 'node'} ${this.node.text} ${i18n?.t('problemWithConnection') ?? 'problemWithConnection'}`],
          name: 'link-error',
        }],
      });
    }
    return Promise.resolve();
  }
}

export class EndNodeConnectorValidator extends Validator {
  validate() {
    const nextEvents = this.node.getNextRunnableEvents();
    const i18n = this.node.graph.i18n;
    if (nextEvents.length !== 0) {
      return Promise.reject({
        errorFields: [{
          errors: [`${i18n?.t('node') ?? 'node'} ${this.node.text} ${i18n?.t('problemWithConnection') ?? 'problemWithConnection'}`],
          name: 'link-error',
        }],
      });
    }
    return Promise.resolve();
  }
}

export class KnowledgeRetrievalValidator extends Validator {
  validate() {
    const jadeConfig = this.node.drawer.getLatestJadeConfig();
    const i18n = this.node.graph.i18n;

    // 校验搜索参数.
    const option = jadeConfig.inputParams.find(ip => ip.name === 'option');
    if (option.value.length === 0) {
      return Promise.reject({
        errorFields: [{
          errors: [`${this.node.text} ${i18n?.t('noSearchOption') ?? 'noSearchOption'}`],
          name: 'search-args-error',
        }],
      });
    }

    return Promise.resolve();
  }
}
