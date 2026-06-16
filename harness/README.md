# ArcaneEye Harness

项目持久层：跨会话的长期参考文档、开发指南和技能定义。

## 目录

```
harness/
├── docs/                        # 项目文档
│   └── project.md               #   综合技术参考（架构、技术栈、开发流程）
├── skills/                      # 项目特定技能
│   └── aram-data-reference/     #   ARAM 数据参考
└── workflows/                   # 开发工作流
    ├── tauri-development.md     #   Tauri 开发指南
    └── troubleshooting.md       #   故障排除
```

## 指导文件

产品和设计方向由项目根目录的两个文件定义：

- `PRODUCT.md` — 产品定位、用户画像、设计原则、无障碍要求
- `DESIGN.md` — 视觉规范（色板、字体、动效、布局、组件）

## 约定

- harness 文档聚焦持久性指导，不做临时任务记录
- 新文档使用小写 kebab-case 文件名
- 增删文档时同步更新此索引
