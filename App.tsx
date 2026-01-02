import React, { useEffect, useState } from "react";
import {
  Calculator,
  Calendar,
  Activity,
  Zap,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  CalendarDays,
  RotateCcw,
  Info,
  ArrowRight,
  Layers,
  Download
} from "lucide-react";
import { InputGroup } from "./components/InputGroup";
import { SelectGroup } from "./components/SelectGroup";
import { SectionHeader } from "./components/SectionHeader";
import { StatBox } from "./components/StatBox";
import { PacingVisualizer } from "./components/PacingVisualizer";
import { CampaignData, PacingResult } from "./types";
import { DEFAULT_CAMPAIGN_DATA } from "./constants";
import {
  calculatePacing,
  formatCurrency,
  formatDate,
  formatPercent
} from "./utils/calculations";
import {
  getRecommendation,
  getTimelineRec,
  getSpendStatusMsg
} from "./utils/recommendations";
import { generatePDF } from "./utils/pdfGenerator";

export type Theme = "light" | "dark";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  // Keep <html> in sync with theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Listen for parent window postMessage
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data || {};
      if (
        (data.type === "THEME_CHANGE" || data.type === "THEME_RESPONSE") &&
        (data.theme === "light" || data.theme === "dark")
      ) {
        setTheme(data.theme);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const [data, setData] = useState<CampaignData>(DEFAULT_CAMPAIGN_DATA);
  const [result, setResult] = useState<PacingResult | null>(null);

  const handleCalculate = () => {
    const calculated = calculatePacing(data);
    setResult(calculated);
  };

  const handleReset = () => {
    setData(DEFAULT_CAMPAIGN_DATA);
    setResult(null);
  };

  const handleDownloadPDF = () => {
    if (result) {
      generatePDF(data, result);
    }
  };

  const handleInputChange = (field: keyof CampaignData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]:
        field === "budget" || field === "spent" ? parseFloat(value) || 0 : value
    }));
  };

  const getStatusColor = (status: PacingResult["status"]) => {
    switch (status) {
      case "over":
        return "text-red-600";
      case "under":
        return "text-red-600";
      case "trending_high":
        return "text-orange-600";
      case "trending_low":
        return "text-orange-600";
      default:
        return "text-green-600";
    }
  };

  const getStatusEmoji = (status: PacingResult["status"]) => {
    switch (status) {
      case "over":
      case "under":
        return "🔴";
      case "trending_high":
      case "trending_low":
        return "🟠";
      default:
        return "🟢";
    }
  };

  const getStatusText = (status: PacingResult["status"]) => {
    switch (status) {
      case "over":
        return "Critically Overpacing";
      case "under":
        return "Critically Underpacing";
      case "trending_high":
        return "Slightly Overpacing";
      case "trending_low":
        return "Slightly Underpacing";
      default:
        return "On Track";
    }
  };

  // Helper to render analyst notes
  const AnalystNote: React.FC<{ children: React.ReactNode }> = ({
    children
  }) => (
    <div className="mt-3 text-xs text-gray-500 flex gap-2 items-start bg-gray-50 p-2.5 rounded-xl border border-gray-100">
      <Info className="w-3.5 h-3.5 mt-0.5 text-blue-500 shrink-0" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-[#050706] dark:text-white">
      <div className="w-full max-w-[460px] mx-auto pt-6 pb-12 px-4 flex flex-col items-center justify-center">
        {/* Signature Header - Centered */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white transform -rotate-6 flex items-center justify-center hover:scale-105 duration-300 transition-transform">
            <Calculator className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Campaign Pacing Insights
          </h1>
          <p className="text-[13px] text-gray-500 max-w-[420px] font-normal leading-relaxed">
            Analyze your campaign spend velocity, burn rates, and project your
            final landing point with precision.
          </p>
        </div>

        {/* Main Toolbox Card */}
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 p-6 text-left">
          {/* Input Section */}
          <div className="space-y-5 mb-8">
            {/* Custom Header with Reset Button */}
            <div className="flex items-center justify-between mb-1 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Campaign Inputs
                </span>
              </div>
              <button
                onClick={handleReset}
                className="group flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase tracking-wider"
                title="Clear all fields"
              >
                <RotateCcw className="w-3 h-3 transition-transform group-hover:-rotate-180" />
                Reset
              </button>
            </div>

            {/* Campaign Type Selection */}
            <SelectGroup
              label="Campaign Type"
              value={data.campaignType}
              onChange={(v) => handleInputChange("campaignType", v)}
              icon={Layers}
              options={[
                { value: "search", label: "Search (SEM/PPC)" },
                { value: "social", label: "Social (FB, IG, TikTok)" },
                { value: "display", label: "Display / Programmatic" },
                { value: "video", label: "Video (YouTube, OLV)" }
              ]}
            />

            {/* DATES */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="Start Date"
                type="date"
                icon={CalendarDays}
                value={data.startDate}
                onChange={(v) => handleInputChange("startDate", v)}
                placeholder="Select Start"
              />
              <InputGroup
                label="End Date"
                type="date"
                icon={CalendarDays}
                value={data.endDate}
                onChange={(v) => handleInputChange("endDate", v)}
                placeholder="Select End"
              />
            </div>

            <div>
              <InputGroup
                label="Today's Date"
                type="date"
                icon={Clock}
                value={data.today}
                onChange={(v) => handleInputChange("today", v)}
                placeholder="Select Today"
              />
            </div>

            {/* BUDGET */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="Total Budget"
                icon={DollarSign}
                type="number"
                value={data.budget || ""}
                onChange={(v) => handleInputChange("budget", v)}
                placeholder="e.g. 50000"
              />
              <InputGroup
                label="Spent to Date"
                icon={DollarSign}
                type="number"
                value={data.spent || ""}
                onChange={(v) => handleInputChange("spent", v)}
                placeholder="e.g. 12500"
              />
            </div>

            {/* Generate Button - Full Width */}
            <div className="pt-2">
              <button
                onClick={handleCalculate}
                className="w-full bg-[#028b6a] hover:bg-[#027a5d] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#028b6a]/20 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <Activity className="w-5 h-5" />
                Generate Results
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result ? (
            <div className="animate-fade-in space-y-2">
              <div className="h-px bg-gray-100 my-6"></div>

              {/* Results Header with Download */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Analysis Report
                </span>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-white border border-gray-200 rounded-lg text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </div>

              {/* Health Status & Visualizer */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{getStatusEmoji(result.status)}</span>
                  <div>
                    <h3 className={`text-lg font-bold ${getStatusColor(result.status)}`}>
                      {formatPercent(result.pacingPercent)} Pace
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                      Currently {getStatusText(result.status)}
                    </p>
                  </div>
                </div>

                <PacingVisualizer
                  percentTime={result.percentElapsed}
                  percentBudget={result.percentBudgetUsed}
                  status={result.status}
                />
              </div>

              {/* Campaign Timeline */}
              <SectionHeader icon={Calendar} title="Timeline Check" className="mt-8" />
              <div className="grid grid-cols-2 gap-3">
                <StatBox
                  label="Progress"
                  value={formatPercent(result.percentElapsed)}
                  subValue={`${result.daysElapsed} of ${result.totalDays} days`}
                />
                <StatBox
                  label="Remaining"
                  value={`${result.daysRemaining} days`}
                  subValue={`Until ${formatDate(data.endDate)}`}
                />
              </div>
              <AnalystNote>{getTimelineRec(data.campaignType, result.percentElapsed)}</AnalystNote>

              {/* Spend Analysis */}
              <SectionHeader icon={TrendingUp} title="Spend Analysis" className="mt-8" />
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Ideal Spend</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.idealSpend)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Actual Spend</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.actualSpend)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Variance</span>
                  <span
                    className={`text-sm font-bold ${
                      result.variance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {result.variance > 0 ? "+" : ""}
                    {formatCurrency(result.variance)}
                  </span>
                </div>
              </div>
              <AnalystNote>{getSpendStatusMsg(data.campaignType, result.pacingPercent)}</AnalystNote>

              {/* Daily Rates */}
              <SectionHeader icon={Zap} title="Burn Rates" className="mt-8" />
              <div className="grid grid-cols-2 gap-3">
                <StatBox label="Current Burn" value={`${formatCurrency(result.dailyBurnRate)}/d`} />
                <StatBox
                  label="Required Rate"
                  value={`${formatCurrency(result.requiredDailySpend)}/d`}
                  highlight={true}
                />
              </div>
              <AnalystNote>
                {result.dailyBurnRate > result.requiredDailySpend
                  ? `Reduce daily spend by ${formatCurrency(
                      result.dailyBurnRate - result.requiredDailySpend
                    )}. ${getRecommendation(data.campaignType, "reduceRate")}`
                  : `Increase daily spend by ${formatCurrency(
                      result.requiredDailySpend - result.dailyBurnRate
                    )}. ${getRecommendation(data.campaignType, "increaseRate")}`}
              </AnalystNote>

              {/* Projection */}
              <SectionHeader icon={Activity} title="Projection" className="mt-8" />
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Projected Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(result.projectedTotal)}
                  </span>
                  <span
                    className={`text-xs font-medium mt-1 ${
                      result.projectedVariance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {result.projectedVariance > 0
                      ? `Overbudget by ${formatCurrency(result.projectedVariance)}`
                      : `Underbudget by ${formatCurrency(Math.abs(result.projectedVariance))}`}
                  </span>
                </div>
              </div>
              <AnalystNote>
                {result.projectedVariance > 0
                  ? getRecommendation(data.campaignType, "projOver")
                  : getRecommendation(data.campaignType, "projUnder")}
              </AnalystNote>

              {/* Final Summary */}
              <SectionHeader icon={Lightbulb} title="Summary" className="mt-8" />
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex gap-3">
                  {result.status === "healthy" ? (
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {result.status === "over" || result.status === "trending_high" ? (
                      <>
                        <strong>Action Item:</strong> Lower daily spend target to{" "}
                        <strong>{formatCurrency(result.requiredDailySpend)}</strong>{" "}
                        immediately.
                      </>
                    ) : result.status === "under" || result.status === "trending_low" ? (
                      <>
                        <strong>Action Item:</strong> Raise daily spend target to{" "}
                        <strong>{formatCurrency(result.requiredDailySpend)}</strong>{" "}
                        to maximize impact.
                      </>
                    ) : (
                      <>
                        <strong>Action Item:</strong> Maintain current spend rate of{" "}
                        <strong>{formatCurrency(result.dailyBurnRate)}/day</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
              <p className="text-sm">Enter campaign details above to see pacing analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
