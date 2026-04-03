'use client';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {
  reenviarPP,
  pedidoPagado,
  cancelarPedido,
  finalizarPedido,
  facturarPorAdelantado,
} from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { flagIcon, checkIcon, cancelIcon } from 'src/components/icons';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const PedidoAcciones = ({
  pedido,
  popoverSelectEstado,
  estadosPedido,
  handleGetPedido,
  handleActualizarEstado,
  isLoading,
  setIsLoading,
}) => {
  const popoverFacturarPorAdelantado = usePopover();
  const popoverPedidoPagado = usePopover();
  const popoverReenviarPP = usePopover();
  const popoverCancelarPedido = usePopover();

  const handleFacturarPorAdelantado = async () => {
    setIsLoading(true);
    const res = await facturarPorAdelantado(pedido.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handlePedidoPagado = async () => {
    setIsLoading(true);
    const res = await pedidoPagado(pedido.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);
    handleGetPedido();
    return toast.success(res.message);
  };

  const handleReenviarPP = async () => {
    setIsLoading(true);
    const res = await reenviarPP(pedido.id, true);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);
    return toast.success(res.message);
  };

  const handleFinalizarPedido = async () => {
    setIsLoading(true);
    const res = await finalizarPedido(pedido.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);
    handleGetPedido();
    return toast.success(res.message);
  };

  const handleCancelarPedido = async () => {
    setIsLoading(true);
    const res = await cancelarPedido(pedido.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);
    handleGetPedido();
    return toast.success(res.message);
  };

  return (
    <>
      <Box>
        <Button
          color="inherit"
          variant="outlined"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popoverSelectEstado.onOpen}
          sx={{ display: 'flex' }}
        >
          {estadosPedido.find((estado) => estado.id === pedido.estado)?.nombre}
        </Button>
      </Box>

      <Divider flexItem sx={{ borderStyle: 'dashed', my: 1 }} />

      <Stack spacing={1} direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
        {pedido.estado === 0 && (
          <Button
            size="medium"
            color="success"
            variant="soft"
            startIcon={checkIcon}
            onClick={() => {
              handleActualizarEstado(1);
            }}
          >
            Confirmar pedido
          </Button>
        )}

        {pedido.estado === 1 && (
          <>
            <span>
              <Button
                size="medium"
                color="success"
                variant="soft"
                startIcon={<Iconify icon="hugeicons:invoice" />}
                onClick={popoverFacturarPorAdelantado.onOpen}
              >
                Facturar por adelantado
              </Button>
            </span>
            <span>
              <Button
                size="medium"
                color="warning"
                variant="soft"
                startIcon={<Iconify icon="ph:flag-bold" />}
                onClick={popoverPedidoPagado.onOpen}
              >
                Confirmar pagado
              </Button>
            </span>
          </>
        )}

        {pedido.estado !== 0 && pedido.estado !== 1 && pedido.estado !== 3 && (
          <>
            <Button
              size="medium"
              color="success"
              variant="soft"
              startIcon={<Iconify icon="hugeicons:invoice" />}
              onClick={popoverReenviarPP.onOpen}
            >
              Reenviar PP
            </Button>
            <Button
              size="medium"
              color="warning"
              variant="soft"
              startIcon={flagIcon}
              onClick={() => {
                handleFinalizarPedido();
              }}
            >
              Finalizar
            </Button>
          </>
        )}

        {pedido.estado > 1 && (
          <Button
            size="medium"
            color="error"
            startIcon={cancelIcon}
            onClick={popoverCancelarPedido.onOpen}
          >
            Cancelar
          </Button>
        )}
      </Stack>

      <CustomPopover
        open={popoverFacturarPorAdelantado.open}
        onClose={popoverFacturarPorAdelantado.onClose}
        anchorEl={popoverFacturarPorAdelantado.anchorEl}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }} gutterBottom>
            Se enviará un correo a administración solicitando emitir la factura
          </Typography>
          <Stack direction="row" gap={2} sx={{ mt: 2 }}>
            <Button
              size="medium"
              color="success"
              variant="outlined"
              startIcon={<Iconify icon="fa-solid:check" />}
              onClick={() => {
                popoverFacturarPorAdelantado.onClose();
                handleFacturarPorAdelantado();
              }}
            >
              Aceptar
            </Button>
            <Button
              size="medium"
              color="error"
              startIcon={<Iconify icon="fa-solid:times" />}
              onClick={() => {
                popoverFacturarPorAdelantado.onClose();
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={popoverPedidoPagado.open}
        onClose={popoverPedidoPagado.onClose}
        anchorEl={popoverPedidoPagado.anchorEl}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }} gutterBottom>
            Se enviará un correo de confirmación a administración y al cliente
          </Typography>
          <Stack direction="row" gap={2} sx={{ mt: 2 }}>
            <Button
              size="medium"
              color="success"
              variant="outlined"
              startIcon={<Iconify icon="fa-solid:check" />}
              onClick={() => {
                popoverPedidoPagado.onClose();
                handlePedidoPagado();
              }}
            >
              Aceptar
            </Button>
            <Button
              size="medium"
              color="error"
              startIcon={<Iconify icon="fa-solid:times" />}
              onClick={() => {
                popoverPedidoPagado.onClose();
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={popoverReenviarPP.open}
        onClose={popoverReenviarPP.onClose}
        anchorEl={popoverReenviarPP.anchorEl}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }} gutterBottom>
            Se reenviará un correo a administración y al cliente
          </Typography>
          <Stack direction="row" gap={2} sx={{ mt: 2 }}>
            <Button
              size="medium"
              color="success"
              variant="outlined"
              startIcon={<Iconify icon="fa-solid:check" />}
              onClick={() => {
                popoverReenviarPP.onClose();
                handleReenviarPP();
              }}
            >
              Aceptar
            </Button>
            <Button
              size="medium"
              color="error"
              startIcon={<Iconify icon="fa-solid:times" />}
              onClick={() => {
                popoverReenviarPP.onClose();
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={popoverCancelarPedido.open}
        onClose={popoverCancelarPedido.onClose}
        anchorEl={popoverCancelarPedido.anchorEl}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }} gutterBottom>
            ¿Estás seguro de cancelar el pedido? Se enviará un correo a administración y al cliente.
          </Typography>
          <Stack direction="row" gap={2} sx={{ mt: 2 }}>
            <Button
              size="medium"
              color="success"
              variant="outlined"
              startIcon={<Iconify icon="fa-solid:check" />}
              onClick={() => {
                popoverCancelarPedido.onClose();
                handleCancelarPedido();
              }}
            >
              Aceptar
            </Button>
            <Button
              size="medium"
              color="error"
              startIcon={<Iconify icon="fa-solid:times" />}
              onClick={() => {
                popoverCancelarPedido.onClose();
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </CustomPopover>
    </>
  );
};

export default PedidoAcciones;
