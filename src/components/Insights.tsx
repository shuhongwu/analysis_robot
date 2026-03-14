"use client";

import type { Insights as InsightsType } from "@/lib/types";
import { useState } from "react";

const tabs = [
  { key: "aiChips", label: "芯片/算力" },
  { key: "aiModels", label: "大模型" },
  { key: "aiApplications", label: "AI应用" },
  { key: "robotics", label: "机器人" },
] as const;

const signalColors: Record<string, string> = {
  "利好": "text-emerald-400",
  "利空": "text-red-400",
  "中性": "text-gray-400",
  "传闻": "text-amber-400",
};

export default function InsightsPanel({
  insights,
  loading,
}: {
  insights: InsightsType | null;
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<string>("aiChips");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4 space-y-3">
          <div className="skeleton h-5 w-48" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
        <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4 space-y-3">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-8 text-center text-gray-500">
        <p>点击"刷新数据"生成产业洞察</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 总览卡片 */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="font-semibold text-white">产业洞察总览</h2>
          {insights.generatedAt && (
            <span className="text-xs text-gray-500 ml-auto">
              Kimi AI · {insights.generatedAt}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{insights.summary}</p>
      </div>

      {/* 细分领域 Tab */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 overflow-hidden">
        <div className="flex border-b border-gray-700/30 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {insights[activeTab as keyof typeof insights] as string}
          </p>
        </div>
      </div>

      {/* 趋势信号 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          关键趋势信号
        </h3>
        <div className="space-y-2">
          {insights.trendSignals?.map((signal, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-purple-400 mt-0.5 shrink-0">&#9656;</span>
              <span className="text-gray-300">{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 关键公司追踪 */}
      <div className="bg-[#111827] rounded-xl border border-gray-700/30 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          关键公司信号追踪
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-700/30">
                <th className="text-left py-2 font-medium">公司</th>
                <th className="text-left py-2 font-medium">代码</th>
                <th className="text-center py-2 font-medium">信号</th>
                <th className="text-left py-2 font-medium">原因</th>
              </tr>
            </thead>
            <tbody>
              {insights.keyCompanies?.map((company, i) => (
                <tr key={i} className="border-b border-gray-700/10 hover:bg-[#1a2332]/50">
                  <td className="py-2 font-medium text-white">{company.name}</td>
                  <td className="py-2 text-gray-400 text-xs font-mono">{company.ticker}</td>
                  <td className="py-2 text-center">
                    <span className={`text-xs font-medium ${signalColors[company.signal] || "text-gray-400"}`}>
                      {company.signal}
                    </span>
                  </td>
                  <td className="py-2 text-gray-400 text-xs">{company.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
