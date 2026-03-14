"use client";

import type { Recommendations as RecsType } from "@/lib/types";

const actionColors: Record<string, string> = {
  "买入": "bg-emerald-900/20 text-emerald-400",
  "持有": "bg-blue-900/20 text-blue-400",
  "关注": "bg-amber-900/20 text-amber-400",
  "回调买入": "bg-purple-900/20 text-purple-400",
  "减持": "bg-red-900/20 text-red-400",
};

function getActionColor(action: string): string {
  for (const [key, val] of Object.entries(actionColors)) {
    if (action.includes(key)) return val;
  }
  return "bg-gray-700/20 text-gray-400";
}

export default function RecommendationsPanel({
  recommendations,
  loading,
}: {
  recommendations: RecsType | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#111827] rounded-xl border border-gray-700/30 p-4 space-y-3">
            <div className="skeleton h-5 w-32" />
            <div className="skeleton h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-8 text-center text-gray-500">
        <p>点击"刷新数据"生成投资建议</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 策略总结 */}
      <div className="bg-gradient-to-b from-emerald-900/20 to-[#111827] rounded-xl border border-emerald-800/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-semibold text-white">投资建议</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{recommendations.summary}</p>
      </div>

      {/* A股推荐 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-red-400 font-bold text-xs px-1.5 py-0.5 bg-red-900/20 rounded">A股</span>
          重点标的
        </h3>
        <div className="space-y-3">
          {recommendations.aShares?.map((stock, i) => (
            <div key={i} className="p-3 bg-[#1a2332]/50 rounded-lg border border-gray-700/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{stock.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{stock.ticker}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(stock.action)}`}>
                  {stock.action}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{stock.reason}</p>
              <p className="text-xs text-red-400/70 mt-1">&#9888; {stock.risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 美股推荐 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-blue-400 font-bold text-xs px-1.5 py-0.5 bg-blue-900/20 rounded">美股</span>
          重点标的
        </h3>
        <div className="space-y-3">
          {recommendations.usStocks?.map((stock, i) => (
            <div key={i} className="p-3 bg-[#1a2332]/50 rounded-lg border border-gray-700/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{stock.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{stock.ticker}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionColor(stock.action)}`}>
                  {stock.action}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{stock.reason}</p>
              <p className="text-xs text-red-400/70 mt-1">&#9888; {stock.risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ETF推荐 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          ETF配置
        </h3>
        <div className="space-y-2">
          {recommendations.etfs?.map((etf, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-[#1a2332]/30 rounded-lg">
              <div>
                <span className="text-sm text-white">{etf.name}</span>
                <span className="text-xs text-gray-500 font-mono ml-1.5">{etf.ticker}</span>
                <p className="text-xs text-gray-500 mt-0.5">{etf.reason}</p>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                etf.market === "A股" ? "bg-red-900/20 text-red-400" : "bg-blue-900/20 text-blue-400"
              }`}>
                {etf.market}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 风险提示 */}
      <div className="bg-[#111827] rounded-xl border border-red-900/20 p-4">
        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          风险提示
        </h3>
        <div className="space-y-2">
          {recommendations.riskWarnings?.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-red-400/60 mt-0.5 shrink-0">&#9679;</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 近期关注事件 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          近期关注事件
        </h3>
        <div className="space-y-3">
          {recommendations.upcomingEvents?.map((event, i) => (
            <div key={i} className="flex gap-3 text-xs">
              <span className="text-blue-400 font-mono whitespace-nowrap shrink-0 min-w-[90px]">
                {event.date}
              </span>
              <div>
                <p className="text-gray-300">{event.event}</p>
                <p className="text-gray-500 mt-0.5">{event.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 免责声明 */}
      <div className="text-xs text-gray-600 p-3 bg-[#111827]/50 rounded-lg border border-gray-800/30">
        <p>
          <strong>免责声明：</strong>本工具提供的信息和建议仅供研究参考，不构成任何投资建议。
          投资有风险，决策需谨慎。请根据自身风险承受能力独立判断。
          分析由 Kimi AI 生成，可能存在信息滞后或不准确。
        </p>
      </div>
    </div>
  );
}
