import React from "react";

interface PacingVisualizerProps {
  percentTime: number;
  percentBudget: number;
  status: "over" | "under" | "healthy" | "trending_high" | "trending_low";
}

export const PacingVisualizer: React.FC<PacingVisualizerProps> = ({
  percentTime,
  percentBudget,
  status
}) => {
  const getBudgetColor = () => {
    switch (status) {
      case "over":
      case "under":
        return "bg-red-500";
      case "trending_high":
      case "trending_low":
        return "bg-orange-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusLabelColor = () => {
    switch (status) {
      case "over":
      case "under":
        return "text-red-600";
      case "trending_high":
      case "trending_low":
        return "text-orange-600";
      default:
        return "text-green-600";
    }
  };

  const timeWidth = Math.min(Math.max(percentTime, 0), 100);
  const budgetWidth = Math.min(Math.max(percentBudget, 0), 100);

  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
          Visual Breakdown
        </span>
        <div className="h-px bg-gray-100 dark:bg-zinc-800 flex-grow"></div>
      </div>

      <div className="space-y-4">
        {/* Time Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              Time Elapsed
            </span>
            <span className="text-gray-900 dark:text-white font-bold">
              {percentTime.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${timeWidth}%` }}
            />
          </div>
        </div>

        {/* Budget Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getBudgetColor()}`}></span>
              Budget Used
            </span>
            <span className={`font-bold ${getStatusLabelColor()}`}>
              {percentBudget.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${getBudgetColor()}`}
              style={{ width: `${budgetWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
