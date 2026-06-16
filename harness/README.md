# ArcaneEye Harness

This directory is the durable project harness for ArcaneEye: long-lived context, reusable guidance, and norms that agents and humans should keep following across implementation sessions.

## Directory Map

- `docs/project.md` - 项目详细文档，包含产品定位、技术架构、开发流程等
- `planning/` - 项目规划和功能清单
  - `project-plan.md` - 项目规划和愿景
  - `mvp-feature-list.md` - MVP 功能清单
- `design/` - 设计原则和设计工作流
  - `design-principles.md` - 设计原则和规范
  - `design-workflow.md` - 设计工作流和评审流程
- `skills/` - 项目特定技能和参考
  - `aram-data-reference/` - ARAM 数据参考技能
- `workflows/` - 开发工作流和故障排除指南
  - `tauri-development.md` - Tauri 开发工作流
  - `troubleshooting.md` - 故障排除指南
- `config/` - 项目配置文件
- `tests/` - 测试用例和测试数据
- `scripts/` - 构建和部署脚本

## Conventions

- Keep harness documents focused on durable guidance, not transient task notes.
- Prefer lowercase kebab-case file names for new harness documents.
- Add new top-level harness folders only when there is real content to place in them.
- Update this index whenever a durable harness document is added, moved, or removed.

## Usage

Before making significant changes to the project, agents should:

1. Read `AGENTS.md` for project overview and constraints
2. Read relevant harness documents for detailed guidance
3. Follow the established patterns and conventions