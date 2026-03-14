"use client";

import type { NewsItem } from "@/lib/types";
import { useState } from "react";

const tierColors = {
  1: { border: "border-l-emerald-500", badge: "bg-emerald-900/30 text-emerald-400", label: "权威" },
  2: { border: "border-l-blue-500", badge: "bg-blue-900/30 text-blue-400", label: "行业" },
  3: { border: "border-l-amber-500", badge: "bg-amber-900/30 text-amber-400", label: "传闻" },
};

const categoryColors: Record<string, string> = {
  "AI芯片": "bg-purple-900/30 text-purple-400",
  "大模型": "bg-blue-900/30 text-blue-400",
  "AI应用": "bg-cyan-900/30 text-cyan-400",
  "机器人": "bg-green-900/30 text-green-400",
  "零部件": "bg-orange-900/30 text-orange-400",
  "政策": "bg-red-900/30 text-red-400",
  "传闻": "bg-amber-900/30 text-amber-400",
};

export default function NewsFeed({
  news,
  loading,
}: {
  news: NewsItem[];
  loading: boolean;
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? news
      : news.filter((n) => n.category === filter || (filter === "传闻" && n.tier === 3));

  const categories = ["all", ...Array.from(new Set(news.map((n) => n.category)))];

  return (
    <section className="bg-[#111827] rounded-xl border border-gray-700/30 overflow-hidden flex flex-col h-full">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-gray-700/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h2 className="font-semibold text-white">每日信息动态</h2>
          <span className="text-xs text-gray-500 bg-[#1a2332] px-2 py-0.5 rounded-full">
            {filtered.length} 条
          </span>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="px-4 py-2 border-b border-gray-700/20 flex gap-1.5 flex-wrap shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              filter === cat
                ? "bg-blue-600/20 text-blue-400"
                : "text-gray-500 hover:bg-[#1a2332] hover:text-gray-300"
            }`}
          >
            {cat === "all" ? "全部" : cat}
          </button>
        ))}
      </div>

      {/* 可信度图例 */}
      <div className="px-4 py-1.5 border-b border-gray-700/20 flex gap-4 text-xs text-gray-500 shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-sm" /> Tier 1 权威
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-sm" /> Tier 2 行业
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-500 rounded-sm" /> Tier 3 传闻
        </span>
      </div>

      {/* 新闻列表 */}
      <div className="overflow-y-auto scrollbar-thin flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500">
            <p>暂无相关新闻</p>
            <p className="text-sm mt-1">点击"刷新数据"获取最新信息</p>
          </div>
        ) : (
          filtered.map((item) => {
            const tier = tierColors[item.tier] || tierColors[2];
            const catColor = categoryColors[item.category] || "bg-gray-700/30 text-gray-400";
            return (
              <article
                key={item.id}
                className={`border-l-[3px] ${tier.border} px-4 py-3 border-b border-gray-700/20 cursor-pointer hover:bg-blue-500/5 transition-colors fade-in`}
                onClick={() => item.sourceUrl && window.open(item.sourceUrl, "_blank")}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-gray-100 leading-snug flex-1">
                    {item.title}
                  </h3>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${
                      item.relevance >= 0.8
                        ? "bg-emerald-900/30 text-emerald-400"
                        : item.relevance >= 0.5
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-gray-700/30 text-gray-400"
                    }`}
                  >
                    {Math.round(item.relevance * 100)}%
                  </span>
                </div>
                {item.summary && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${tier.badge}`}>
                    {tier.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${catColor}`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-600">{item.source}</span>
                  {item.publishedAt && (
                    <span className="text-[10px] text-gray-600 ml-auto">
                      {item.publishedAt}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
