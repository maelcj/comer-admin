'use client';

import { useState } from 'react';
import * as NProgress from 'nprogress';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { getProducto, duplicarProducto } from 'src/actions/productos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { copyIcon, arrowRightIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoFicha from '../producto-ficha';
import ProductoImagenes from '../producto-imagenes';
import { ProductoEditForm } from '../producto-edit-form';
import ProductoDescripcion from '../producto-descripcion';
import { OfertasTemporales } from '../ofertas-temporales';
import ProductosRelacionados from '../productos-relacionados';
import RefaccionesRelacionadas from '../refacciones-relacionadas/refacciones-relacionadas';

// ----------------------------------------------------------------------

export function ProductoEditView({ productoPrev, plantillasPrev }) {
  const router = useRouter();
  const [producto, setProducto] = useState(productoPrev);
  const [plantillas, setPlantillas] = useState(plantillasPrev);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetProducto = async () => {
    const res = await getProducto(producto.id);
    setProducto(res.producto);
    setPlantillas(res.plantillas);
  };

  const handleDuplicarProducto = async () => {
    setIsLoading(true);
    const res = await duplicarProducto(producto.id);
    setIsLoading(false);
    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    NProgress.start();
    router.push(paths.dashboard.productos.edit(res.idNuevo));
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar producto"
        slotProps={{ heading: { color: `primary.main` } }}
        links={[
          { name: 'Inicio', href: paths.dashboard.root },
          { name: 'Productos', href: paths.dashboard.productos.root },
          { name: producto?.nombreFinal },
        ]}
        action={
          <LoadingButton
            onClick={() => {
              handleDuplicarProducto();
            }}
            variant="soft"
            color="primary"
            loading={isLoading}
            loadingPosition="start"
            startIcon={copyIcon}
          >
            Duplicar producto
          </LoadingButton>
        }
        sx={{ mb: { xs: 1, md: 2 } }}
      />

      <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
        {producto.visible === 'si' && (
          <>
            <Typography variant="body2">
              Enlace:{' '}
              <Link href={producto.url} target="_blank">
                {producto.url}
              </Link>
            </Typography>
            {producto.categoriasNivel3.length > 0 ? (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <Typography variant="body2">Visible en:</Typography>
                {producto.categoriasNivel3.map((categoria) => (
                  <Label key={categoria.idCategoriasNivel3} variant="soft" color="primary">
                    {categoria.categoria_nivel2.categoria_nivel1.nombreCategoriaNivel1} &nbsp;
                    {arrowRightIcon}&nbsp;
                    {categoria.categoria_nivel2.nombreCategoriaNivel2}&nbsp;{arrowRightIcon}&nbsp;
                    {categoria.nombreCategoriaNivel3}
                  </Label>
                ))}
              </Stack>
            ) : (
              <Box>
                <Label variant="soft" color="error">
                  No hay categorías que coincidan
                </Label>
              </Box>
            )}
          </>
        )}
        {producto.visible !== 'si' && (
          <Box>
            <Label variant="soft" color="error">
              No visible
            </Label>
          </Box>
        )}
        {producto.disponible !== 'in stock' && (
          <Box>
            <Label variant="soft" color="error">
              Sin stock
            </Label>
          </Box>
        )}
      </Stack>

      <Card sx={{ mb: 2 }}>
        <CardHeader title="Información general" sx={{ mb: 3 }} />
        <Divider />
        <ProductoEditForm producto={producto} handleGetProducto={handleGetProducto} />
      </Card>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <OfertasTemporales producto={producto} handleGetProducto={handleGetProducto} />
        </Grid>
        <Grid xs={12} md={6}>
          <ProductoDescripcion producto={producto} />
        </Grid>
        <Grid xs={12} md={6}>
          <ProductoImagenes producto={producto} handleGetProducto={handleGetProducto} />
        </Grid>
        <Grid xs={12} md={6}>
          <ProductoFicha
            producto={producto}
            plantillas={plantillas}
            handleGetProducto={handleGetProducto}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <ProductosRelacionados producto={producto} handleGetProducto={handleGetProducto} />
        </Grid>
        <Grid xs={12} md={6}>
          <RefaccionesRelacionadas producto={producto} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
