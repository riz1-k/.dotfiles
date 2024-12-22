import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

export const UsageChartCard = (props: {
  title: string;
  data: {
    label: string;
    value: number;
    color: string;
    textColor: string;
  }[];
  totalAllowed: number;
  cardWidth?: string;
}) => {
  const { title, data, totalAllowed, cardWidth } = props;
  const totalCurrent = data.reduce((sum, item) => sum + item.value, 0);
  console.log({ totalCurrent });

  const pieData = [
    ...data.map((item) => ({
      name: item.label,
      value: item.value,
      color: '#1e1e1e',
    })),
    {
      name: 'Remaining',
      value: totalAllowed - totalCurrent,
      color: '#F3F4F6',
    },
  ];

  return (
    <Card className={cardWidth}>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center space-y-4'>
          {/* Pie Chart */}
          <ChartContainer config={{}} className='w-full'>
            <PieChart width={192} height={192}>
              <Pie
                data={pieData}
                cx={96}
                cy={96}
                innerRadius={0}
                outerRadius={90}
                paddingAngle={0}
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Legend */}
          <div className='flex items-center justify-center space-x-8 p-4 bg-white rounded-lg shadow-sm w-full'>
            {data.map((item, index) => (
              <div key={index} className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div className='flex flex-col'>
                  <span className='text-card-foreground text-sm'>
                    {item.label}
                  </span>
                  <span className={`text-xl font-bold `}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Remaining */}
          <span className='text-center text-foreground font-medium text-sm'>
            Total Remaining: {totalAllowed - totalCurrent} / {totalAllowed}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
