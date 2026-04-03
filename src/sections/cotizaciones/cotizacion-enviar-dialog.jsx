import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RadioGroup from '@mui/material/RadioGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import { esES } from '@mui/x-date-pickers/locales';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { enviarCotizacion } from 'src/actions/cotizaciones';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

export default function CotizacionEnviarDialog({ cotizacion, open, setOpen }) {
  const { user } = useAuthContext();

  const [fecha, setFecha] = useState(dayjs(cotizacion?.created_at));
  const [para, setPara] = useState(cotizacion?.cliente?.correo);
  const [copiaPara, setCopiaPara] = useState(user?.email);
  const [mensaje, setMensaje] = useState('');
  const [tiempoEntrega, setTiempoEntrega] = useState('2-6 días hábiles');
  const [moneda, setMoneda] = useState('mxn');
  const [isLoading, setIsLoading] = useState(false);
  const [envioRapido, setEnvioRapido] = useState(false);

  const handleEnviarCotizacion = async () => {
    setIsLoading(true);

    const fechaString = fecha.format('DD/MM/YYYY');

    const res = await enviarCotizacion(
      cotizacion.id,
      para,
      copiaPara,
      mensaje,
      tiempoEntrega,
      moneda,
      envioRapido,
      fechaString
    );
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setOpen(false);

    return toast.success(res.message);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle>Enviar cotización</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => {
          setOpen(false);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        <Stack direction="row" gap={2} useFlexGap flexWrap="wrap">
          <TextField
            size="small"
            label="Para"
            onChange={(event) => {
              setPara(event.target.value);
            }}
            value={para}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            size="small"
            label="Copia para"
            onChange={(event) => {
              setCopiaPara(event.target.value);
            }}
            value={copiaPara}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            size="small"
            label="Mensaje extra"
            multiline
            rows={2}
            value={mensaje}
            onChange={(event) => {
              setMensaje(event.target.value);
            }}
            sx={{ flexGrow: 1, mt: 1, width: '100%' }}
          />
          <TextField
            size="small"
            label="Tiempo de entrega"
            value={tiempoEntrega}
            onChange={(event) => {
              setTiempoEntrega(event.target.value);
            }}
            sx={{ flexGrow: 1, mt: 1 }}
          />
          <RadioGroup
            row
            value={moneda}
            onChange={(event) => {
              setMoneda(event.target.value);
            }}
            sx={{ flexGrow: 1, mt: 1 }}
          >
            <FormControlLabel value="mxn" control={<Radio size="small" />} label="mxn" />
            <FormControlLabel value="usd" control={<Radio size="small" />} label="usd" />
          </RadioGroup>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es-mx"
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <DesktopDatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ flexGrow: 1, mt: 1 }}
            />
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Switch
                onChange={(event) => {
                  setEnvioRapido(event.target.checked);
                }}
                checked={envioRapido}
              />
            }
            label="Envío rápido"
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isLoading}
          loadingPosition="start"
          startIcon={<Iconify icon="fa-regular:envelope" />}
          onClick={() => {
            handleEnviarCotizacion();
          }}
        >
          Enviar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
