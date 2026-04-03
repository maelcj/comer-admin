'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { guardarDatosEnvioCarrito } from 'src/actions/carritos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const CarritoDatosEnvio = ({ carrito, handleGetCarrito }) => {
  const [datosEnvio, setDatosEnvio] = useState(carrito.datos_envio || {});

  const handleChange = (field, value) => {
    setDatosEnvio((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    const res = await guardarDatosEnvioCarrito(carrito.id, datosEnvio);
    await handleGetCarrito();

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 2 }}>
        Datos de envío:
      </Typography>

      <Stack spacing={2}>
        <TextField
          size="small"
          label="Recibe"
          value={datosEnvio.recibe || ''}
          onChange={(e) => handleChange('recibe', e.target.value)}
        />

        <TextField
          size="small"
          label="Empresa"
          value={datosEnvio.empresa || ''}
          onChange={(e) => handleChange('empresa', e.target.value)}
        />

        <TextField
          size="small"
          label="Calle"
          value={datosEnvio.calle || ''}
          onChange={(e) => handleChange('calle', e.target.value)}
        />

        <TextField
          size="small"
          label="Colonia"
          value={datosEnvio.colonia || ''}
          onChange={(e) => handleChange('colonia', e.target.value)}
        />

        <TextField
          size="small"
          label="Ciudad"
          value={datosEnvio.ciudad || ''}
          onChange={(e) => handleChange('ciudad', e.target.value)}
        />

        <TextField
          size="small"
          label="Estado"
          value={datosEnvio.estado || ''}
          onChange={(e) => handleChange('estado', e.target.value)}
        />

        <TextField
          size="small"
          label="Código Postal"
          value={datosEnvio.cp || ''}
          onChange={(e) => handleChange('cp', e.target.value)}
        />

        <TextField
          size="small"
          label="Teléfono"
          value={datosEnvio.telefono || ''}
          onChange={(e) => handleChange('telefono', e.target.value)}
        />

        <TextField
          size="small"
          label="Correo"
          value={datosEnvio.correo || ''}
          onChange={(e) => handleChange('correo', e.target.value)}
        />

        <TextField
          size="small"
          label="Instrucciones"
          multiline
          rows={3}
          value={datosEnvio.instrucciones || ''}
          onChange={(e) => handleChange('instrucciones', e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={handleGuardar}
        >
          Guardar datos de envío
        </Button>
      </Stack>
    </Card>
  );
};

export default CarritoDatosEnvio;
