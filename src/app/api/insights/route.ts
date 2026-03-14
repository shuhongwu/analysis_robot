import { NextResponse } from "next/server";
import { kimiChat } from "@/lib/kimi";
import type { Insights, Recommendations } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "insights_cache.json");
const CACHE_TTL = 60 * 60 * 1000; // 1小时

async function readCache(): Promise<{
  insights: Insights;
  recommendations: Recommendations;
  timestamp: number;
} | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(insights: Insights, recommendations: Recommendations) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify({ insights, recommendations, timestamp: Date.now() }, null, 2),
    "utf-8"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  if (!force) {
    const cache = await readCache();
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({
        insights: cache.insights,
        recommendations: cache.recommendations,
      });
    }
  }

  try {
    // 读取最新新闻用于分析
    let newsContext = "";
    try {
      const newsCache = path.join(process.cwd(), "data", "news_cache.json");
      const raw = await fs.readFile(newsCache, "utf-8");
      const newsData = JSON.parse(raw);
      newsContext = (newsData.items || [])
        .slice(0, 25)
        .map(
          (n: { source: string; title: string; summary: string }) =>
            `[${n.source}] ${n.title}: ${n.summary}`
        )
        .join("\n");
    } catch {
      newsContext = "无可用新闻缓存，请基于你的最新知识和联网搜索进行分析。";
    }

    const prompt = `基于以下最新新闻和你的联网搜索能力，生成AI与机器人产业链的深度投资分析。

最新新闻参考：
${newsContext}

请输出严格的JSON格式（不要markdown代码块），结构如下：
{
  "insights": {
    "summary": "200字以内的整体产业趋势总结，需要深刻洞察",
    "aiChips": "AI芯片/算力层深度分析（300字以内），包含NVIDIA/AMD/博通/台积电/寒武纪/海光的最新动态和投资信号",
    "aiModels": "大模型/软件层分析（300字以内），包含OpenAI/Anthropic/Google/百度/阿里等最新进展",
    "aiApplications": "AI应用层分析（300字以内），包含AI Agent/自动驾驶/具身智能等",
    "robotics": "机器人产业链分析（300字以内），包含人形机器人/工业机器人/核心零部件",
    "trendSignals": ["6个关键趋势信号，每个一句话"],
    "keyCompanies": [
      {"name": "公司名", "ticker": "股票代码", "signal": "利好/利空/中性/传闻", "reason": "原因（50字以内）"}
    ],
    "generatedAt": "生成时间"
  },
  "recommendations": {
    "summary": "投资策略总结（100字以内），针对50万人民币的资金量，5年投资经验",
    "aShares": [
      {"name": "公司名", "ticker": "代码", "action": "买入/持有/关注/回调买入/减持", "reason": "理由", "risk": "风险"}
    ],
    "usStocks": [
      {"name": "公司名", "ticker": "代码", "action": "买入/持有/关注/回调买入", "reason": "理由", "risk": "风险"}
    ],
    "etfs": [
      {"name": "ETF名称", "ticker": "代码", "market": "A股/美股", "reason": "理由"}
    ],
    "riskWarnings": ["5条风险提示"],
    "upcomingEvents": [
      {"date": "日期", "event": "事件", "impact": "对投资的影响"}
    ],
    "generatedAt": "生成时间"
  }
}

请确保：
1. 分析要深刻、有独到见解，不要泛泛而谈
2. 关注"别人还没注意到的信号"
3. A股推荐5只，美股推荐4只，ETF推荐4只
4. 风险提示要具体，不要套话
5. 关键公司追踪至少8家`;

    const result = await kimiChat(prompt, {
      webSearch: true,
      jsonMode: true,
      maxTokens: 8192,
    });

    const parsed = JSON.parse(result);
    const insights: Insights = parsed.insights;
    const recommendations: Recommendations = parsed.recommendations;

    await writeCache(insights, recommendations);
    return NextResponse.json({ insights, recommendations });
  } catch (error) {
    console.error("[INSIGHTS] Error:", error);
    const cache = await readCache();
    if (cache) {
      return NextResponse.json({
        insights: cache.insights,
        recommendations: cache.recommendations,
      });
    }
    return NextResponse.json(
      { error: "生成分析失败" },
      { status: 500 }
    );
  }
}
