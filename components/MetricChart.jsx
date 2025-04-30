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
  const [selectedRange, setSelectedRange] = useState('1h'); // State for selected time range
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const url = `/api/metrics${selectedRange ? `?range=${selectedRange}` : ''}`;
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
  }, [selectedRange]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading metrics...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="py-4 px-2">
      <h2 className="text-xl font-bold mb-4">Emission Metrics</h2>
      <div className="h-96 w-full">
        {metrics.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No metrics found</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={metrics}
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timeStr) =>
                  new Date(timeStr).toLocaleDateString()
                }
                label={{
                  value: "Timestamp",
                  position: "bottom",
                  offset: 5,
                }}
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
                }}
                formatter={(value) => [`${value.toFixed(2)} ppm`, "Value"]}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <hr />
      <div>
        {/* Add buttons to select time range */}
        <div>
          <button onClick={() => setSelectedRange('1h')}>Last 1 Hour</button>
          <button onClick={() => setSelectedRange('5h')}>Last 5 Hours</button>
          <button onClick={() => setSelectedRange('24h')}>Last 1 Day</button>
          <button onClick={() => setSelectedRange('')}>All</button>
        </div>
        {/* Rest of your chart rendering logic */}
      </div>
    </div>
  );
}
