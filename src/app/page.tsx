"use client";

import { useState, useEffect, useCallback } from "react";
import NewsFeed from "@/components/NewsFeed";
import InsightsPanel from "@/components/Insights";
import RecommendationsPanel from "@/components/Recommendations";
import type { NewsItem, Insights, Recommendations } from "@/lib/types";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  const fetchData = useCallback(async (force = false) => {
    try {
      setError("");
      const [newsRes, insightsRes] = await Promise.all([
        fetch(`/api/news${force ? "?force=true" : ""}`),
        fetch(`/api/insights${force ? "?force=true" : ""}`),
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (Array.isArray(newsData)) setNews(newsData);
      }

      if (insightsRes.ok) {
        const data = await insightsRes.json();
        if (data.insights) setInsights(data.insights);
        if (data.recommendations) setRecommendations(data.recommendations);
      }

      setLastUpdated(new Date().toLocaleString("zh-CN"));
    } catch (err) {
      console.error("Fetch error:", err);
      setError("数据加载失败，请检查 Kimi API Key 配置");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // 每30分钟自动刷新
    const interval = setInterval(() => fetchData(true), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
  };

  return (
    <div className="min-h-screen">
      {/* 顶部导航栏 */}
      <nav className="bg-[#111827] border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-[1920px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                AI·机器人产业链投资分析助手
              </h1>
              <p className="text-xs text-gray-500">
                Kimi AI 驱动 · 实时联网搜索 · 深度洞察
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {error && (
              <span className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                {error}
              </span>
            )}
            {lastUpdated && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="pulse-dot w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                <span>更新于 {lastUpdated}</span>
              </div>
            )}
            <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800/30">
              Kimi K2.5 + 联网搜索
            </span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? "分析中..." : "刷新数据"}
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-[1920px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: "calc(100vh - 80px)" }}>
          {/* 左栏：新闻动态 */}
          <div className="lg:col-span-4 overflow-hidden">
            <NewsFeed news={news} loading={loading} />
          </div>

          {/* 中栏：产业洞察 */}
          <div className="lg:col-span-5 overflow-y-auto scrollbar-thin pr-1">
            <InsightsPanel insights={insights} loading={loading} />
          </div>

          {/* 右栏：投资建议 */}
          <div className="lg:col-span-3 overflow-y-auto scrollbar-thin pr-1">
            <RecommendationsPanel recommendations={recommendations} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
