'use client';

import 'dayjs/locale/es-mx';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import IndexPedidos from '../index-pedidos';
import IndexCotizaciones from '../index-cotizaciones';

// ----------------------------------------------------------------------

export function IndexView() {
  const { user } = useAuthContext();

  // Determinar si el usuario puede ver pedidos y cotizaciones
  const canViewPedidosAndCotizaciones = user?.role !== 'editor' && user?.role;

  return (
    <DashboardContent>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">Inicio</Typography>
      </Stack>

      {canViewPedidosAndCotizaciones && (
        <>
          <IndexPedidos />
          <IndexCotizaciones />
        </>
      )}
    </DashboardContent>
  );
}
