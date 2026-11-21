'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { sincronizarProductosPrecios } from 'src/actions/precios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PreciosTable } from '../precios-table';
import { PreciosResumen } from '../precios-resumen';
import { PreciosFiltros } from '../precios-filtros';
import { PreciosDetailsDialog } from '../precios-details-dialog';
import { PreciosExcluidosTable } from '../precios-excluidos-table';
import { PreciosCompetidoresTable } from '../precios-competidores-table';
import { PreciosCompetidoresFiltros } from '../precios-competidores-filtros';
import { PreciosAlertasTiendasTable } from '../precios-alertas-tiendas-table';

// ----------------------------------------------------------------------

export function PreciosListView() {
  const [currentTab, setCurrentTab] = useState('monitoreo');

  // Filtros para la pestaña de monitoreo
  const [filters, setFilters] = useState({
    marca: '',
    type: '',
    modelo: '',
    soloConCompetidores: false,
    comparativa: 'all',
  });
  const [debounceFilters] = useDebounce(filters, 400);

  const handleSelectComparativa = (value) => {
    setFilters((prev) => ({
      ...prev,
      comparativa: prev.comparativa === value && value !== 'all' ? 'all' : value,
    }));
  };

  // Filtros para la pestaña de URLs de competencia
  const [competidoresFilters, setCompetidoresFilters] = useState({
    marca: '',
    type: '',
    modelo: '',
    soloSinCompetidores: false,
  });
  const [debounceCompetidoresFilters] = useDebounce(competidoresFilters, 400);

  // Filtros compartidos para productos excluidos (marca, tipo y modelo; sin el switch de sin URLs)
  const excluidosFilters = useMemo(
    () => ({
      marca: debounceCompetidoresFilters.marca,
      type: debounceCompetidoresFilters.type,
      modelo: debounceCompetidoresFilters.modelo,
    }),
    [
      debounceCompetidoresFilters.marca,
      debounceCompetidoresFilters.type,
      debounceCompetidoresFilters.modelo,
    ]
  );

  const [competidoresRefreshKey, setCompetidoresRefreshKey] = useState(0);
  const [excluidosRefreshKey, setExcluidosRefreshKey] = useState(0);
  const [syncRefreshKey, setSyncRefreshKey] = useState(0);

  const [openSyncConfirm, setOpenSyncConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    setSelectedProduct(null);
  };

  const handleConfirmSync = async () => {
    setOpenSyncConfirm(false);
    setIsSyncing(true);

    try {
      const res = await sincronizarProductosPrecios();

      if (res?.success) {
        toast.success(res.message || 'Sincronización de productos completada correctamente');
        setSyncRefreshKey((prev) => prev + 1);
      } else if (res?.already_running) {
        toast.warning(
          res.message || 'Ya hay una sincronización en curso. Intenta de nuevo en unos momentos.'
        );
      } else {
        toast.error(res?.message || 'Error al sincronizar los productos de la tienda');
      }
    } catch (error) {
      console.error('Error ejecutando sincronización manual:', error);
      toast.error('Ocurrió un error inesperado durante la sincronización');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {/* Overlay bloqueante durante la sincronización */}
      <Backdrop
        open={isSyncing}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 100,
          color: '#fff',
          backdropFilter: 'blur(3px)',
          bgcolor: 'rgba(16, 24, 40, 0.72)',
        }}
      >
        <Card
          sx={{
            p: 4,
            maxWidth: 420,
            mx: 2,
            borderRadius: 2.5,
            textAlign: 'center',
            boxShadow: (theme) => theme.customShadows?.z24 || 24,
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <CircularProgress size={48} thickness={4} />
            <Stack spacing={0.75}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Sincronizando productos...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Actualizando precios actuales y vistas de la tienda en el monitor de precios. Por
                favor espera a que finalice el proceso y no cierres esta pestaña.
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Backdrop>

      {/* Diálogo de confirmación para sincronización manual */}
      <Dialog
        open={openSyncConfirm}
        onClose={() => setOpenSyncConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon="solar:refresh-circle-bold-duotone"
              width={26}
              sx={{ color: 'primary.main' }}
            />
            <Typography variant="h6">Sincronizar precios</Typography>
          </Stack>
          <IconButton onClick={() => setOpenSyncConfirm(false)} size="small">
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2.5 }}>
          <Stack spacing={2}>
            <Typography variant="body2">
              ¿Deseas ejecutar manualmente la sincronización de productos activos de esta tienda
              hacia el monitor de precios?
            </Typography>

            <Alert severity="info" variant="outlined">
              Se actualizarán los precios actuales y vistas de la tienda actual. La pantalla
              permanecerá bloqueada hasta que finalice el cálculo y luego se recargarán las tablas
              automáticamente.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenSyncConfirm(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSync}
            startIcon={<Iconify icon="solar:refresh-bold" />}
          >
            Sí, sincronizar
          </Button>
        </DialogActions>
      </Dialog>

      <PreciosDetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetails}
        product={selectedProduct}
      />

      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Monitoreo de Precios"
          links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Precios' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              disabled={isSyncing}
              onClick={() => setOpenSyncConfirm(true)}
              startIcon={<Iconify icon="solar:refresh-bold" />}
            >
              Sincronizar precios
            </Button>
          }
          sx={{ mb: 3 }}
        />

        {/* Pestañas de Navegación */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.background.neutral}`,
            }}
          >
            <Tab
              value="monitoreo"
              label="Monitoreo y Comparativa"
              icon={<Iconify icon="solar:chart-square-bold-duotone" width={22} />}
              iconPosition="start"
            />
            <Tab
              value="competidores"
              label="URLs de la Competencia"
              icon={<Iconify icon="solar:link-circle-bold-duotone" width={22} />}
              iconPosition="start"
            />
          </Tabs>
        </Card>

        {/* Pestaña 1: Monitoreo */}
        {currentTab === 'monitoreo' && (
          <>
            {/* 1. Resumen analítico */}
            <PreciosResumen
              filters={debounceFilters}
              selectedComparativa={filters.comparativa}
              onSelectComparativa={handleSelectComparativa}
              refreshTrigger={syncRefreshKey}
            />

            {/* 2. Filtros de monitoreo */}
            <PreciosFiltros filters={filters} onFiltersChange={setFilters} />

            {/* 3. Tabla de monitoreo */}
            <PreciosTable
              filters={debounceFilters}
              onOpenDetails={handleOpenDetails}
              refreshTrigger={syncRefreshKey}
            />

            {/* 4. Tabla de alertas por diferencia de precios entre tiendas */}
            <PreciosAlertasTiendasTable
              onOpenDetails={handleOpenDetails}
              refreshTrigger={syncRefreshKey}
            />
          </>
        )}

        {/* Pestaña 2: Administrar URLs de la Competencia */}
        {currentTab === 'competidores' && (
          <>
            {/* Filtros específicos de administración de URLs */}
            <PreciosCompetidoresFiltros
              filters={competidoresFilters}
              onFiltersChange={setCompetidoresFilters}
            />

            {/* Tabla para administrar URLs de competencia */}
            <PreciosCompetidoresTable
              filters={debounceCompetidoresFilters}
              refreshTrigger={competidoresRefreshKey + syncRefreshKey}
              onProductExcluded={() => setExcluidosRefreshKey((prev) => prev + 1)}
            />

            {/* Tabla para ver y administrar productos excluidos */}
            <PreciosExcluidosTable
              filters={excluidosFilters}
              refreshTrigger={excluidosRefreshKey + syncRefreshKey}
              onProductRestored={() => setCompetidoresRefreshKey((prev) => prev + 1)}
            />
          </>
        )}
      </DashboardContent>
    </>
  );
}
