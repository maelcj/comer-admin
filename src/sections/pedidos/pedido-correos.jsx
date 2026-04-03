import 'react-quill/dist/quill.snow.css';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { enviarCorreoTransito, getPlantillasCorreosPedido } from 'src/actions/pedidos';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { envelopeIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

let PLANTILLAS = [
  {
    value: 'preparacion',
    label: 'preparación',
    asunto: 'Tu pedido se encuentra en preparación',
    mensaje: '',
  },
  { value: 'enviado', label: 'enviado', asunto: 'Tu pedido ha sido enviado', mensaje: '' },
  { value: 'entregado', label: 'entregado', asunto: 'Tu pedido ha sido entregado', mensaje: '' },
];

const Correos = ({ pedido }) => {
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [plantilla, setPlantilla] = useState(PLANTILLAS[0].value);
  const [asunto, setAsunto] = useState(PLANTILLAS[0].asunto);
  const [para, setPara] = useState(pedido?.cliente?.correo);
  const [copiaPara, setCopiaPara] = useState(user?.email);
  const [mensaje, setMensaje] = useState('');
  const [resetValue, setResetValue] = useState(false);

  const handleSetPlantilla = (event) => {
    setResetValue(true);
    setPlantilla(event.target.value);
    setAsunto(PLANTILLAS.find((p) => p.value === event.target.value).asunto);
    setMensaje(PLANTILLAS.find((p) => p.value === event.target.value).mensaje);
  };

  const handleGetPlantillasCorreosPedido = async () => {
    setIsLoading(true);
    const mensajes = await getPlantillasCorreosPedido(pedido.id);

    PLANTILLAS = PLANTILLAS.map((plantillax) => {
      const mensajex = mensajes[plantillax.value];
      return { ...plantillax, mensaje: mensajex || '' };
    });

    setMensaje(PLANTILLAS.find((p) => p.value === plantilla).mensaje);

    setIsLoading(false);
  };

  const handleEnviarCorreoTransito = async () => {
    setIsLoading(true);

    const res = await enviarCorreoTransito(pedido.id, asunto, para, copiaPara, mensaje, plantilla);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    toast.success(res.message);

    return null;
  };

  useEffect(() => {
    handleGetPlantillasCorreosPedido();
  }, [pedido]);

  return (
    <Card sx={{ mt: 2 }}>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2, pb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Enviar correo:
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <TextField
              variant="outlined"
              select
              fullWidth
              size="small"
              label="Plantilla"
              value={plantilla}
              SelectProps={{ native: true }}
              onChange={handleSetPlantilla}
            >
              {PLANTILLAS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              label="Asunto"
              value={asunto}
              onChange={(event) => setAsunto(event.target.value)}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              label="Para"
              value={para}
              onChange={(event) => setPara(event.target.value)}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              label="Copia para"
              value={copiaPara}
              onChange={(event) => setPara(event.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <Editor
              resetValue={resetValue}
              setResetValue={setResetValue}
              immediatelyRender={false}
              fullItem={false}
              value={mensaje}
              onChange={setMensaje}
              sx={{ maxHeight: 720 }}
            />
          </Grid>
          <Grid container xs={12} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              startIcon={envelopeIcon}
              onClick={() => {
                handleEnviarCorreoTransito();
              }}
              sx={{ mt: 1 }}
            >
              Enviar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default Correos;
