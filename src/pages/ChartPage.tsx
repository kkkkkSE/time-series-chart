import mockData from '@/assets/mock.json';

import { ChartValueType } from '@/types';

import TimeChart from '@/components/TimeChart';

export default function ChartPage() {
  const { response } = JSON.parse(JSON.stringify(mockData));

  const chartLabels = Object.keys(response);
  const chartValues: ChartValueType[] = Object.values(response);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>주어진 데이터를 기반으로 시계열 차트 만들기</h2>
      <TimeChart
        chartLabels={chartLabels}
        chartValues={chartValues}
      />
    </div>
  );
}
