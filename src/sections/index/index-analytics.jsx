import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { getAnalyticsRealtime } from 'src/actions/analytics';

import IndexAnalyticsMap from './index-analytics-map';
import IndexAnalyticsPages from './index-analytics-pages';
import IndexAnalyticsActiveUsers from './index-analytics-active-users';

// Intervalo de actualización en segundos (configurable)
const REFRESH_INTERVAL = 30;

// ----------------------------------------------------------------------

export default function IndexAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);

      const response = await getAnalyticsRealtime();

      // La action devuelve { type: 'error', message: '...' } si falla
      if (response?.type === 'error') {
        // No limpiar data existente si es un refresh
        if (isInitial) setData(null);
      } else {
        setData(response);
      }
    } catch (err) {
      if (isInitial) setData(null);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Primera carga inmediata
    fetchData(true);

    // Polling cada REFRESH_INTERVAL segundos solo si la pestaña está visible
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchData(false);
      }
    }, REFRESH_INTERVAL * 1000);

    // Refrescar de inmediato al volver a la pestaña si estaba oculta
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData]);

  // Loading inicial
  if (isLoading) {
    return (
      <Stack spacing={2} sx={{ mt: 3 }}>
        <Skeleton variant="rounded" height={88} />
        <Grid container spacing={2}>
          <Grid xs={12} md={8}>
            <Skeleton variant="rounded" height={350} />
          </Grid>
          <Grid xs={12} md={4}>
            <Skeleton variant="rounded" height={350} />
          </Grid>
        </Grid>
      </Stack>
    );
  }

  // Sin datos
  if (!data) return null;

  return (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 1.1,
          fontSize: '0.7rem',
        }}
      >
        Google Analytics — Tiempo real
      </Typography>

      <IndexAnalyticsActiveUsers
        activeUsers={data.activeUsers}
        timeline={data.activeUsersTimeline}
      />

      <Grid container spacing={2}>
        <Grid xs={12} md={8}>
          <IndexAnalyticsMap locations={data.locations} />
        </Grid>
        <Grid xs={12} md={4}>
          <IndexAnalyticsPages pages={data.pages} />
        </Grid>
      </Grid>
    </Stack>
  );
}
