'use client';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { getSettings } from 'src/actions/app';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductosCarga from '../productos-carga';
import QuickDialog from '../producto-quick-dialog';
import { ProductosTable } from '../productos-table';
import ProductosOfertas from '../productos-ofertas';
import ProductoCarrito from '../producto-carrito-row';
import ProductosTipoCambio from '../productos-tipoCambio';
import ProductosPlantillas from '../productos-plantillas';
import { ProductosHistorialDialog } from '../productos-historial-dialog';

// ----------------------------------------------------------------------

export function ProductosListView() {
  const [openQuickDialog, setOpenQuickDialog] = useState(false);
  const [idQuickEdit, setIdQuickEdit] = useState(null);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [urlCarrito, setUrlCarrito] = useState('');
  const [settings, setSettings] = useState({});
  const [openHistorialDialog, setOpenHistorialDialog] = useState(false);

  const handleGetSettings = async () => {
    const response = await getSettings();
    setSettings(response);
  };

  const handleQuickEdit = (id) => {
    setIdQuickEdit(id);
    setOpenQuickDialog(true);
  };

  const handleOpenHistorial = () => {
    setOpenHistorialDialog(true);
  };

  const handleCloseHistorial = () => {
    setOpenHistorialDialog(false);
  };

  useEffect(() => {
    handleGetSettings();
  }, []);

  useEffect(() => {
    // build url based on productosCarrito
    let url = `${CONFIG.site.frontUrl}/carrito?productos=`;
    productosCarrito.forEach((producto) => {
      url += `${producto.id}!${producto.cantidad},`;
    });
    url = url.slice(0, -1);
    setUrlCarrito(url);
  }, [productosCarrito]);

  return (
    <>
      <QuickDialog open={openQuickDialog} setOpen={setOpenQuickDialog} id={idQuickEdit} />
      <ProductosHistorialDialog open={openHistorialDialog} onClose={handleCloseHistorial} />
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Productos"
          links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Productos' }]}
          sx={{ mb: 3 }}
          action={
            <Button
              href={paths.dashboard.productos.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo producto
            </Button>
          }
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
          {settings?.url_copiar_productos_tienda_secundaria && (
            <Button
              href={settings.url_copiar_productos_tienda_secundaria}
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
            >
              Cargar a comer
            </Button>
          )}
        </Stack>

        {productosCarrito.length > 0 && (
          <Card sx={{ mb: 2, p: 2, maxWidth: { md: '50%' } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Carrito
            </Typography>
            <Stack direction="column" gap={2} sx={{ mb: 3 }}>
              {productosCarrito &&
                productosCarrito.map((producto) => (
                  <ProductoCarrito
                    producto={producto}
                    key={producto.id}
                    productosCarrito={productosCarrito}
                    setProductosCarrito={setProductosCarrito}
                  />
                ))}
            </Stack>

            <TextField
              size="small"
              type="text"
              onClick={() => {
                navigator.clipboard.writeText(urlCarrito);
                toast.success('URL copiada al portapapeles');
              }}
              value={urlCarrito}
              sx={{ width: '100%' }}
            />
          </Card>
        )}

        <Card>
          <CardHeader
            title="Productos"
            action={
              <Button
                onClick={handleOpenHistorial}
                variant="outlined"
                color="primary"
                startIcon={<Iconify icon="solar:history-line-duotone" />}
              >
                Historial
              </Button>
            }
            sx={{ pb: 1 }}
          />
          <ProductosTable
            handleQuickEdit={handleQuickEdit}
            openQuickDialog={openQuickDialog}
            productosCarrito={productosCarrito}
            setProductosCarrito={setProductosCarrito}
          />
        </Card>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid xs={12} md={6}>
            <Stack gap={2}>
              <ProductosTipoCambio />
              <ProductosPlantillas />
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack gap={2}>
              <ProductosOfertas />
              <ProductosCarga />
            </Stack>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
