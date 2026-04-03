'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import { actualizarProductoTransito } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const PedidoProductosTransitoRow = ({ producto_pedido, handleGetPedido, setIsLoading }) => {
  const [cantidad, setCantidad] = useState(0);
  const [enviados, setEnviados] = useState(0);
  const [entregados, setEntregados] = useState(0);

  useEffect(() => {
    setCantidad(producto_pedido.cantidad);
    setEnviados(producto_pedido.enviados);
    setEntregados(producto_pedido.entregados);
  }, [producto_pedido]);

  const handleActualizarProductoTransito = async () => {
    setIsLoading(true);
    const res = await actualizarProductoTransito(producto_pedido.id, enviados, entregados);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    await handleGetPedido();

    return toast.success(res.message);
  };

  return (
    <Stack key={producto_pedido.id} alignItems="flex-end" spacing={{ xs: 2, md: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 1 }} sx={{ width: 1 }}>
        <Box sx={{ width: { md: 360 } }}>
          <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
            {producto_pedido.nombre}
          </Typography>
        </Box>

        <TextField
          disabled
          size="small"
          type="number"
          label="Cantidad"
          placeholder="0"
          value={cantidad}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: { md: 80 } }}
        />

        <TextField
          size="small"
          type="number"
          label="Enviados"
          placeholder="0.00"
          value={enviados}
          onChange={(e) => {
            setEnviados(e.target.value);
          }}
          sx={{ minWidth: { md: 80 }, appearance: '' }}
        />

        <TextField
          size="small"
          type="number"
          label="Entregados"
          placeholder="0.00"
          value={entregados}
          onChange={(e) => {
            setEntregados(e.target.value);
          }}
          sx={{ minWidth: { md: 80 } }}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="success"
          variant="outlined"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={() => {
            handleActualizarProductoTransito();
          }}
        >
          Guardar
        </Button>
      </Stack>
    </Stack>
  );
};

export default PedidoProductosTransitoRow;
