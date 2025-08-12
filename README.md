# y-websocket-server 自定义持久化

## 部署方式

### 方式一：本地开发部署

1. 确保本地已安装 MongoDB 并启动
2. 复制 [`.env.example`](.env.example) 为 `.env` 并配置环境变量
3. 安装依赖并启动：

```bash
cp .env.example .env
npm install
npm start
```

### 方式二：Docker 容器化部署

使用 Docker Compose 一键启动（包含 MongoDB）：

```bash
cp .env.example .env
docker compose up --build
```

## 环境变量说明

- `MONGODB_URL`: MongoDB 连接字符串
- `MONGODB_DB`: 数据库名称
- `MONGODB_COLLECTION`: 集合名称
- `HOST`: 服务监听地址
- `PORT`: 服务端口

## 开发指南

### 自定义持久化开发

项目使用 [`CustomPersistence`](src/custom-persistence.js) 类实现 MongoDB 持久化。实现 [`CustomPersistence`](src/custom-persistence.js) 需要实现以下方法：

```js
export default class CustomPersistence{
  async bindState(docName, ydoc) {
    // 将数据从 MongoDB 加载到 ydoc
  }

  async writeState(docName, ydoc) {
    // 将数据从 ydoc 保存到 MongoDB
  }

}
```

主要操作文档的 `Yjs` API

```js
import * as Y from "yjs";

Y.applyUpdate(ydoc, update); // 将 update 应用到 ydoc
Y.encodeStateAsUpdate(ydoc); // 将 ydoc 编码为 update
```

[绑定自定义持久化类](src/server.js#L30)
```js
const customPersistence = new CustomPersistence()
setPersistence(customPersistence)
```
你可以将 mongodb 改成其他的持久化方式，比如 mysql、redis 等。或选择已有的框架：
* [@y/websocket-server](https://github.com/yjs/y-websocket-server/)
* hocuspocus
- y-sweet
- y-redis
- ypy-websocket
- pycrdt-websocket
- [yrs-warp](https://github.com/y-crdt/yrs-warp)
