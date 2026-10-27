'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { eliminarPago } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

const TABLE_HEAD = [
  { id: 'cantidad', label: 'Cantidad', width: 50 },
  { id: 'fecha', label: 'Fecha', width: 50 },
  { id: 'banco', label: 'Banco', width: 50 },
  { id: 'forma', label: 'Forma', width: 50 },
  { id: 'acciones', label: '', width: 50, align: 'right' },
];

const Pagos = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEliminarPago = async (id) => {
    setIsLoading(true);
    const res = await eliminarPago(id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetPedido();
    return toast.success(res.message);
  };

  return (
    <Card>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Pagos:
        </Typography>
      </Box>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 520 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>
              {pedido?.pagos.map((pago) => (
                <TableRow hover key={pago.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                      pago.cantidad
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(pago.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{pago.banco}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{pago.forma}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Eliminar" placement="top" arrow>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleEliminarPago(pago.id)}
                      >
                        <Iconify icon="fa-regular:trash-alt" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {pedido?.pagos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={TABLE_HEAD.length}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      Sin registros
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
          Total pagado:{' '}
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
            pedido.total_pagos || 0
          )}
        </Typography>
      </Box>
    </Card>
  );
};

export default Pagos;
