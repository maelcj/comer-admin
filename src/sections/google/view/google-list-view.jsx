'use client';

import Link from 'next/link';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GoogleTable } from '../google-table';
import { TiposProductosTable } from '../tipos-productos-table';

// ----------------------------------------------------------------------

export function GoogleListView() {
  const theme = useTheme();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categorías de Productos de Google"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Categorías de Productos de Google' },
        ]}
        action={
          <Link href={paths.dashboard.google.create} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{
                bgcolor: theme.vars.palette.common.black,
                color: theme.vars.palette.common.white,
                '&:hover': {
                  bgcolor: theme.vars.palette.grey[800],
                },
              }}
            >
              Nueva Categoría
            </Button>
          </Link>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={4}>
        <GoogleTable />
        <TiposProductosTable />
      </Stack>
    </DashboardContent>
  );
}
