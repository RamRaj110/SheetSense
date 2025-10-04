import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartDisplay = ({ data, type = 'bar', column }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0 || !column) return;

    const ctx = chartRef.current.getContext('2d');
    const values = data.map(item => parseFloat(item[column]) || 0);

    const chartData = {
      labels: data.map((_, index) => `Row ${index + 1}`),
      datasets: [{
        label: column,
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: type === 'area'
      }]
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: 'white' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'white' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'white' }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, column]);

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartDisplay;
