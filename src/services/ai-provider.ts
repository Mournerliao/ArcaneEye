import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import type { AIProvider } from "@/types"

/* ─── Screenshot analysis schema ─── */

export const screenshotSchema = z.object({
  mode: z
    .enum(["champion", "hex"])
    .describe("当前游戏阶段：champion=选人阶段，hex=海克斯强化选择阶段"),
  champions: z
    .array(z.string())
    .describe("选人模式下识别到的英雄名称列表，如 ['Aatrox', 'Jinx']"),
  augments: z
    .array(z.string())
    .describe("海克斯模式下识别到的强化选项名称列表"),
  currentChampion: z
    .string()
    .optional()
    .describe("海克斯模式下当前已选的英雄名称"),
})

export type ScreenshotAnalysis = z.infer<typeof screenshotSchema>

/* ─── Prompt templates ─── */

const CHAMPION_PROMPT = `你是一个英雄联盟大乱斗 (ARAM) 游戏助手。
分析这张游戏截图，识别出选人阶段中所有可选的英雄名称。

要求：
- 识别截图中显示的所有英雄英文名称（如 Aatrox, Jinx, Ahri）
- 使用英文原名，不要翻译
- 如果看不清某个英雄，尽量根据可见文字推断
- 返回空数组表示未识别到选人界面`

const HEX_PROMPT = `你是一个英雄联盟大乱斗 (ARAM) 游戏助手。
分析这张游戏截图，识别出海克斯强化选择界面中的信息。

要求：
- 识别截图中显示的所有海克斯强化选项的英文名称
- 如果能识别出当前英雄，也请返回
- 使用英文原名，不要翻译
- 返回空数组表示未识别到海克斯选择界面`

/* ─── Provider factory ─── */

export function resolveModel(
  provider: AIProvider,
  apiKey: string,
  baseURL: string,
  modelId: string,
) {
  if (!apiKey) {
    throw new Error("未配置 API Key，请先在设置中配置")
  }

  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey, baseURL })(modelId)
    case "anthropic":
      return createAnthropic({ apiKey, baseURL })(modelId)
    case "google":
      return createGoogleGenerativeAI({ apiKey, baseURL })(modelId)
    case "custom":
      // Custom providers use OpenAI-compatible API
      return createOpenAI({ apiKey, baseURL })(modelId)
    default:
      throw new Error(`不支持的 Provider: ${provider}`)
  }
}

/* ─── Screenshot analysis ─── */

export async function analyzeScreenshot(
  screenshotDataUrl: string,
  config: {
    provider: AIProvider
    apiKey: string
    baseURL: string
    modelId: string
  },
): Promise<ScreenshotAnalysis> {
  const model = resolveModel(
    config.provider,
    config.apiKey,
    config.baseURL,
    config.modelId,
  )

  const { object } = await generateObject({
    model,
    schema: screenshotSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${CHAMPION_PROMPT}\n\n${HEX_PROMPT}\n\n请根据截图内容自动判断当前是选人阶段还是海克斯选择阶段，然后返回对应信息。`,
          },
          {
            type: "image",
            image: screenshotDataUrl,
          },
        ],
      },
    ],
  })

  return object
}
