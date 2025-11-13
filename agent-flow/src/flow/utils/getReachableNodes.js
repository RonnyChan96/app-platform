/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const DEFAULT_MAX_VISITS_PER_NODE = 10;

/**
 * 获取指定起始节点可达的所有节点，允许存在回连。
 * 使用迭代遍历，并限制每个节点最多访问指定次数，避免堆栈溢出。
 *
 * @param {*} startNode 起始节点
 * @param {{maxVisitsPerNode?: number}} [options] 可选配置
 * @returns {Array} 可达节点列表
 */
export const getReachableNodes = (startNode, options = {}) => {
  if (!startNode) {
    return [];
  }

  const {maxVisitsPerNode = DEFAULT_MAX_VISITS_PER_NODE} = options;
  const reachableNodes = [];
  const visitCount = new Map();
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode) {
      continue;
    }

    const key = currentNode;
    const currentVisits = visitCount.get(key) ?? 0;

    if (currentVisits >= maxVisitsPerNode) {
      continue;
    }

    visitCount.set(key, currentVisits + 1);
    reachableNodes.push(currentNode);

    const nextNodes = (() => {
      if (typeof currentNode.getNextNodes !== 'function') {
        return [];
      }
      const result = currentNode.getNextNodes();
      return Array.isArray(result) ? result : [];
    })();

    for (let i = nextNodes.length - 1; i >= 0; i -= 1) {
      stack.push(nextNodes[i]);
    }
  }

  return reachableNodes;
};


