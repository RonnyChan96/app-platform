# AppPlatform

**AppPlatform 是一个前沿的大模型应用工程，旨在通过集成的声明式编程和低代码配置工具，简化和优化大模型的训练与推理应用的开发过程。本工程为软件工程师和产品经理提供一个强大的、可扩展的环境，以支持从概念到部署的全流程 AI 应用开发。**
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/license/MIT)
[![JDK](https://img.shields.io/badge/JDK-17-green.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Node](https://img.shields.io/badge/node-20-red.svg)](https://nodejs.org/en/download)

## 核心架构

1. **AppPlatform 后端模块**

   AppPlatform 后端基于 [FIT](https://github.com/ModelEngine-Group/fit-framework/tree/main/framework/fit/java) 框架，采用插件化式开发，包含应用管理模块和功能扩展模块。其中应用管理模块为 AppPlatform 的核心模块，用于提供创建、管理、调试、运行和维护 AI 应用，该提供一个高效快捷的方式来开发具有复杂交互功能的 AI 应用。功能扩展模块通过组件节点的方式，丰富流程编排的能力，用户可根据需求自由组合，构建出符合业务逻辑的 AI 应用，该模块为组件节点的底层逻辑实现。应用流程运行基于 [Waterflow](https://github.com/ModelEngine-Group/fit-framework/tree/main/framework/waterflow/java) 框架，方便高效地对流程和数据进行组织和处理。

2. **AppPlatform 前端模块**

   AppPlatform 前端采用 React 框架进行开发，基于函数式组件构建，通过模块化设计实现了应用开发，应用市场，智能表单和插件管理等核心功能模块。其中应用开发模块为核心模块，提供可视化界面支持AI应用的完整生命周期管理，包含了应用创建，编排，调试，运行，和发布全流程；智能表单模块可通过 Json Schema 自动渲染可交互表单，与 AI 模型服务集成，实现表单填写与实时推理；插件模块支持开发者上传自定义插件扩展应用工程能力，并提供了插件安装和卸载等功能。此外，前端流程编排还基于 [Elsa 图形引擎](https://github.com/ModelEngine-Group/fit-framework/tree/main/framework/elsa)，Elsa 图形引擎是一款基于原生 JS 打造而成的先进图形处理工具。通过统一的数据格式，可以让图形跨平台跨应用进行展示和协作，为用户提供灵活、高性能的图形渲染与交互能力，适用于复杂可视化场景的开发需求。

---------
## 关键特性

1. **低代码图形化界面**：产品人员可以通过直观的图形界面创建 AI 应用，而无需深入了解底层代码即可进行高效的编辑和调试。同时支持多模型协同运作，使用户能够根据特定的业务需求，将不同的 AI 模型通过编排整合到同一个应用流程中。
2. **强大的算子与调度平台**：通过 FIT 与 Waterflow 框架，AppPlatform 提供了一个高效、可扩展的后端架构，支持 Java、Python 等多种主流编程语言的算子开发，并通过智能调度实现优化的执行效率。
3. **共享与协作**： AppPlatform 的底层包含 Store 模版，用于将所有开发的 AI 应用统一存储，以此支持跨项目的复用和协作。开发者可以根据需要组合这些应用，打造更大的解决方案，或者利用社区提供的工具和模型。在 AppPlatform 中， AI 应用不仅限于传统意义上的 “应用”，它们可以是 “函数”、“RAG”、“智能体”等任何可解释和可执行的组件。这些组件在 Store 中以 “工具” 的形式展现，其元数据不仅提供了必要的解释，还为智能体自动调度这些工具提供了基础。

---------
## 后端环境配置

开发环境配置

- 开发环境：`IntelliJ IDEA`
- Java 17
- 代码格式化文件：[CodeFormatterFromIdea.xml](CodeFormatterFromIdea.xml)
- `Maven` 配置：推荐版本 Maven 3.8.8+
- FIT 框架编译产物（链接待补充）

**构建命令**

```
mvn clean install
```

**输出目录**

```
framework/fit/java/target
```

考虑到后端模块基于 FIT 框架。所以需要将输出目录与 FIT 框架的编译产物结合。将输出目录的 plugins 目录与 shared 目录分别与框架编译产物输出目录的 plugins 与 shared 目录相结合。

**启动命令**

```
framework/fit/java/target/bin/fit start -Dfit.profiles.active=prod
```
---------
## 前端环境配置

- 开发环境：`WebStorm`、`Visual Studio Code`

- 环境要求：node.js  >= 20

**修改代理文件**
修改 `AppPlatform/frontend` 目录下的 `proxy.config.json` 文件，可以修改需要访问的后端地址。如本地后端地址是 `http://127.0.0.1:8080` 。可以按照如下示例配置：

```json
{
    "/api": {
       "target": "http://127.0.0.1:5520",
       "secure": false,
       "changeOrigin": true,
       "pathRewrite": {
          "^/api": ""
       }
    }
}
```

**依赖安装**

```
cd framework/elsa/fit-elsa
npm install
npm run build:debug
cd ../fit-elsa-react/
npm install
npm run build
cd ../../../app-engine/frontend/
npm install
```

**打包构建**

```
npm run build
```

**启动命令**

```
npm run start
```
---------
## 快速开始

**待完善**

## 文档

您可以从`docs`目录查看项目的完整文档，文档包含 AppPlatform 的快速入门指南和用户指导手册。

**待完善**

## 贡献

欢迎贡献者加入本项目。
请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，这将指导您完成分支管理、标签管理、提交规则、代码审查等内容。遵循这些指导有助于项目的高效开发和良好协作。

## 联系我们

1. 如果发现问题，可以在该项目的 `Issue` 模块内提出。
