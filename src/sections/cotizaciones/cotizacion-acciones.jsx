'use client';

import * as NProgress from 'nprogress';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import {
  hacerPedido,
  guardarEnvio,
  aplicarDescuento,
  actualizarForzarIva,
} from 'src/actions/cotizaciones';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import CotizacionEnviarDialog from './cotizacion-enviar-dialog';

// ----------------------------------------------------------------------

const CotizacionAcciones = ({ cotizacion, handleGetCotizacion }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogEnviar, setOpenDialogEnviar] = useState(false);
  const [envio, setEnvio] = useState(cotizacion.envio);
  const [descuento, setDescuento] = useState(5);
  const [forzar_iva, setForzarIva] = useState(cotizacion.forzar_iva);

  useEffect(() => {
    setEnvio(cotizacion.envio);
    setForzarIva(cotizacion.forzar_iva);
  }, [cotizacion]);

  const handleGuardarEnvio = async () => {
    setIsLoading(true);
    const res = await guardarEnvio(cotizacion.id, envio);
    await handleGetCotizacion();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleAplicarDescuento = async () => {
    setIsLoading(true);
    const res = await aplicarDescuento(cotizacion.id, descuento);
    await handleGetCotizacion();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleActualizarForzarIva = async () => {
    setIsLoading(true);
    setForzarIva(forzar_iva === 1 ? 0 : 1);
    const res = await actualizarForzarIva(cotizacion.id, forzar_iva === 1 ? 0 : 1);
    await handleGetCotizacion();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleHacerPedido = async () => {
    setIsLoading(true);
    const res = await hacerPedido(cotizacion.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    toast.success('Pedido registrado');

    NProgress.start();
    return router.push(paths.dashboard.pedidos.edit(res.id));
  };

  return (
    <>
      <CotizacionEnviarDialog
        cotizacion={cotizacion}
        open={openDialogEnviar}
        setOpen={setOpenDialogEnviar}
      />
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

            <Stack spacing={1}>
              <Button
                size="medium"
                color="primary"
                variant="outlined"
                startIcon={<Iconify icon="fa-regular:envelope" />}
                onClick={() => {
                  setOpenDialogEnviar(true);
                }}
              >
                Enviar
              </Button>
              <Button
                size="medium"
                color="warning"
                startIcon={<Iconify icon="fa-regular:share-square" />}
                onClick={() => {
                  // copia al portapapeles
                  navigator.clipboard.writeText(
                    `${CONFIG.site.frontUrl}/cotizacion/${cotizacion?.encryptedId}`
                  );
                  toast.success('Enlace copiado al portapapeles');
                }}
              >
                Copiar enlace
              </Button>
              <Button
                size="medium"
                color="success"
                startIcon={<Iconify icon="lucide:truck" />}
                onClick={() => {
                  handleHacerPedido();
                }}
              >
                Hacer pedido
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </>
  );
};

export default CotizacionAcciones;
