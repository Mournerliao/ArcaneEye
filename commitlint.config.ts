import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // 新功能
        "fix",      // 修复 Bug
        "docs",     // 文档更新
        "style",    // 代码格式（不影响功能）
        "refactor", // 重构
        "perf",     // 性能优化
        "test",     // 测试
        "build",    // 构建工具或外部依赖变更
        "ci",       // CI 配置变更
        "chore",    // 其他杂项
        "revert",   // 回滚
      ],
    ],
    "subject-max-length": [2, "always", 100],
  },
};

export default config;
