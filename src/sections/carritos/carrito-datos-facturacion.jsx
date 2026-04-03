'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { guardarDatosFacturacionCarrito } from 'src/actions/carritos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const CarritoDatosFacturacion = ({ carrito, handleGetCarrito }) => {
  const [datosFacturacion, setDatosFacturacion] = useState(carrito.datos_facturacion || {});

  const handleChange = (field, value) => {
    setDatosFacturacion((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    const res = await guardarDatosFacturacionCarrito(carrito.id, datosFacturacion);
    await handleGetCarrito();

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 2 }}>
        Datos de facturación:
      </Typography>

      <Stack spacing={2}>
        <TextField
          size="small"
          label="Razón Social"
          value={datosFacturacion.razon || ''}
          onChange={(e) => handleChange('razon', e.target.value)}
        />

        <TextField
          size="small"
          label="RFC"
          value={datosFacturacion.rfc || ''}
          onChange={(e) => handleChange('rfc', e.target.value)}
        />

        <TextField
          size="small"
          label="Persona"
          value={datosFacturacion.persona || ''}
          onChange={(e) => handleChange('persona', e.target.value)}
        />

        <TextField
          size="small"
          label="Método de pago"
          value={datosFacturacion.metodo_pago || ''}
          onChange={(e) => handleChange('metodo_pago', e.target.value)}
        />

        <TextField
          size="small"
          label="Forma de pago"
          value={datosFacturacion.forma_pago || ''}
          onChange={(e) => handleChange('forma_pago', e.target.value)}
        />

        <TextField
          size="small"
          label="Uso CFDI"
          value={datosFacturacion.uso_cfdi || ''}
          onChange={(e) => handleChange('uso_cfdi', e.target.value)}
        />

        <TextField
          size="small"
          label="Calle"
          value={datosFacturacion.calle || ''}
          onChange={(e) => handleChange('calle', e.target.value)}
        />

        <TextField
          size="small"
          label="Colonia"
          value={datosFacturacion.colonia || ''}
          onChange={(e) => handleChange('colonia', e.target.value)}
        />

        <TextField
          size="small"
          label="Ciudad"
          value={datosFacturacion.ciudad || ''}
          onChange={(e) => handleChange('ciudad', e.target.value)}
        />

        <TextField
          size="small"
          label="Estado"
          value={datosFacturacion.estado || ''}
          onChange={(e) => handleChange('estado', e.target.value)}
        />

        <TextField
          size="small"
          label="Código Postal"
          value={datosFacturacion.cp || ''}
          onChange={(e) => handleChange('cp', e.target.value)}
        />

        <TextField
          size="small"
          label="Correo"
          value={datosFacturacion.correo || ''}
          onChange={(e) => handleChange('correo', e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={handleGuardar}
        >
          Guardar datos de facturación
        </Button>
      </Stack>
    </Card>
  );
};

export default CarritoDatosFacturacion;
