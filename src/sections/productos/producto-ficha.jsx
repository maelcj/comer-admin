import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { actualizarFicha, aplicarPlantillaFicha } from 'src/actions/productos';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const ProductoFicha = ({ producto, plantillas, handleGetProducto }) => {
  const [fichaTecnica, setFichaTecnica] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idPlantilla, setIdPlantilla] = useState(plantillas[0]?.id || 0);
  const [valorCampoExtra, setValorCampoExtra] = useState('');
  const [camposExtras, setCamposExtras] = useState([]);

  useEffect(() => {
    setFichaTecnica(producto.datos_producto.ficha);
  }, [producto]);

  const handleActualizarFichaTecnica = async () => {
    setIsLoading(true);

    const campos = document.querySelectorAll('.campoFichaTecnica');
    const camposArray = {};
    campos.forEach((campo) => {
      camposArray[campo.name] = campo.value;
    });

    const camposJson = JSON.stringify(camposArray);

    const res = await actualizarFicha(producto.id, fichaTecnica, camposJson);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleAplicarPlantillaFicha = async () => {
    setIsLoading(true);
    const res = await aplicarPlantillaFicha(producto.id, idPlantilla);
    await handleGetProducto(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const agregarCampoExtra = async () => {
    if (!valorCampoExtra) return;

    const newCamposExtras = camposExtras.slice(0);
    newCamposExtras[newCamposExtras.length] = valorCampoExtra;
    setCamposExtras(newCamposExtras);

    setValorCampoExtra('');
  };

  return (
    <Card>
      <CardHeader title="Ficha técnica" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Editor
          fullItem={false}
          value={fichaTecnica}
          onChange={(value) => setFichaTecnica(value)}
          placeholder=""
          immediatelyRender={false}
          sx={{ maxHeight: 240 }}
        />
      </Stack>
      <Stack direction="row" spacing={3} sx={{ p: 3 }}>
        <TextField
          select
          size="small"
          label="Plantilla"
          value={idPlantilla}
          onChange={(event) => {
            setIdPlantilla(event.target.value);
          }}
        >
          {plantillas.map((plantilla) => (
            <MenuItem key={plantilla.id} value={plantilla.id}>
              {plantilla.nombre}
            </MenuItem>
          ))}
        </TextField>

        <LoadingButton
          variant="soft"
          color="success"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => {
            handleAplicarPlantillaFicha();
          }}
        >
          Aplicar
        </LoadingButton>
      </Stack>

      {producto?.campos && (
        <Box sx={{ px: 3 }}>
          {producto.campos.map((campo, index) => (
            <Grid key={index} container spacing={2} sx={{ mt: 0, mb: 0 }}>
              <Grid item xs={5}>
                {campo[0]}
              </Grid>
              <Grid item xs={7}>
                <TextField
                  inputProps={{ className: 'campoFichaTecnica' }}
                  size="small"
                  fullWidth
                  defaultValue={campo[1]}
                  name={campo[0]}
                />
              </Grid>
            </Grid>
          ))}

          {camposExtras.length > 0 &&
            camposExtras.map((campo, index) => (
              <Grid key={index} container spacing={2} sx={{ mt: 0, mb: 0 }}>
                <Grid item xs={5}>
                  {campo}
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    inputProps={{ className: 'campoFichaTecnica' }}
                    size="small"
                    fullWidth
                    defaultValue=""
                    name={campo}
                  />
                </Grid>
              </Grid>
            ))}

          <Grid container spacing={2} sx={{ mt: 0, mb: 0 }}>
            <Grid item xs={7}>
              <TextField
                size="small"
                fullWidth
                placeholder="agregar campo extra"
                value={valorCampoExtra}
                onChange={(event) => setValorCampoExtra(event.target.value)}
              />
            </Grid>
            <Grid item xs={5}>
              <LoadingButton
                variant="soft"
                color="success"
                size="medium"
                startIcon={<Iconify icon="fa-solid:check" />}
                loading={isLoading}
                loadingPosition="start"
                onClick={() => {
                  agregarCampoExtra();
                }}
              >
                Agregar
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      )}

      <Stack
        spacing={3}
        sx={{ px: 3, pb: 3, mt: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <LoadingButton
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => {
            handleActualizarFichaTecnica();
          }}
        >
          Guardar
        </LoadingButton>
      </Stack>
    </Card>
  );
};

export default ProductoFicha;
