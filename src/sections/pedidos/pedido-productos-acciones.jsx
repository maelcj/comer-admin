'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { guardarEnvio, aplicarDescuento, actualizarForzarIva } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PedidoAcciones = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogEnviar, setOpenDialogEnviar] = useState(false);
  const [envio, setEnvio] = useState(pedido.envio);
  const [descuento, setDescuento] = useState(5);
  const [forzar_iva, setForzarIva] = useState(pedido.forzar_iva);

  useEffect(() => {
    setEnvio(pedido.envio);
    setForzarIva(pedido.forzar_iva);
  }, [pedido]);

  const handleGuardarEnvio = async () => {
    setIsLoading(true);
    const res = await guardarEnvio(pedido.id, envio);
    await handleGetPedido();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleAplicarDescuento = async () => {
    setIsLoading(true);
    const res = await aplicarDescuento(pedido.id, descuento);
    await handleGetPedido();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleActualizarForzarIva = async () => {
    setIsLoading(true);
    setForzarIva(forzar_iva === 1 ? 0 : 1);
    const res = await actualizarForzarIva(pedido.id, forzar_iva === 1 ? 0 : 1);
    await handleGetPedido();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  return (
    <Card>
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
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <TextField
            size="small"
            type="number"
            label="Envío"
            placeholder="0.00"
            value={envio}
            onChange={(e) => {
              setEnvio(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="success"
                    onClick={() => {
                      handleGuardarEnvio();
                    }}
                    sx={{ px: 0, minWidth: 45 }}
                  >
                    <Iconify icon="fa-solid:check" />
                  </Button>
                </InputAdornment>
              ),
              style: {
                paddingInlineEnd: 0,
              },
              classes: {
                input: 'notSpinner',
              },
            }}
            sx={{ minWidth: { md: 120 } }}
          />
          <TextField
            size="small"
            type="number"
            label="Descuento"
            placeholder="0.00"
            value={descuento}
            onChange={(e) => {
              setDescuento(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="success"
                    onClick={() => {
                      handleAplicarDescuento();
                    }}
                    sx={{ px: 0, minWidth: 45 }}
                  >
                    <Iconify icon="fa-solid:check" />
                  </Button>
                </InputAdornment>
              ),
              style: {
                paddingInlineEnd: 0,
              },
              classes: {
                input: 'notSpinner',
              },
            }}
            sx={{ minWidth: { md: 120 } }}
          />

          <FormControlLabel
            control={<Switch checked={forzar_iva === 1} onChange={handleActualizarForzarIva} />}
            label="Forzar Iva"
          />
        </Stack>
      </Box>
    </Card>
  );
};

export default PedidoAcciones;
