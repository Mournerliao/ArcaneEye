# ARAM Data Reference Skill

## 概述

本技能提供 ARAM（All Random All Mid）大乱斗模式的数据参考，帮助开发人员理解数据结构和 API 使用方式。

## 数据源

- **API 地址**：https://data.dtodo.cn
- **数据格式**：JSON
- **更新频率**：每天同步

## 数据结构

### 英雄数据
```json
{
  "championId": 1,
  "championName": "安妮",
  "winRate": 52.5,
  "pickRate": 8.2,
  "tier": "S"
}
```

### 海克斯数据
```json
{
  "hexId": 1001,
  "hexName": "风暴聚集",
  "winRate": 55.3,
  "pickRate": 12.1,
  "tier": "S"
}
```

## API 使用示例

### 查询英雄胜率
```javascript
const response = await fetch('https://data.dtodo.cn/api/champions');
const champions = await response.json();
```

### 查询海克斯胜率
```javascript
const response = await fetch('https://data.dtodo.cn/api/hexes?championId=1');
const hexes = await response.json();
```

## 数据处理

### 数据缓存
- 使用本地数据库缓存数据
- 每天定时更新缓存
- 提供离线访问能力

### 数据转换
- 将 API 数据转换为前端所需格式
- 计算胜率排名
- 生成推荐列表

## 最佳实践

1. **数据验证**：验证 API 返回数据的完整性
2. **错误处理**：处理 API 调用失败的情况
3. **性能优化**：使用缓存减少 API 调用次数
4. **数据同步**：定时同步数据确保时效性

## 相关文件

- `src/services/aramgg.ts` - ARAMGG API 服务
- `src/stores/aram-data.ts` - ARAM 数据状态管理
- `harness/docs/project.md` - 项目详细文档