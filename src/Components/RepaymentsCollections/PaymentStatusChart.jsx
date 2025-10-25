import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PaymentStatusChart = () => {
  const data = [
    { name: "On-Time", value: 80 },
    { name: "Delayed", value: 20 },
  ];
  const COLORS = ["#198754", "#dc3545"];

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-info text-white fw-semibold">
        Payment Status Overview
      </div>
      <div className="card-body d-flex justify-content-center">
        <PieChart width={250} height={200}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </div>
    </div>
  );
};

export default PaymentStatusChart;
