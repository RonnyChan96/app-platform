/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

package modelengine.fit.jade.aipp.rewrite.command.impl;

import static modelengine.fitframework.inspection.Validation.notNull;

import modelengine.fel.core.chat.ChatOption;
import modelengine.fel.core.memory.Memory;
import modelengine.fel.core.model.http.SecureConfig;
import modelengine.fit.jade.aipp.memory.AippMemoryFactory;
import modelengine.fit.jade.aipp.model.dto.ModelAccessInfo;
import modelengine.fit.jade.aipp.model.service.AippModelCenter;
import modelengine.fit.jade.aipp.rewrite.command.RewriteCommandHandler;
import modelengine.fit.jade.aipp.rewrite.command.RewriteQueryCommand;
import modelengine.fit.jade.aipp.rewrite.domain.entity.Rewriter;
import modelengine.fit.jade.aipp.rewrite.domain.factory.RewriterFactory;
import modelengine.fit.jade.aipp.rewrite.domain.vo.RewriteParam;
import modelengine.fit.jade.aipp.rewrite.util.Constant;
import modelengine.fitframework.annotation.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 表示 {@link RewriteCommandHandler} 的默认实现。
 *
 * @author 易文渊
 * @since 2024-09-24
 */
@Component
public class RewriteCommandHandlerImpl implements RewriteCommandHandler {
    private final AippMemoryFactory memoryFactory;
    private final RewriterFactory rewriterFactory;
    private final AippModelCenter aippModelCenter;

    /**
     * 创建 {@link RewriteCommandHandlerImpl} 的实例。
     *
     * @param memoryFactory 表示用于创建内存对象的 {@link AippMemoryFactory}。
     * @param rewriterFactory 表示用于创建重写算子的 {@link RewriterFactory}。
     * @param aippModelCenter 表示用于获取模型的 {@link AippModelCenter}。
     */
    public RewriteCommandHandlerImpl(AippMemoryFactory memoryFactory, RewriterFactory rewriterFactory,
            AippModelCenter aippModelCenter) {
        this.memoryFactory = notNull(memoryFactory, "The memory factory cannot be null.");
        this.rewriterFactory = notNull(rewriterFactory, "The rewriter factory cannot be null.");
        this.aippModelCenter = notNull(aippModelCenter, "The model center cannot be null.");
    }

    @Override
    public List<String> handle(RewriteQueryCommand command) {
        notNull(command, "The command cannot be null.");
        Rewriter rewriter = this.rewriterFactory.create(command.getStrategy());
        Map<String, String> args = notNull(command.getArgs(), "The command args cannot be null.");
        Memory memory = this.memoryFactory.create(command.getMemoryConfig(), command.getHistories());
        HashMap<String, String> variables = new HashMap<>(args);
        variables.put(Constant.HISTORY_KEY, memory.text());
        ModelAccessInfo modelAccessInfo = this.aippModelCenter.getModelAccessInfo(command.getModelTag(),
                command.getModel(), null);
        ChatOption chatOption = ChatOption.custom()
                .model(command.getModel())
                .baseUrl(modelAccessInfo.getBaseUrl())
                .secureConfig(modelAccessInfo.isSystemModel() ? null : SecureConfig.custom().ignoreTrust(true).build())
                .apiKey(modelAccessInfo.getAccessKey())
                .temperature(command.getTemperature())
                .extensions(command.getExtensions())
                .stream(false)
                .build();
        return rewriter.invoke(new RewriteParam(command.getTemplate(), variables, chatOption));
    }
}