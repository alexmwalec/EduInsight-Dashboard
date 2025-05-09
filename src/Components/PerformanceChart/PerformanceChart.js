import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TeacherDashboardLineChart = () => {
  const lineData = {
    labels: ["Week 3", "Week 5", "Week 7", "Week 9"],
    datasets: [
      {
        label: "Boys - Math",
        data: [62, 65, 67, 70],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
      {
        label: "Girls - Math",
        data: [70, 74, 77, 67],
        borderColor: "#ec4899",
        backgroundColor: "#ec4899",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Math Performance (Line Chart)</h2>
      <Line data={lineData} />
    </div>
  );
};

export default TeacherDashboardLineChart;
