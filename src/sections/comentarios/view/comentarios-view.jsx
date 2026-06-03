'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ComentariosTable } from './comentarios-table';
import { ProductosComentariosTable } from './productos-comentarios-table';

// ----------------------------------------------------------------------

export function ComentariosView() {
  const [searchMpn, setSearchMpn] = useState('');

  const handleSearchMpn = (mpn) => {
    setSearchMpn(mpn);
    // scroll to top to see the comments table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Comentarios"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Comentarios' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={5}>
        <Stack spacing={2}>
          <Typography variant="h6">Lista de Comentarios</Typography>
          <ComentariosTable searchInitialValue={searchMpn} />
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h6">Productos</Typography>
          <ProductosComentariosTable onSearchMpn={handleSearchMpn} />
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
