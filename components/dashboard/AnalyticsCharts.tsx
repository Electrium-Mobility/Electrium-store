"use client";
import { useState, useRef } from "react";
import { TrendingUp, DollarSign, CheckCircle, Gift } from "lucide-react";

interface AnalyticsChartsProps {
  orders: any[];
  payments: any[];
  orderStatusBreakdown: Record<string, number>;
  topProducts: any[];
  range: "7d" | "30d" | "all";
  onRangeChange: (range: "7d" | "30d" | "all") => void;
}

function getMonthLabel(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getDayLabel(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function AnalyticsCharts({
  orders,
  payments,
  orderStatusBreakdown,
  topProducts,
  range,
  onRangeChange,
}: AnalyticsChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Range selector pills
  const rangeOptions = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "All time", value: "all" },
  ];

  // Prepare chart data for orders
  let chartLabels: string[] = [];
  let chartCounts: number[] = [];
  if (orders.length > 0) {
    if (range === "all") {
      const monthMap: { [key: string]: number } = {};
      orders.forEach((o) => {
        if (o.order_date) {
          const d = new Date(o.order_date);
          const label = getMonthLabel(d);
          monthMap[label] = (monthMap[label] || 0) + 1;
        }
      });
      chartLabels = Object.keys(monthMap).sort();
      chartCounts = chartLabels.map((label) => monthMap[label]);
    } else {
      const days = range === "7d" ? 7 : 30;
      const today = new Date();
      const dayArr = Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        return d;
      });
      chartLabels = dayArr.map(getDayLabel);
      chartCounts = dayArr.map((date) => {
        const dayStr = date.toISOString().slice(0, 10);
        return orders.filter(
          (o) => o.order_date && o.order_date.slice(0, 10) === dayStr
        ).length;
      });
    }
  }

  // Prepare chart data for order value over time
  let valueChartLabels: string[] = [];
  let valueChartData: number[] = [];
  if (payments.length > 0) {
    if (range === "all") {
      const monthMap: { [key: string]: number } = {};
      payments.forEach((p) => {
        if (p.payment_date) {
          const d = new Date(p.payment_date);
          const label = getMonthLabel(d);
          monthMap[label] = (monthMap[label] || 0) + (p.payment_amount || 0);
        }
      });
      valueChartLabels = Object.keys(monthMap).sort();
      valueChartData = valueChartLabels.map((label) => monthMap[label]);
    } else {
      const days = range === "7d" ? 7 : 30;
      const today = new Date();
      const dayArr = Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        return d;
      });
      valueChartLabels = dayArr.map(getDayLabel);
      valueChartData = dayArr.map((date) => {
        const dayStr = date.toISOString().slice(0, 10);
        return payments
          .filter(
            (p) => p.payment_date && p.payment_date.slice(0, 10) === dayStr
          )
          .reduce((sum, p) => sum + (p.payment_amount || 0), 0);
      });
    }
  }

  // SVG points for orders chart
  const maxChart = Math.max(1, ...chartCounts);
  const chartWidth = Math.max(240, (chartLabels.length - 1) * 40);
  const chartHeight = 100;
  const pointsArr: [number, number][] = chartCounts.map((count, i) => [
    i * 40,
    80 - (count / maxChart) * 60,
  ]);

  // SVG points for value chart
  const maxValueChart = Math.max(1, ...valueChartData);
  const valueChartWidth = Math.max(240, (valueChartLabels.length - 1) * 40);
  const valuePointsArr: [number, number][] = valueChartData.map((value, i) => [
    i * 40,
    80 - (value / maxValueChart) * 60,
  ]);

  // Generate smooth SVG path
  function getSmoothPath(points: [number, number][]) {
    if (points.length < 2) return "";
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const cx = (x1 + x2) / 2;
      d += ` Q${cx},${y1} ${x2},${y2}`;
    }
    return d;
  }

  const pathD = getSmoothPath(pointsArr);
  const valuePathD = getSmoothPath(valuePointsArr);

  const areaD = pathD
    ? pathD +
      ` L${pointsArr[pointsArr.length - 1][0]},${chartHeight} L0,${chartHeight} Z`
    : "";
  const valueAreaD = valuePathD
    ? valuePathD +
      ` L${valuePointsArr[valuePointsArr.length - 1][0]},${chartHeight} L0,${chartHeight} Z`
    : "";

  // Tooltip logic
  function handleMouseMove(e: React.MouseEvent, chartType: "orders" | "value") {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverX(x);

    const points = chartType === "orders" ? pointsArr : valuePointsArr;
    const data = chartType === "orders" ? chartCounts : valueChartData;
    const labels = chartType === "orders" ? chartLabels : valueChartLabels;

    let minDist = Infinity;
    let idx = null;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i][0] - x);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    }
    setHoveredIndex(idx);
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
    setHoverX(null);
  }

  // Tooltip data
  const tooltip =
    hoveredIndex !== null && chartCounts[hoveredIndex] > 0
      ? {
          label: chartLabels[hoveredIndex],
          count: chartCounts[hoveredIndex],
          x: pointsArr[hoveredIndex][0],
          y: pointsArr[hoveredIndex][1],
        }
      : null;

  const valueTooltip =
    hoveredIndex !== null && valueChartData[hoveredIndex] > 0
      ? {
          label: valueChartLabels[hoveredIndex],
          value: valueChartData[hoveredIndex],
          x: valuePointsArr[hoveredIndex][0],
          y: valuePointsArr[hoveredIndex][1],
        }
      : null;

  return (
    <div className="space-y-8">
      {/* Orders Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="font-bold text-xl mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span>Orders Over Time</span>
          </div>
          <div className="flex gap-2">
            {rangeOptions.map((opt) => (
              <button
                key={opt.value}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition-all border ${
                  range === opt.value
                    ? "bg-emerald-600 text-white border-emerald-600 shadow"
                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-emerald-50"
                }`}
                onClick={() => onRangeChange(opt.value as any)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {chartCounts.length === 0 || chartCounts.every((c) => c === 0) ? (
          <div className="text-center text-gray-400 py-16 text-lg">
            No order data available
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${chartWidth} 100`}
              className="w-full h-40 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, "orders")}
              onMouseLeave={handleMouseLeave}
            >
              {areaD && (
                <path d={areaD} fill="url(#areaGradient)" opacity="0.18" />
              )}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
              {hoveredIndex !== null && (
                <line
                  x1={pointsArr[hoveredIndex][0]}
                  x2={pointsArr[hoveredIndex][0]}
                  y1={0}
                  y2={100}
                  stroke="#059669"
                  strokeDasharray="4 2"
                  strokeWidth="1.5"
                  opacity={0.5}
                />
              )}
              <g fontSize="12" fill="#bbb">
                {chartLabels.map((label, i) => (
                  <text key={i} x={i * 40} y={95} textAnchor="middle">
                    {label}
                  </text>
                ))}
              </g>
            </svg>
            {tooltip && (
              <div
                className="absolute z-10 px-4 py-2 rounded-lg shadow-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold pointer-events-none"
                style={{
                  left: Math.max(0, Math.min(chartWidth - 100, tooltip.x - 50)),
                  top: tooltip.y - 40,
                  minWidth: 80,
                }}
              >
                <div>{tooltip.label}</div>
                <div className="text-emerald-600 text-lg font-bold">
                  {tooltip.count} order{tooltip.count === 1 ? "" : "s"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Value Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="font-bold text-xl mb-4 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <span>Order Value Over Time</span>
        </div>
        {valueChartData.length === 0 || valueChartData.every((v) => v === 0) ? (
          <div className="text-center text-gray-400 py-16 text-lg">
            No payment data available
          </div>
        ) : (
          <div className="relative">
            <svg
              viewBox={`0 0 ${valueChartWidth} 100`}
              className="w-full h-40 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, "value")}
              onMouseLeave={handleMouseLeave}
            >
              {valueAreaD && (
                <path
                  d={valueAreaD}
                  fill="url(#valueAreaGradient)"
                  opacity="0.18"
                />
              )}
              <defs>
                <linearGradient
                  id="valueAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {valuePathD && (
                <path
                  d={valuePathD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}
              <g fontSize="12" fill="#bbb">
                {valueChartLabels.map((label, i) => (
                  <text key={i} x={i * 40} y={95} textAnchor="middle">
                    {label}
                  </text>
                ))}
              </g>
            </svg>
            {valueTooltip && (
              <div
                className="absolute z-10 px-4 py-2 rounded-lg shadow-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold pointer-events-none"
                style={{
                  left: Math.max(
                    0,
                    Math.min(valueChartWidth - 100, valueTooltip.x - 50)
                  ),
                  top: valueTooltip.y - 40,
                  minWidth: 80,
                }}
              >
                <div>{valueTooltip.label}</div>
                <div className="text-blue-600 text-lg font-bold">
                  ${valueTooltip.value.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="font-bold text-xl mb-6 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-purple-600" />
          <span>Order Status Breakdown</span>
        </div>
        <div className="space-y-4">
          {Object.entries(orderStatusBreakdown).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    status === "Completed" ? "bg-emerald-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="font-medium text-gray-700">{status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${(count / orders.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {count} ({((count / orders.length) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
