'use client';

import 'dayjs/locale/es-mx';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import IndexEstadisticas from '../index-estadisticas';

// ----------------------------------------------------------------------

export function EstadisticasView() {
  return (
    <DashboardContent>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">Estadísticas</Typography>
      </Stack>

      <IndexEstadisticas />
    </DashboardContent>
  );
}
