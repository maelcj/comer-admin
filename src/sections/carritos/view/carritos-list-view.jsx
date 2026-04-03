'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { createCarrito, testApiCarrito } from 'src/actions/carritos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ViewDialog from '../carrito-view-dialog';
import { CarritosTable } from '../carritos-table';

// ----------------------------------------------------------------------

export function CarritosListView() {
  const router = useRouter();
  const [openCarritoDialog, setOpenCarritoDialog] = useState(false);
  const [idCarritoView, setIdCarritoView] = useState(null);
  const [testCarritoId, setTestCarritoId] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const handleViewCarrito = (id) => {
    setIdCarritoView(id);
    setOpenCarritoDialog(true);
  };

  const handleCreateCarrito = async () => {
    const res = await createCarrito();
    if (res?.carrito?.id) {
      router.push(paths.dashboard.carritos.edit(res.carrito.id));
      toast.success('Carrito creado exitosamente');
    } else {
      toast.error('Error al crear carrito');
    }
  };

  const handleTestApiCarrito = async () => {
    if (!testCarritoId) {
      toast.error('Ingresa un ID de carrito');
      return;
    }

    setIsLoadingApi(true);
    setApiResponse(null);

    try {
      const data = await testApiCarrito(testCarritoId);
      setApiResponse(data);
      toast.success('Respuesta recibida');
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      toast.error(`Error: ${error.message}`);
      setApiResponse({
        error: error.message,
        details: error.toString(),
      });
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <>
      <ViewDialog open={openCarritoDialog} setOpen={setOpenCarritoDialog} id={idCarritoView} />
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Carritos"
          links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Carritos' }]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateCarrito}
          >
            Nuevo carrito
          </Button>
        </Box>
        <Card sx={{ mb: 3 }}>
          <CarritosTable handleViewCarrito={handleViewCarrito} />
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Probar API de Carrito (Frontend)
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Esta sección permite probar la ruta de la API del carrito del frontend de la tienda.
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                label="ID del Carrito"
                value={testCarritoId}
                onChange={(e) => setTestCarritoId(e.target.value)}
                placeholder="Ej: 1"
                sx={{ width: 200 }}
              />
              <Button
                variant="contained"
                onClick={handleTestApiCarrito}
                disabled={isLoadingApi}
                startIcon={
                  isLoadingApi ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="mdi:api" />
                  )
                }
              >
                Consultar API
              </Button>
              {apiResponse && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setApiResponse(null)}
                  startIcon={<Iconify icon="mdi:close" />}
                >
                  Limpiar
                </Button>
              )}
            </Stack>

            {apiResponse && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: 500,
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Respuesta del servidor:
                </Typography>
                <Box
                  component="div"
                  role="button"
                  tabIndex={0}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
                      toast.success('Contenido copiado al portapapeles');
                    } catch (error) {
                      toast.error('Error al copiar al portapapeles');
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      try {
                        await navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
                        toast.success('Contenido copiado al portapapeles');
                      } catch (error) {
                        toast.error('Error al copiar al portapapeles');
                      }
                    }
                  }}
                  sx={{
                    m: 0,
                    p: 0,
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontFamily: 'monospace',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  title="Click para copiar"
                >
                  {JSON.stringify(apiResponse, null, 2)}
                </Box>
              </Box>
            )}
          </Stack>
        </Card>
      </DashboardContent>
    </>
  );
}
