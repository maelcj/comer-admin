import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  enviarComentario,
  eliminarComentario,
  actualizarComentario,
} from 'src/actions/comentarios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { trashIcon, checkIcon, envelopeIcon } from 'src/components/icons';

const Comentario = ({ comentario, handleGetComentarios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(comentario.comentario || '');
  const [respuesta, setRespuesta] = useState(comentario.respuesta || '');
  const [calificacion, setCalificacion] = useState(comentario.calificacion || 5);
  const [review, setReview] = useState(comentario.review || false);

  const handleActualizarComentario = async () => {
    setIsLoading(true);
    const res = await actualizarComentario(comentario.id, content, respuesta, calificacion, review);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetComentarios();

    return toast.success(res.message);
  };

  const handleEliminarComentario = async () => {
    setIsLoading(true);
    const res = await eliminarComentario(comentario.id);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetComentarios();

    return toast.success(res.message);
  };

  const handleEnviarComentario = async () => {
    setIsLoading(true);
    const res = await enviarComentario(comentario.id);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetComentarios();

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
        <Grid xs={12} md={6}>
          <TextField
            size="small"
            label="Comentario"
            fullWidth
            multiline
            maxRows={4}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            value={content}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            size="small"
            label="Respuesta"
            fullWidth
            multiline
            maxRows={4}
            onChange={(event) => {
              setRespuesta(event.target.value);
            }}
            value={respuesta}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Box>{comentario.producto}</Box>
          <div>
            <Label>{comentario.nombre}</Label>
          </div>
          <div>
            <Label>{comentario.correo}</Label>
          </div>
          <div>
            <Label>{comentario.telefono}</Label>
          </div>

          <div>
            <Label>{new Date(comentario?.created_at).toLocaleDateString()}</Label>
          </div>

          <Box sx={{ mt: 2 }}>
            <TextField
              size="small"
              label="Calificación"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              value={calificacion}
              onChange={(e) => setCalificacion(parseInt(e.target.value, 10) || 1)}
              sx={{ mb: 1, width: '120px' }}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={review} onChange={(e) => setReview(e.target.checked)} />}
              label="Review"
            />
          </Box>
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
            handleActualizarComentario();
          }}
        >
          Actualizar
        </Button>
        {comentario.enviado === 0 && (
          <Button
            size="small"
            color="warning"
            variant="outlined"
            startIcon={envelopeIcon}
            onClick={() => {
              handleEnviarComentario();
            }}
          >
            Enviar
          </Button>
        )}
        <Button
          size="small"
          color="error"
          startIcon={trashIcon}
          onClick={() => {
            handleEliminarComentario();
          }}
        >
          Eliminar
        </Button>
      </Stack>
    </Card>
  );
};

export default Comentario;
