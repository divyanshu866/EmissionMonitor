"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MetricsChart() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState("1h"); // State for selected time range
  const [refresh, setRefresh] = useState(1); // State for selected time range
  const handleReset = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset all metrics? This cannot be undone!"
      )
    ) {
      try {
        const response = await fetch("/api/truncate-metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message);
        // Optional: Refresh your metrics data here if needed
        setSelectedRange("1h");
        setRefresh((prev) => prev + 1);
      } catch (error) {
        console.error("Reset failed:", error);
        alert("Failed to reset metrics. Please check the console.");
      }
    }
  };
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const url = `/api/metrics${
          selectedRange ? `?range=${selectedRange}` : ""
        }`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedRange, refresh]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading metrics...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="py-4 pl-2 pr-4">
      <h2 className="text-3xl mx-6 mt-4 font-bold mb-4">Emission Metrics</h2>
      <div className="h-96 w-full">
        {metrics.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No metrics found</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics}
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="colorGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  {metrics.map((entry, index) => {
                    if (index >= metrics.length - 1) return null;
                    const currentValue = entry.value;
                    const nextValue = metrics[index + 1].value;
                    const color =
                      currentValue > 500 || nextValue > 500 ? "red" : "#2563eb";
                    const startOffset = (index / (metrics.length - 1)) * 100;
                    const endOffset =
                      ((index + 1) / (metrics.length - 1)) * 100;
                    return [
                      <stop
                        key={`start-${index}`}
                        offset={`${startOffset}%`}
                        stopColor={color}
                      />,
                      <stop
                        key={`end-${index}`}
                        offset={`${endOffset}%`}
                        stopColor={color}
                      />,
                    ];
                  })}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timeStr) =>
                  new Date(timeStr).toLocaleTimeString()
                }
                label={{ value: "Timestamp", position: "bottom", offset: 5 }}
              />
              <YAxis
                label={{
                  value: "Emission (ppm)",
                  angle: -90,
                  position: "left",
                  offset: -6,
                }}
                tickFormatter={(value) => `${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  color: "#2865eb",
                }}
                formatter={(value) => [`${value.toFixed(2)} ppm`, "Value"]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#colorGradient)"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={payload.value > 500 ? "red" : "#2563eb"}
                    stroke="none"
                  />
                )}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <hr className="mt-4 mb-6" />
      <div>
        {/* Add buttons to select time range */}
        <div className="w-full flex justify-center items-center gap-5 my-4">
          <button
            className={`${
              selectedRange == "1h" ? "bg-slate-500" : "bg-slate-800"
            } cursor-pointer hover:bg-slate-700 p-2 border-1 rounded-xl`}
            onClick={() => setSelectedRange("1h")}
          >
            1 Hour
          </button>
          <button
            className={`${
              selectedRange == "5h" ? "bg-slate-500" : "bg-slate-800"
            } cursor-pointer hover:bg-slate-700 p-2 border-1 rounded-xl`}
            onClick={() => setSelectedRange("5h")}
          >
            5 Hours
          </button>
          <button
            className={`${
              selectedRange == "24h" ? "bg-slate-500" : "bg-slate-800"
            } cursor-pointer hover:bg-slate-700 p-2 border-1 rounded-xl`}
            onClick={() => setSelectedRange("24h")}
          >
            1 Day
          </button>
          <button
            className={`${
              selectedRange == "" ? "bg-slate-500" : "bg-slate-800"
            } cursor-pointer hover:bg-slate-700 p-2 border-1 rounded-xl`}
            onClick={() => setSelectedRange("")}
          >
            All Time
          </button>
        </div>
        <div className="w-full flex justify-center items-center gap-5 my-4">
          <button
            className={`bg-blue-900 cursor-pointer hover:bg-slate-700 px-5 py-7 border-1 rounded-full`}
            onClick={() => setRefresh((prev) => prev + 1)}
          >
            Refresh
          </button>
          <button
            className="bg-red-900 cursor-pointer hover:bg-slate-700 px-5 py-7 border-1 rounded-full"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        {/* Rest of your chart rendering logic */}
      </div>
    </div>
  );
}
