// StudentPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentPieChart = ({ boys, girls }) => {
  const data = {
    labels: ['Boys', 'Girls'],
    datasets: [
      {
        label: 'Students',
        data: [boys, girls],
        backgroundColor: ['#3b82f6', '#ec4899'], // Tailwind blue and pink
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-38 sm:h-40 md:h-60 lg:h-70">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default StudentPieChart;
