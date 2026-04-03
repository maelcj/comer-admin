'use client';

import { useState } from 'react';
import * as NProgress from 'nprogress';

import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { DashboardContent } from 'src/layouts/dashboard';
import { getPedido, actualizarEstado } from 'src/actions/pedidos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { TabEnvio } from '../pedido-tab-envio';
import { TabPagos } from '../pedido-tab-pagos';
import PedidoAcciones from '../pedido-acciones';
import { TabTransito } from '../pedido-tab-transito';
import { TabProductos } from '../pedido-tab-productos';

// ----------------------------------------------------------------------

export function PedidoEditView({ pedidoPrev, estadosPedido }) {
  const router = useRouter();
  const [pedido, setPedido] = useState(pedidoPrev);
  const [activeTab, setActiveTab] = useState('productos');
  const [isLoading, setIsLoading] = useState(false);

  const popoverSelectEstado = usePopover();

  const handleGetPedido = async () => {
    NProgress.start();
    const res = await getPedido(pedido.id);
    setPedido(res.pedido);
    NProgress.done();
  };

  const handleActualizarEstado = async (estado) => {
    setIsLoading(true);
    const res = await actualizarEstado(pedido.id, estado);
    await handleGetPedido();
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const mdUp = useResponsive('up', 'md');

  const handleEditCliente = (id) => {
    NProgress.start();
    router.push(paths.dashboard.clientes.edit(id));
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={
            <Stack direction="horizontal" alignItems="center" gap={1}>
              <Box>{`Pedido #${pedido?.id} `}</Box>
              <Label variant="soft" color="primary">
                {estadosPedido.find((estado) => estado.id === pedido.estado)?.nombre}
              </Label>
            </Stack>
          }
          slotProps={{ heading: { color: `primary.main` } }}
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Punto de venta', href: paths.dashboard.pos.root },
            {
              name: `${pedido?.cliente.nombre}`,
              href: paths.dashboard.clientes.edit(pedido?.cliente.id),
            },
            { name: `pedido #${pedido?.id}` },
          ]}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={2}>
          <Grid xs={12}>
            <Card>
              <Backdrop
                open={isLoading}
                sx={{
                  color: '#fff',
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  position: 'absolute',
                }}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <Stack
                spacing={2}
                direction={{ xs: 'column', md: 'row' }}
                sx={{ p: 2 }}
                divider={
                  <Divider
                    flexItem
                    orientation={mdUp ? 'vertical' : 'horizontal'}
                    sx={{ borderStyle: 'dashed' }}
                  />
                }
              >
                <Stack sx={{ width: 1 }}>
                  <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                      Cliente:
                    </Typography>

                    <Tooltip title="Editar" placement="top" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleEditCliente(pedido.cliente.id);
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">{pedido.cliente.nombre}</Typography>
                    <Typography variant="body2">{pedido.cliente.correo}</Typography>
                    <Typography variant="body2"> {pedido.cliente.telefono}</Typography>
                  </Stack>
                </Stack>
                <Stack sx={{ width: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="h5">{pedido.total_formateado}</Typography>
                    <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                      {new Date(pedido?.created_at).toLocaleDateString()} -{' '}
                      {new Date(pedido?.created_at).toLocaleTimeString()}
                    </Typography>
                    <PedidoAcciones
                      pedido={pedido}
                      handleActualizarEstado={handleActualizarEstado}
                      popoverSelectEstado={popoverSelectEstado}
                      estadosPedido={estadosPedido}
                      handleGetPedido={handleGetPedido}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card>
              <Box sx={{ p: 1 }}>
                <Tabs
                  value={activeTab}
                  onChange={(event, newValue) => setActiveTab(newValue)}
                  sx={{
                    mx: 'auto',
                    borderRadius: 1,
                    maxWidth: 520,
                  }}
                >
                  <Tab
                    iconPosition="top"
                    icon={<Iconify icon="solar:box-bold-duotone" width={24} />}
                    label="Productos"
                    value="productos"
                    sx={{
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <Tab
                    disabled={pedido.estado < 1}
                    iconPosition="top"
                    icon={<Iconify icon="solar:clipboard-text-bold-duotone" width={24} />}
                    label="Envío / Facturación"
                    value="envio"
                    sx={{
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <Tab
                    disabled={pedido.estado < 1}
                    iconPosition="top"
                    icon={<Iconify icon="solar:card-bold-duotone" width={24} />}
                    label="Pagos"
                    value="pagos"
                    sx={{
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    }}
                  />
                  <Tab
                    disabled={pedido.estado < 2}
                    iconPosition="top"
                    icon={<Iconify icon="solar:delivery-bold-duotone" width={24} />}
                    label="Tránsito"
                    value="transito"
                    sx={{
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    }}
                  />
                </Tabs>
              </Box>
            </Card>
          </Grid>
          {activeTab === 'productos' && (
            <TabProductos pedido={pedido} handleGetPedido={handleGetPedido} />
          )}
          {activeTab === 'envio' && <TabEnvio pedido={pedido} handleGetPedido={handleGetPedido} />}
          {activeTab === 'pagos' && <TabPagos pedido={pedido} handleGetPedido={handleGetPedido} />}
          {activeTab === 'transito' && (
            <TabTransito pedido={pedido} handleGetPedido={handleGetPedido} />
          )}
        </Grid>
      </DashboardContent>

      <CustomPopover
        open={popoverSelectEstado.open}
        anchorEl={popoverSelectEstado.anchorEl}
        onClose={popoverSelectEstado.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {estadosPedido.map((estado) => (
            <MenuItem
              /*
              disabled={
                estado.id === pedido.estado ||
                (estado.id === 0 && pedido.estado > 1) ||
                (estado.id === 1 && pedido.estado > 1)
              }
                */
              key={estado.id}
              selected={estado.id === pedido.estado}
              onClick={() => {
                popoverSelectEstado.onClose();
                handleActualizarEstado(estado.id);
              }}
            >
              {estado.nombre}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
