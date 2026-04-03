import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { useRef, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import { esES } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { getTotalPedidos, getGraficaPedidos } from 'src/actions/index';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import TablaPedidos from '../pedidos/pedidos-tabla';
import { GraficaPedidos } from './index-pedidos-grafica';

const IndexPedidos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).startOf('month'));
  const [fechaFin, setFechaFin] = useState(dayjs(new Date()));
  const [grafica, setGrafica] = useState([]);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const tablaPedidosRef = useRef();

  const handleTablaPedidosRef = () => {
    tablaPedidosRef.current.fetchTableData();
  };

  const aplicarRangoFechas = async () => {
    // check if fechaInicio is before fechaFin
    if (!fechaInicio.isBefore(fechaFin) && !fechaInicio.isSame(fechaFin)) {
      return toast.error('la fecha de inicio no puede ser mayor a la fecha final');
    }

    handleGetGrafica();
    handleGetTotalPedidos();

    handleTablaPedidosRef();

    return null;
  };

  const handleGetGrafica = async () => {
    setIsLoading(true);
    // dates to string
    const fechaInicioString = fechaInicio.format('YYYY-MM-DD');
    const fechaFinString = fechaFin.format('YYYY-MM-DD');

    const response = await getGraficaPedidos(fechaInicioString, fechaFinString);

    setGrafica(response);
    setIsLoading(false);
  };

  const handleGetTotalPedidos = async () => {
    // dates to string
    const fechaInicioString = fechaInicio.format('YYYY-MM-DD');
    const fechaFinString = fechaFin.format('YYYY-MM-DD');

    const response = await getTotalPedidos(fechaInicioString, fechaFinString);

    setTotalPedidos(response);
  };

  useEffect(() => {
    handleGetGrafica();
    handleGetTotalPedidos();
  }, []);

  return (
    <>
      <Stack>
        <Stack flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
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

      <Card sx={{ mt: 2, p: 2 }}>
        <Backdrop
          open={isLoading}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            {grafica && grafica.data && (
              <GraficaPedidos grafica={grafica} totalPedidos={totalPedidos} />
            )}
          </Grid>
          <Grid xs={12} md={6}>
            <TablaPedidos
              ref={tablaPedidosRef}
              fechaInicio={fechaInicio.format('YYYY-MM-DD')}
              fechaFin={fechaFin.format('YYYY-MM-DD')}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default IndexPedidos;
