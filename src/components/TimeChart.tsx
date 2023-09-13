import { useState } from 'react';

import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  registerables,
  TimeSeriesScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import { format, isSameDay } from 'date-fns';

import { ChartValueType } from '@/types';

import FilterButtons from './FilterButtons';

ChartJS.register(...registerables);
ChartJS.register(
  TimeSeriesScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const KEYWORD_CLEAR_FILTER = '필터 해제';

interface TimeChartProps {
  chartLabels: string[];
  chartValues: ChartValueType[];
}

const X_AXIS_ID_1 = 'x1';
const X_AXIS_ID_2 = 'x2';
const Y_AXIS_ID_1 = 'y1';
const Y_AXIS_ID_2 = 'y2';

export default function TimeChart({
  chartLabels, chartValues,
}: TimeChartProps) {
  const [filterKeyword, setFilterKeyword] = useState('');

  const extractedRegions = new Set([...chartValues.map((item) => item.id)]);

  const changeFilterKeyword = (keyword: string) => {
    setFilterKeyword(keyword);
  };

  const chartData: ChartData = {
    labels: chartLabels,
    datasets: [
      {
        type: 'line',
        label: 'Value Area',
        data: chartValues.map((chartValue: ChartValueType) => chartValue.value_area),
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'transparent',
        fill: true,
        pointBackgroundColor: '#3e3ec8',
        pointRadius: (ctx) => {
          if (!ctx) return 0;

          const index = ctx.dataIndex;

          if (chartValues[index]?.id === filterKeyword) return 2;

          return 0;
        },
        xAxisID: X_AXIS_ID_1,
        yAxisID: Y_AXIS_ID_1,
      },
      {
        type: 'bar',
        label: 'Value Bar',
        data: chartValues.map((chartValue: ChartValueType) => chartValue.value_bar),
        backgroundColor: (ctx) => {
          if (!ctx) return 'transparent';
          const index = ctx.dataIndex;

          if (chartValues[index]?.id === filterKeyword) return 'rgba(255, 99, 132, 1)';

          return 'rgba(255, 99, 132, 0.5)';
        },
        xAxisID: X_AXIS_ID_1,
        yAxisID: Y_AXIS_ID_2,
      },
    ],
  };

  const options: ChartOptions = {
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            const { dataIndex } = context[0];

            return chartValues[dataIndex]?.id;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    onClick: (_, element) => {
      if (element.length === 0) return;

      const { index } = element[0];

      changeFilterKeyword(chartValues[index]?.id);
    },
    hover: {
      mode: 'index',
    },
    scales: {
      [X_AXIS_ID_1]: {
        type: 'timeseries',
        time: {
          unit: 'second',
          displayFormats: {
            second: 'HH:mm:ss',
          },
        },
        ticks: {
          source: 'auto',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      [X_AXIS_ID_2]: {
        type: 'timeseries',
        border: {
          display: false,
        },
        time: {
          unit: 'day',
          displayFormats: {
            day: 'yyyy-MM-dd',
          },
        },
        ticks: {
          source: 'auto',
          callback: (label: string | number, index: number) => {
            const date = new Date(label);
            const formattedDate = format(date, 'yyyy.MM.dd');

            if (index === 0) return formattedDate;

            const prevDate = new Date(chartLabels[index]);

            if (isSameDay(date, prevDate)) return null;

            return formattedDate;
          },
        },
        title: {
          display: true,
          text: 'Time Scale',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
        },
      },
      [Y_AXIS_ID_1]: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 200,
        title: {
          display: true,
          text: 'Value Bar',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
      [Y_AXIS_ID_2]: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        title: {
          display: true,
          text: 'Value Area',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div>
      <FilterButtons
        regions={[KEYWORD_CLEAR_FILTER, ...extractedRegions]}
        changeFilterKeyword={changeFilterKeyword}
      />
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
