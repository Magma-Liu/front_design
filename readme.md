# 羽毛球比赛管理系统 - 前端

这是一个基于 Uni-app 开发的微信小程序前端项目，用于管理和参与羽毛球比赛。系统包括活动管理、参赛队伍管理、裁判管理等功能。

## 目录

- [羽毛球比赛管理系统 - 前端](#羽毛球比赛管理系统---前端)
  - [目录](#目录)
  - [项目简介](#项目简介)
  - [功能特点](#功能特点)
  - [技术栈](#技术栈)
  - [安装与运行](#安装与运行)
    - [前置条件](#前置条件)
    - [克隆项目](#克隆项目)
    - [安装依赖](#安装依赖)
    - [运行项目](#运行项目)
    - [构建项目](#构建项目)
  - [文件结构](#文件结构)
  - [配置说明](#配置说明)
  - [常见问题](#常见问题)
    - [1. 如何解决依赖安装失败的问题？](#1-如何解决依赖安装失败的问题)
    - [2. 如何在本地调试微信小程序？](#2-如何在本地调试微信小程序)
    - [3. 如何处理跨域问题？](#3-如何处理跨域问题)
  - [贡献指南](#贡献指南)
    - [提交代码](#提交代码)
  - [许可证](#许可证)

## 项目简介

本项目是羽毛球比赛管理系统的前端部分，旨在为用户提供一个友好、便捷的微信小程序界面，以实现活动信息查看、参赛队伍管理、比赛记录等功能。

## 功能特点

- 用户注册和登录
- 查看比赛和活动信息
- 申请成为领队
- 管理参赛队伍（创建队伍、添加队员等）
- 申请参加比赛
- 查看比赛比分和详细信息
- 超级管理员功能（管理活动、裁判、用户等）

## 技术栈

- **前端框架**：Uni-app
- **编程语言**：JavaScript
- **UI 框架**：使用 Uni-app 内置组件和 API
- **数据交互**：通过 RESTful API 与后端进行数据交互

## 安装与运行

### 前置条件

确保你的开发环境中已经安装了以下工具：
- [Node.js](https://nodejs.org/) (版本 >= 10.0)
- [npm](https://www.npmjs.com/)
- [HBuilderX](https://www.dcloud.io/hbuilderx.html) (建议用于 Uni-app 开发)

### 克隆项目

```bash
git clone https://github.com/Magma-Liu/front_design.git
cd front_design
```

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
npm run
```

配置appid，`manifest.json`第45行，可参考教程[获取小程序ID](https://weibanzhushou.com/help/2022/05/13/%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%A8%8B%E5%BA%8Fapp-id/)。

使用 HBuilderX 打开项目目录，在 HBuilderX 中选择运行到微信小程序模拟器。

### 上传项目

微信小程序模拟器中点击上传按钮，进行上传，如有代码质量不过关的问题，需要依次解决。

上传完毕后在微信开发者平台管理上线。

## 文件结构

```plaintext
front_design
├── api                   # 与后端 API 交互的接口文件夹
│   ├── ActivityAPI.js    # 活动相关的 API 接口
│   ├── AdminAPI.js       # 管理员相关的 API 接口
│   ├── ChiefRefereeAPI.js# 裁判长相关的 API 接口
│   ├── ContestantAPI.js  # 参赛者相关的 API 接口
│   ├── LoginAndRegisterAPI.js # 登录和注册相关的 API 接口
│   └── RefereeAPI.js     # 裁判相关的 API 接口
├── pages                 # 页面组件文件夹
│   ├── activities        # 活动相关页面
│   │   ├── activitiesTable.vue # 活动列表页面
│   │   ├── apply.vue     # 活动申请页面
│   │   ├── detail.vue    # 活动详情页面
│   │   └── match.vue     # 比赛页面
│   ├── admin             # 管理员相关页面
│   │   ├── addAdmin.vue  # 添加管理员页面
│   │   ├── leaderApply.vue # 领队申请审批页面
│   │   ├── manageChiefReferee.vue # 管理裁判长页面
│   │   └── manageVenue.vue # 管理场地页面
│   ├── chief_referee     # 裁判长相关页面
│   │   ├── activityApplication.vue # 活动申请管理页面
│   │   ├── addList.vue   # 添加裁判列表页面
│   │   ├── linkActivityAndReferees.vue # 关联活动和裁判页面
│   │   ├── manageActivities.vue # 管理活动页面
│   │   └── manageReferee.vue # 管理普通裁判页面
│   ├── contestant        # 参赛者相关页面
│   │   ├── addList.vue   # 添加队员列表页面
│   │   ├── createTeam.vue # 创建队伍页面
│   │   ├── manageTeam.vue # 管理队伍页面
│   │   └── teamDetail.vue # 队伍详情页面
│   ├── home              # 首页及登录注册页面
│   │   ├── editProfile.vue # 编辑个人信息页面
│   │   ├── home.vue      # 首页
│   │   ├── info.vue      # 用户信息页面
│   │   ├── login.vue     # 登录页面
│   │   └── register.vue  # 注册页面
│   └── referee           # 裁判相关页面
│       ├── manageMatch.vue # 查看负责对比赛页面
│       └── manageScore.vue # 管理比分页面
├── .gitignore            
├── package.json          # 项目依赖和页面配置信息
└── README.md             

```

## 配置说明

在 `App.vue` 中配置后端 API 基础 URL：

```javascript
export default {
	globalData: {
		baseUrl: 'xxxx',
	},
}
```

根据实际后端服务地址进行调整。

注意，如需上线微信小程序，后端网址需要填写在开发者平台中开发管理的-->>服务器域名中。

## 常见问题

### 1. 如何解决依赖安装失败的问题？

请确保你使用的是最新版本的 Node.js 和 npm。如果问题依旧存在，可以尝试使用 cnpm 或 yarn 进行依赖安装。

### 2. 如何在本地调试微信小程序？

使用 HBuilderX 打开项目目录，选择运行到微信小程序模拟器进行调试。

### 3. 如何处理跨域问题？

前端项目通过 `uni.request` 进行网络请求，跨域问题通常由后端解决。确保后端服务器正确设置了 CORS 头。

## 贡献指南

### 提交代码

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature-branch`)
3. 提交代码 (`git commit -am 'Add some feature'`)
4. 推送到分支 (`git push origin feature-branch`)
5. 创建 Pull Request

## 许可证

本项目使用 MIT 许可证，详情请参见 [LICENSE](LICENSE)。
