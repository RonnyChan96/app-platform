/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

package modelengine.fit.jade.aipp.classify.question.command;

import lombok.Data;
import modelengine.fit.jade.aipp.classify.question.QuestionType;
import modelengine.fit.jade.aipp.memory.AippChatRound;
import modelengine.fit.jade.aipp.memory.AippMemoryConfig;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 表示问题分类的命令。
 *
 * @author 张越
 * @since 2024-11-18
 */
@Data
public class ClassifyQuestionCommand {
    /**
     * 输入参数，必须包含 query。
     */
    private Map<String, String> args;

    /**
     * 扩展信息。
     */
    Map<String, Object> extensions;

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
     * 问题类型列表.
     */
    private List<QuestionType> questionTypes;

    /**
     * 历史记录。
     */
    private List<AippChatRound> histories;

    /**
     * 历史记录配置。
     */
    private AippMemoryConfig memoryConfig;

    /**
     * 获取类型列表，转换成大模型能识别的格式.
     *
     * @return 类型列表字符串.
     */
    public String getTypeList() {
        return this.getQuestionTypes()
                .stream()
                .map(QuestionType::toModelFormat)
                .collect(Collectors.joining("\n------\n"));
    }

    /**
     * 获取最后一个问题类型.
     *
     * @return {@link QuestionType} 对象.
     */
    public QuestionType getLastQuestionType() {
        return this.questionTypes.get(this.questionTypes.size() - 1);
    }

    /**
     * 获取问题类型.
     *
     * @param id 问题类型的id.
     * @return 问题类型的 {@link Optional} 对象.
     */
    public Optional<QuestionType> getQuestionType(String id) {
        return this.questionTypes.stream().filter(q -> q.getId().equals(id)).findAny();
    }
}