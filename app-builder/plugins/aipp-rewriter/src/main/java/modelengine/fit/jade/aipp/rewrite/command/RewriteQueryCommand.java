/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

package modelengine.fit.jade.aipp.rewrite.command;

import lombok.Data;
import modelengine.fit.jade.aipp.memory.AippChatRound;
import modelengine.fit.jade.aipp.memory.AippMemoryConfig;
import modelengine.fit.jade.aipp.rewrite.domain.entity.RewriteStrategy;

import java.util.List;
import java.util.Map;

/**
 * 表示重写问题的命令。
 *
 * @author 易文渊
 * @since 2024-09-24
 */
@Data
public class RewriteQueryCommand {
    /**
     * 重写策略，有内置和自定义两种。
     */
    private RewriteStrategy strategy;

    /**
     * 扩展信息。
     */
    Map<String, Object> extensions;

    /**
     * 输入参数，必须包含 query。
     */
    private Map<String, String> args;

    /**
     * 模板，内置模式代表问题背景、自定义模式代表提示词模板。
     */
    private String template;

    /**
     * 模型名。
     */
    private String model;

    /**
     * 模型标签。
     */
    private String modelTag;

    /**
     * 温度。
     */
    private Double temperature;

    /**
     * 历史记录。
     */
    private List<AippChatRound> histories;

    /**
     * 历史记录配置。
     */
    private AippMemoryConfig memoryConfig;
}