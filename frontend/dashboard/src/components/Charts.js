import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function MinutesLineChart({ daily }) {
  const labels = daily.map((d) => d.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Minutes studied',
        data: daily.map((d) => d.minutes),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.2)',
        tension: 0.2
      }
    ]
  };
  return <Line data={data} />;
}

export function FocusBarChart({ daily }) {
  const labels = daily.map((d) => d.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Avg focus %',
        data: daily.map((d) => d.focusAvg),
        backgroundColor: '#10b981'
      }
    ]
  };
  return <Bar data={data} />;
}