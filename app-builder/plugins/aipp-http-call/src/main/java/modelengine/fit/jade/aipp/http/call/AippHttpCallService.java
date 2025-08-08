/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2025 Huawei Technologies Co., Ltd. All rights reserved.
 *  This file is a part of the ModelEngine Project.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

package modelengine.fit.jade.aipp.http.call;

import static modelengine.fitframework.inspection.Validation.notNull;

import modelengine.fit.http.client.HttpClientException;
import modelengine.fit.jade.aipp.http.call.command.HttpCallCommand;
import modelengine.fit.jade.aipp.http.call.command.HttpCallCommandHandler;
import modelengine.fit.jade.aipp.http.call.command.HttpCallResult;
import modelengine.fitframework.annotation.Component;
import modelengine.fitframework.annotation.Fitable;
import modelengine.fitframework.annotation.Value;
import modelengine.fitframework.log.Logger;

import java.net.URI;
import java.util.List;

/**
 * 表示 {@link HttpCallService} 的 aipp 实现。
 *
 * @author 张越
 * @since 2024-11-21
 */
@Component
public class AippHttpCallService implements HttpCallService {
    private static final Logger log = Logger.get(AippHttpCallService.class);

    private final HttpCallCommandHandler handler;

    private List<String> blacklistHttpEndpoints;

    public AippHttpCallService(HttpCallCommandHandler handler,
            @Value("${blacklist.httpEndpoints:[]}") List<String> blacklistHttpEndpoints) {
        this.handler = handler;
        this.blacklistHttpEndpoints = blacklistHttpEndpoints;
    }

    @Override
    @Fitable("aipp")
    public HttpResult httpCall(HttpRequest request) throws HttpClientException {
        notNull(request, "Http request cannot be null.");

        String url = request.getUrl();
        if (this.isInBlacklist(url)) {
            String baseOnly = this.getBaseUrlSafely(url);
            log.error("Blocked: URL is in the blacklist. Base URL: {}", baseOnly);
            HttpResult result = new HttpResult();
            result.setStatus(-1);
            result.setErrorMsg("Invalid request.");
            return result;
        }

        HttpCallCommand command = new HttpCallCommand();
        command.setMethod(request.getHttpMethod());
        command.setUrl(request.getUrl());
        command.setParams(request.getParams());
        command.setHeaders(request.getHeaders());
        command.setAuthentication(request.getAuthentication());
        command.setTimeout(request.getTimeout());
        command.setHttpBody(request.getRequestBody());
        command.setArgs(request.getArgs());
        HttpCallResult httpCallResult = this.handler.handle(command);
        HttpResult result = new HttpResult();
        result.setStatus(httpCallResult.getStatus());
        result.setErrorMsg(httpCallResult.getErrorMsg());
        result.setData(httpCallResult.getData());
        return result;
    }

    private String getBaseUrlSafely(String url) {
        if (url == null || url.trim().isEmpty()) {
            return "null_or_empty";
        }
        url = url.trim();
        int queryOrFragmentIndex = url.length();
        int q = url.indexOf('?');
        int f = url.indexOf('#');
        if (q != -1) queryOrFragmentIndex = Math.min(queryOrFragmentIndex, q);
        if (f != -1) queryOrFragmentIndex = Math.min(queryOrFragmentIndex, f);
        return url.substring(0, queryOrFragmentIndex);
    }

    private boolean isInBlacklist(String url) {
        for (String endpoint : blacklistHttpEndpoints) {
            if (url.contains(endpoint)) {
                return true;
            }
        }
        return false;
    }
}
