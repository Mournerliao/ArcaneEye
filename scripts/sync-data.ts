// ARAMGG 数据同步脚本
// 运行: bun run scripts/sync-data.ts

import { loadEnv } from 'vite'
import { syncAll } from '@/services/dataSync'

// 加载 .env.local 环境变量
const env = loadEnv('development', process.cwd(), '')
Object.assign(process.env, env)

async function main() {
  console.log('🚀 ArcaneEye 数据同步')
  console.log('═'.repeat(50))

  const result = await syncAll()

  console.log('\n' + '═'.repeat(50))
  if (result.errors.length === 0) {
    console.log('✅ 数据同步完成！')
    console.log(`   英雄: ${result.champions} 条`)
    console.log(`   海克斯: ${result.augments} 条`)
  } else {
    console.log('⚠️  数据同步部分完成')
    console.log(`   成功: 英雄 ${result.champions} 条, 海克斯 ${result.augments} 条`)
    console.log(`   失败: ${result.errors.join(', ')}`)
  }
}

main()
