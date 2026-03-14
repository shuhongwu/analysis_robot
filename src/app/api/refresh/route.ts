import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl = new URL(request.url).origin;

  try {
    // 并行刷新新闻和洞察
    const [newsRes, insightsRes] = await Promise.all([
      fetch(`${baseUrl}/api/news?force=true`),
      fetch(`${baseUrl}/api/insights?force=true`),
    ]);

    const news = await newsRes.json();
    const insights = await insightsRes.json();

    return NextResponse.json({
      status: "ok",
      newsCount: Array.isArray(news) ? news.length : 0,
      hasInsights: !!insights.insights,
    });
  } catch (error) {
    console.error("[REFRESH] Error:", error);
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
