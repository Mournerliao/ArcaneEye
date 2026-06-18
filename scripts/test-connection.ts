// 测试 Supabase 和 ARAMGG API 连接
// 运行: bun run scripts/test-connection.ts

import { loadEnv } from 'vite'
import { createClient } from '@supabase/supabase-js'

// 加载 .env.local 环境变量
const env = loadEnv('development', process.cwd(), '')
Object.assign(process.env, env)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const aramggBase = process.env.VITE_ARAMGG_API_BASE
const aramggKey = process.env.VITE_ARAMGG_API_KEY

async function testSupabase() {
  console.log('\n🔍 测试 Supabase 连接...')

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少 Supabase 环境变量')
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { error } = await supabase
      .from('champions')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase 查询失败:', error.message)
      return false
    }

    console.log('✅ Supabase 连接成功！')
    console.log('   表结构已就绪')
    return true
  } catch (err) {
    console.error('❌ Supabase 连接异常:', err)
    return false
  }
}

async function testAramgg() {
  console.log('\n🔍 测试 ARAMGG API 连接...')

  if (!aramggBase || !aramggKey) {
    console.error('❌ 缺少 ARAMGG API 环境变量')
    return false
  }

  try {
    const res = await fetch(`${aramggBase}/api/v1/zh-CN/config.json`, {
      headers: {
        Authorization: `Bearer ${aramggKey}`,
      },
    })

    if (!res.ok) {
      console.error('❌ ARAMGG API 请求失败:', res.status, res.statusText)
      return false
    }

    const config = await res.json()
    console.log('✅ ARAMGG API 连接成功！')
    console.log(`   数据版本: ${config.dataVersion}`)
    console.log(`   游戏补丁: ${config.gamePatch}`)
    return true
  } catch (err) {
    console.error('❌ ARAMGG API 连接异常:', err)
    return false
  }
}

async function main() {
  console.log('🚀 ArcaneEye 数据层连接测试')
  console.log('─'.repeat(40))

  const supabaseOk = await testSupabase()
  const aramggOk = await testAramgg()

  console.log('\n' + '─'.repeat(40))
  if (supabaseOk && aramggOk) {
    console.log('✅ 所有连接测试通过！')
    console.log('\n下一步: 运行数据同步')
    console.log('  bun run scripts/sync-data.ts')
  } else {
    console.log('❌ 存在连接问题，请检查 .env.local 配置')
  }
}

main()
