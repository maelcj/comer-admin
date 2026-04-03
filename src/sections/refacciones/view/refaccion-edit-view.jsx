'use client';

import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { getRefaccion } from 'src/actions/refacciones';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RefaccionImagenes from '../refaccion-imagenes';
import { RefaccionEditForm } from '../refaccion-edit-form';
import ProductosRelacionados from '../productos-relacionados/productos-relacionados';

// ----------------------------------------------------------------------

export function RefaccionEditView({ refaccionPrev }) {
  const [refaccion, setRefaccion] = useState(refaccionPrev.refaccion);
  const [marcas, setMarcas] = useState(refaccionPrev.marcas || []);

  const handleGetRefaccion = async () => {
    const res = await getRefaccion(refaccion.id);
    setRefaccion(res.refaccion);
    setMarcas(res.marcas || []);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar refaccion"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Refacciones', href: paths.dashboard.refacciones.root },
          { name: refaccion?.descripcion },
        ]}
        sx={{ mb: 3 }}
      />

      <RefaccionEditForm refaccion={refaccion} marcas={marcas} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid xs={12} md={6}>
          <RefaccionImagenes refaccion={refaccion} handleGetRefaccion={handleGetRefaccion} />
        </Grid>
        <Grid xs={12} md={6}>
          <ProductosRelacionados refaccion={refaccion} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
