// 新闻条目
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  tier: 1 | 2 | 3; // 1=权威 2=行业 3=传闻
  category: string;
  publishedAt: string;
  relevance: number;
}

// 公司信号
export interface CompanySignal {
  name: string;
  ticker: string;
  signal: "利好" | "利空" | "中性" | "传闻";
  reason: string;
}

// 产业洞察
export interface Insights {
  summary: string;
  aiChips: string;
  aiModels: string;
  aiApplications: string;
  robotics: string;
  trendSignals: string[];
  keyCompanies: CompanySignal[];
  generatedAt: string;
}

// 股票推荐
export interface StockPick {
  name: string;
  ticker: string;
  action: string;
  reason: string;
  risk: string;
}

// ETF推荐
export interface ETFPick {
  name: string;
  ticker: string;
  market: string;
  reason: string;
}

// 即将发生的事件
export interface UpcomingEvent {
  date: string;
  event: string;
  impact: string;
}

// 投资建议
export interface Recommendations {
  summary: string;
  aShares: StockPick[];
  usStocks: StockPick[];
  etfs: ETFPick[];
  riskWarnings: string[];
  upcomingEvents: UpcomingEvent[];
  generatedAt: string;
}

// API 响应
export interface DashboardData {
  news: NewsItem[];
  insights: Insights;
  recommendations: Recommendations;
  lastUpdated: string;
  apiStatus: "connected" | "error" | "loading";
}
