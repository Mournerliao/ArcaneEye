# Tauri 开发工作流

## 开发环境搭建

### 前置条件
- Node.js v24 LTS
- Bun 包管理器
- Rust 最新稳定版
- Tauri CLI 最新版本

### 安装步骤
1. 安装依赖：
   ```bash
   bun install
   ```

2. 启动开发服务器：
   ```bash
   bun run tauri dev
   ```

## 开发流程

### 1. 功能开发
1. 创建功能分支：
   ```bash
   git checkout -b feature/功能名称
   ```

2. 开发功能代码
3. 编写测试用例
4. 提交代码：
   ```bash
   git commit -m "feat: 添加功能描述"
   ```

### 2. 测试验证
1. 运行单元测试：
   ```bash
   bun test
   ```

2. 运行类型检查：
   ```bash
   bun run type-check
   ```

3. 运行代码检查：
   ```bash
   bun run lint
   ```

### 3. 构建发布
1. 构建应用：
   ```bash
   bun run tauri build
   ```

2. 测试安装包
3. 发布到 GitHub Release

## 调试技巧

### 前端调试
- 使用 Chrome DevTools 调试 React 组件
- 使用 React Developer Tools 检查组件状态
- 使用 Zustand DevTools 调试状态管理

### 后端调试
- 使用 Rust 调试器调试 Tauri 后端
- 查看 Tauri 日志输出
- 使用 `console.log` 调试前端到后端的调用

### 集成调试
- 测试前端与后端的通信
- 测试截图功能（内置 + 可选 HDR 增强）
- 测试与 ARAMGG API 的集成

## 常见问题

### 1. Tauri 构建失败
- 检查 Rust 工具链是否正确安装
- 检查 Tauri CLI 版本
- 查看详细错误信息

### 2. 前端热重载不工作
- 检查 Bun 版本
- 清除 node_modules 重新安装
- 检查端口是否被占用

### 3. 截图功能集成测试
- 测试内置截图功能
- 测试与第三方 HDR 截图工具的集成（可选）

## 最佳实践

1. **代码规范**：遵循项目编码规范
2. **测试覆盖**：编写充分的测试用例
3. **文档更新**：及时更新相关文档
4. **版本控制**：使用语义化版本控制
5. **代码审查**：进行代码审查确保质量