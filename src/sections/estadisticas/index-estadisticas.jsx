import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { esES } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { getResumenEstadisticas, ejecutarProductosMerchant } from 'src/actions/estadisticas';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import EstadisticasTable from './estadisticas-table';

const IndexEstadisticas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).startOf('month'));
  const [fechaFin, setFechaFin] = useState(dayjs(new Date()));
  const [resumen, setResumen] = useState({ totalVentas: 0, totalCotizaciones: 0 });
  const tablaEstadisticasRef = useRef();

  const handleTablaEstadisticasRef = () => {
    if (tablaEstadisticasRef.current) {
      tablaEstadisticasRef.current.fetchTableData();
    }
  };

  const aplicarRangoFechas = async () => {
    // check if fechaInicio is before fechaFin
    if (!fechaInicio.isBefore(fechaFin) && !fechaInicio.isSame(fechaFin)) {
      return toast.error('la fecha de inicio no puede ser mayor a la fecha final');
    }

    handleGetResumen();
    handleTablaEstadisticasRef();

    return null;
  };

  const handleGetResumen = async () => {
    setIsLoading(true);
    // dates to string
    const fechaInicioString = fechaInicio.format('YYYY-MM-DD');
    const fechaFinString = fechaFin.format('YYYY-MM-DD');

    const response = await getResumenEstadisticas(fechaInicioString, fechaFinString);

    if (response && response.totalVentas !== undefined) {
      setResumen(response);
    }
    setIsLoading(false);
  };

  const handleEjecutarProductosMerchant = async () => {
    try {
      setIsLoading(true);
      const response = await ejecutarProductosMerchant();

      if (response && response.success) {
        toast.success(response.message || 'Job ProductosMerchant ejecutado correctamente');
      } else {
        toast.error(response.message || 'Error al ejecutar el job');
      }
    } catch (error) {
      toast.error('Error al ejecutar ProductosMerchant');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetResumen();
  }, []);

  return (
    <>
      <Stack>
        <Stack flexGrow={1} direction="row" alignItems="center" justifyContent="space-between">
          <Button
            onClick={handleEjecutarProductosMerchant}
            variant="outlined"
            color="primary"
            disabled={isLoading}
            startIcon={<Iconify icon="solar:play-bold" />}
          >
            Ejecutar ProductosMerchant
          </Button>

          <Stack direction="row" alignItems="center">
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="es-mx"
              localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <DesktopDatePicker
                label="De"
                value={fechaInicio}
                onChange={(newValue) => setFechaInicio(newValue)}
                slotProps={{ textField: { size: 'small' } }}
                sx={{ maxWidth: 150 }}
              />
              <Iconify icon="weui:arrow-filled" sx={{ color: 'text.disabled' }} />
              <DesktopDatePicker
                label="A"
                value={fechaFin}
                onChange={(newValue) => setFechaFin(newValue)}
                slotProps={{ textField: { size: 'small' } }}
                sx={{ maxWidth: 150 }}
              />
              <Button
                onClick={() => {
                  aplicarRangoFechas();
                }}
                color="primary"
                variant="outlined"
                sx={{ ml: 1 }}
              >
                Aplicar
              </Button>
            </LocalizationProvider>
          </Stack>
        </Stack>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              $
              {resumen.totalVentas
                ? Number(resumen.totalVentas).toLocaleString('es-MX', { minimumFractionDigits: 2 })
                : '0.00'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total en Ventas
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              $
              {resumen.totalCotizaciones
                ? Number(resumen.totalCotizaciones).toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                  })
                : '0.00'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total en Cotizaciones
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 2 }}>
        <Backdrop
          open={isLoading}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <EstadisticasTable
          ref={tablaEstadisticasRef}
          fechaInicio={fechaInicio.format('YYYY-MM-DD')}
          fechaFin={fechaFin.format('YYYY-MM-DD')}
        />
      </Card>
    </>
  );
};

export default IndexEstadisticas;
