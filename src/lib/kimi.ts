import OpenAI from "openai";

// Kimi API 客户端（兼容 OpenAI SDK）
export function getKimiClient() {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey || apiKey === "your_kimi_api_key_here") {
    throw new Error("请设置 KIMI_API_KEY 环境变量");
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.KIMI_BASE_URL || "https://api.moonshot.ai/v1",
  });
}

// 调用 Kimi 生成文本（带联网搜索）
export async function kimiChat(
  prompt: string,
  options?: {
    model?: string;
    webSearch?: boolean;
    jsonMode?: boolean;
    maxTokens?: number;
  }
) {
  const client = getKimiClient();
  const model = options?.model || "moonshot-v1-128k";
  const maxRounds = 5;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "你是一位专业的AI与机器人产业链投资分析师，拥有深厚的金融、技术和产业链知识。你的分析需要严谨、有数据支撑、有前瞻性。",
    },
    { role: "user", content: prompt },
  ];

  // Kimi 联网搜索 — 使用 builtin_function 类型（Kimi专有，通过raw body传递）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestBody: any = {
    model,
    messages,
    max_tokens: options?.maxTokens || 8192,
    temperature: 0.3,
  };

  if (options?.webSearch) {
    requestBody.tools = [
      {
        type: "builtin_function",
        function: { name: "$web_search" },
      },
    ];
  }

  if (options?.jsonMode) {
    requestBody.response_format = { type: "json_object" };
  }

  const baseURL = process.env.KIMI_BASE_URL || "https://api.moonshot.ai/v1";
  const apiKey = process.env.KIMI_API_KEY!;

  // 直接使用 fetch 调用 Kimi API（绕过 OpenAI SDK 的类型限制）
  for (let round = 0; round < maxRounds; round++) {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Kimi API ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];

    if (!choice) throw new Error("Kimi API 无返回结果");

    if (
      choice.finish_reason === "tool_calls" &&
      choice.message?.tool_calls?.length
    ) {
      // 模型触发了搜索 — 把搜索结果回传
      requestBody.messages.push(choice.message);
      for (const toolCall of choice.message.tool_calls) {
        requestBody.messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolCall.function?.arguments || "{}",
        });
      }
      continue;
    }

    return choice.message?.content || "";
  }

  return "分析生成超时，请重试。";
}
