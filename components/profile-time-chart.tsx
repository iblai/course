"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", hours: 2.5 },
  { name: "Tue", hours: 1.8 },
  { name: "Wed", hours: 3.2 },
  { name: "Thu", hours: 2.1 },
  { name: "Fri", hours: 4.5 },
  { name: "Sat", hours: 1.2 },
  { name: "Sun", hours: 0.8 },
]

export function ProfileTimeChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38A1E5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38A1E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" unit="h" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [`${value} hours`, "Time Spent"]}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#38A1E5"
            fillOpacity={1}
            fill="url(#colorHours)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
