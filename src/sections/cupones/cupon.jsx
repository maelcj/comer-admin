import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { esES } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { eliminarCupon, actualizarCupon } from 'src/actions/cupones';

import { toast } from 'src/components/snackbar';
import { trashIcon, checkIcon } from 'src/components/icons';

const Cupon = ({ cupon, handleGetCupones }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState(cupon.cupon);
  const [caducidad, setCaducidad] = useState(dayjs(cupon.caducidad));
  const [porcentaje_descuento, setPorcentaje_descuento] = useState(cupon.porcentaje_descuento);
  const [marcas, setMarcas] = useState(cupon.marcas || '');
  const [tipos, setTipos] = useState(cupon.tipos || '');
  const [mpns, setMpns] = useState(cupon.mpns || '');

  const handleActualizarCupon = async () => {
    setIsLoading(true);
    const res = await actualizarCupon(
      cupon.id,
      nombre,
      caducidad.format('YYYY-MM-DD'),
      porcentaje_descuento,
      marcas,
      tipos,
      mpns
    );

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetCupones();

    return toast.success(res.message);
  };

  const handleEliminarCupon = async () => {
    setIsLoading(true);
    const res = await eliminarCupon(cupon.id);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetCupones();

    return toast.success(res.message);
  };

  return (
    <Card sx={{ p: 2, mb: 2 }}>
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
      <Grid container spacing={2}>
        <Grid xs={12} md={3}>
          <TextField
            size="small"
            label="Cupón"
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            value={nombre}
            fullWidth
          />
        </Grid>
        <Grid xs={12} md={3}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es-mx"
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DesktopDatePicker
              label="Caducidad"
              value={caducidad}
              onChange={(newValue) => setCaducidad(newValue)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs={12} md={3}>
          <TextField
            type="number"
            size="small"
            label="% de descuento"
            onChange={(event) => {
              setPorcentaje_descuento(event.target.value);
            }}
            value={porcentaje_descuento}
            fullWidth
          />
        </Grid>

        <Grid xs={12} md={3}>
          <TextField
            size="small"
            label="Marcas (separadas por coma, sin espacios extras)"
            onChange={(event) => {
              setMarcas(event.target.value);
            }}
            value={marcas}
            fullWidth
          />
        </Grid>
        <Grid xs={12} md={3}>
          <TextField
            size="small"
            label="Tipos (singular, separados por coma, sin espacios extras)"
            onChange={(event) => {
              setTipos(event.target.value);
            }}
            value={tipos}
            fullWidth
          />
        </Grid>
        <Grid xs={12} md={3}>
          <TextField
            size="small"
            label="Mpn's (separados por coma, sin espacios extras)"
            onChange={(event) => {
              setMpns(event.target.value);
            }}
            value={mpns}
            fullWidth
          />
        </Grid>
        <Grid xs={12} md={3}>
          Veces usado: {cupon.veces_aplicado}
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Button
          size="small"
          color="primary"
          variant="outlined"
          startIcon={checkIcon}
          onClick={() => {
            handleActualizarCupon();
          }}
        >
          Actualizar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={trashIcon}
          onClick={() => {
            handleEliminarCupon();
          }}
        >
          Eliminar
        </Button>
      </Stack>
    </Card>
  );
};

export default Cupon;
