import { NextResponse } from "next/server";
import { kimiChat } from "@/lib/kimi";
import type { NewsItem } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "news_cache.json");
const CACHE_TTL = 30 * 60 * 1000; // 30分钟

async function readCache(): Promise<{
  items: NewsItem[];
  timestamp: number;
} | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(items: NewsItem[]) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify({ items, timestamp: Date.now() }, null, 2),
    "utf-8"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  // 检查缓存
  if (!force) {
    const cache = await readCache();
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.items);
    }
  }

  try {
    const prompt = `请搜索并整理今天（当前时间）AI和机器人产业链最新的重要新闻动态。

要求：
1. 覆盖全球范围，中英文新闻均需包含
2. 重点关注：AI芯片（NVIDIA/AMD/寒武纪/海光）、大模型、AI应用、人形机器人、工业机器人、核心零部件、自动驾驶、具身智能
3. 每条新闻标注信息来源和可信度
4. 也关注X/Twitter上的行业传闻（标注为"传闻"）

请输出严格的JSON格式，结构如下（不要markdown代码块）：
{
  "news": [
    {
      "id": "唯一ID",
      "title": "新闻标题",
      "summary": "100字以内摘要",
      "source": "信息来源名称",
      "sourceUrl": "来源链接（如有）",
      "tier": 1,
      "category": "分类（AI芯片/大模型/AI应用/机器人/零部件/政策/传闻）",
      "publishedAt": "发布时间",
      "relevance": 0.9
    }
  ]
}

tier说明: 1=权威来源(Reuters/Bloomberg/官方公告), 2=行业媒体(TechCrunch/36Kr/机器之心), 3=社交传闻(X/Twitter/论坛)
relevance: 0-1之间，表示与AI/机器人投资的相关性

至少提供20条新闻，按相关性降序排列。`;

    const result = await kimiChat(prompt, {
      webSearch: true,
      jsonMode: true,
      maxTokens: 8192,
    });

    const parsed = JSON.parse(result);
    const items: NewsItem[] = parsed.news || [];

    await writeCache(items);
    return NextResponse.json(items);
  } catch (error) {
    console.error("[NEWS] Error:", error);
    // 返回缓存数据（即使过期）
    const cache = await readCache();
    if (cache) {
      return NextResponse.json(cache.items);
    }
    return NextResponse.json([], { status: 500 });
  }
}
