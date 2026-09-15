import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function IndexAnalyticsActiveUsers({ activeUsers, timeline }) {
  const theme = useTheme();

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [activeUsers, timeline]);

  const formattedTime = lastUpdate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const trafficLevel =
    (activeUsers ?? 0) >= 30 ? 'alto' : (activeUsers ?? 0) >= 20 ? 'medio' : 'bajo';
  const trafficColor =
    (activeUsers ?? 0) >= 30
      ? 'success.main'
      : (activeUsers ?? 0) >= 20
        ? 'warning.main'
        : 'info.main';

  // Invertir el array para que el eje X vaya de "hace 29 min" a "ahora"
  const sortedTimeline = useMemo(
    () => [...(timeline || [])].sort((a, b) => b.minutesAgo - a.minutesAgo),
    [timeline]
  );

  const categories = useMemo(
    () =>
      sortedTimeline.map((item) => {
        if (item.minutesAgo === 0) return 'Ahora';
        return `${item.minutesAgo}m`;
      }),
    [sortedTimeline]
  );

  const seriesData = useMemo(
    () => sortedTimeline.map((item) => item.activeUsers),
    [sortedTimeline]
  );

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    chart: {
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '70%',
      },
    },
    stroke: { show: false },
    xaxis: {
      categories,
      labels: {
        show: true,
        rotate: 0,
        style: { fontSize: '10px' },
        formatter: (val) => {
          if (val === 'Ahora') return val;
          const num = parseInt(val, 10);
          if (num % 5 === 0) return val;
          return '';
        },
      },
    },
    yaxis: {
      labels: { show: true },
      tickAmount: 3,
    },
    grid: {
      padding: { left: 8, right: 8 },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} usuario${value !== 1 ? 's' : ''}`,
        title: { formatter: () => '' },
      },
      x: { show: true },
    },
  });

  const hasTimeline = timeline && timeline.length > 0;

  return (
    <Card
      sx={{
        overflow: 'hidden',
      }}
    >
      {/* Header: contador + badge EN VIVO */}
      <Stack direction="row" alignItems="center" gap={2} sx={{ p: 3, pb: hasTimeline ? 0 : 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        >
          <Iconify icon="mdi:account-group" width={28} />
        </Box>

        <Stack spacing={0.25} sx={{ flexGrow: 1 }}>
          <Typography variant="h3" sx={{ lineHeight: 1 }}>
            {activeUsers ?? 0}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
            Usuarios activos
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Últimos 30 minutos
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Actualizado {formattedTime}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.dark,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.5, transform: 'scale(1.3)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            EN VIVO
          </Typography>
        </Stack>
      </Stack>

      {/* Gráfica de barras del timeline */}
      {hasTimeline && (
        <Chart
          type="bar"
          series={[{ name: 'Usuarios', data: seriesData }]}
          options={chartOptions}
          height={220}
          sx={{ px: 1, pb: 1 }}
        />
      )}
    </Card>
  );
}
