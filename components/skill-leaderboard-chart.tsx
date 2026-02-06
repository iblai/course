"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { name: "Leadership", score: 85 },
  { name: "Communication", score: 78 },
  { name: "Problem Solving", score: 92 },
  { name: "Teamwork", score: 88 },
  { name: "Technical Skills", score: 75 },
]

const COLORS = ["#38A1E5", "#7284FF", "#38A1E5", "#7284FF", "#38A1E5"]

export function SkillLeaderboardChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#9ca3af" width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [`${value}%`, "Score"]}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
