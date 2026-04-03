import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function GraficaPedidos({ grafica, totalPedidos }) {
  const theme = useTheme();

  const chart = {
    categories: grafica?.labels,
    series: [
      {
        name: 'current',
        data: [
          {
            name: 'Ventas totales',
            data: grafica?.data,
          },
        ],
      },
    ],
  };

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: chart.categories },
    ...chart.options,
  });

  return (
    <>
      {grafica && grafica.data && (
        <>
          <ChartLegends
            colors={chartOptions?.colors}
            labels={chart.series[0].data.map((item) => item.name)}
            values={[fShortenNumber(totalPedidos)]}
            sx={{ px: 3, gap: 3 }}
          />

          <Chart
            type="area"
            series={chart.series[0].data}
            options={chartOptions}
            height={320}
            loadingProps={{ sx: { p: 2.5 } }}
          />
        </>
      )}
    </>
  );
}
