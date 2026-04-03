'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { eliminarProductoCarrito, actualizarProductoCarrito } from 'src/actions/carritos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const CarritoProductosRow = ({ producto_carrito, handleGetCarrito, setIsLoading }) => {
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    setPrecio(producto_carrito.precio);
    setCantidad(producto_carrito.cantidad);
  }, [producto_carrito]);

  const handleEliminarProductoCarrito = async () => {
    setIsLoading(true);
    const res = await eliminarProductoCarrito(producto_carrito.id);
    await handleGetCarrito();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleActualizarProductoCarrito = async () => {
    setIsLoading(true);
    const res = await actualizarProductoCarrito(producto_carrito.id, precio, cantidad);
    await handleGetCarrito();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Stack key={producto_carrito.id} alignItems="flex-end" spacing={{ xs: 2, md: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 1 }} sx={{ width: 1 }}>
        <Box sx={{ width: { md: 360 } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
            {producto_carrito.nombre}
          </Typography>
        </Box>

        <TextField
          size="small"
          type="number"
          label="Precio"
          placeholder="0.00"
          value={precio}
          onChange={(e) => {
            setPrecio(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
              </InputAdornment>
            ),
            classes: {
              input: 'notSpinner',
            },
          }}
          sx={{ minWidth: { md: 120 } }}
        />

        <TextField
          size="small"
          type="number"
          label="Cantidad"
          placeholder="0"
          value={cantidad}
          onChange={(e) => {
            setCantidad(e.target.value);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: { md: 90 } }}
        />

        <TextField
          disabled
          size="small"
          type="number"
          label="Total"
          placeholder="0.00"
          value={(precio * cantidad).toFixed(2)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { md: 120 },
            [`& .${inputBaseClasses.input}`]: {
              textAlign: { md: 'right' },
            },
          }}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="success"
          variant="outlined"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={() => {
            handleActualizarProductoCarrito();
          }}
        >
          Guardar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            handleEliminarProductoCarrito();
          }}
        >
          Eliminar
        </Button>
      </Stack>
    </Stack>
  );
};

export default CarritoProductosRow;
