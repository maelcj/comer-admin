import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead'; // Add this import
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { getCarrito } from 'src/actions/carritos';

import { Label } from 'src/components/label';
import { ComponentBlock } from 'src/components/component-block/component-block';

const blockProps = {
  p: 0,
  overflow: 'hidden',
  alignItems: 'unset',
  flexDirection: 'column',
  bgcolor: 'background.paper',
};

export default function ViewDialog({ open, setOpen, id }) {
  const [carrito, setCarrito] = useState(null);
  const handleGetCarrito = async () => {
    const res = await getCarrito(id);
    setCarrito(res.carrito);
  };

  useEffect(() => {
    setCarrito(null);
    if (open) {
      handleGetCarrito();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle sx={{ p: 2 }}>Carrito {id}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => {
          setOpen(false);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 2, pt: 0 }}>
        {carrito ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div>
                Cliente:{' '}
                <Label color="info" variant="soft">
                  {carrito.cliente}
                </Label>
              </div>
              <div>Total: {carrito.totalFormateado}</div>
              <div>
                Creado:{' '}
                <Label color="success" variant="soft">
                  {carrito.creado}
                </Label>
              </div>
              <div>
                Actualizado:{' '}
                <Label color="success" variant="soft">
                  {carrito.actualizado}
                </Label>
              </div>
            </div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Productos:
            </Typography>
            <ComponentBlock sx={blockProps}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1 }}>Cantidad</TableCell>
                    <TableCell sx={{ py: 1 }}>Nombre</TableCell>
                    <TableCell sx={{ py: 1 }}>Precio</TableCell>
                    <TableCell sx={{ py: 1 }}>Cantidad</TableCell>
                    <TableCell sx={{ py: 1 }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrito.productos_carrito.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ py: 1 }}>{row.cantidad}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.nombre}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.precioFormateado}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.cantidad}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.totalFormateado}</TableCell>
                    </TableRow>
                  ))}
                  {carrito.refacciones_carrito.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ py: 1 }}>{row.cantidad}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.nombre}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.precioFormateado}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.cantidad}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.totalFormateado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ComponentBlock>

            <Stack
              spacing={3}
              alignItems={{ md: 'flex-start' }}
              direction={{ xs: 'column-reverse', md: 'row' }}
              sx={{ mt: 4 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  gap: 2,
                  minWidth: 260,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: 'flex',
                  typography: 'body2',
                  borderStyle: 'dashed',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6">Datos de envío:</Typography>
                <div>
                  <strong>Recibe:</strong> {carrito.datos_envio.recibe}
                  <br />
                  <strong>Empresa:</strong> {carrito.datos_envio.emresa}
                  <br />
                  <strong>Calle:</strong> {carrito.datos_envio.calle}
                  <br />
                  <strong>Colonia:</strong> {carrito.datos_envio.colonia}
                  <br />
                  <strong>Ciudad:</strong> {carrito.datos_envio.ciudad}
                  <br />
                  <strong>Estado:</strong> {carrito.datos_envio.estado}
                  <br />
                  <strong>Código Postal:</strong> {carrito.datos_envio.cp}
                  <br />
                  <strong>Teléfono:</strong> {carrito.datos_envio.telefono}
                  <br />
                  <strong>Correo:</strong> {carrito.datos_envio.correo}
                </div>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  gap: 2,
                  minWidth: 260,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: 'flex',
                  typography: 'body2',
                  borderStyle: 'dashed',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6">Datos de facturación:</Typography>
                <div>
                  <strong>Razón Social:</strong> {carrito.datos_facturacion.razon}
                  <br />
                  <strong>RFC:</strong> {carrito.datos_facturacion.rfc}
                  <br />
                  <strong>Régimen:</strong> {carrito.datos_facturacion.regimen}
                  <br />
                  <strong>Persona:</strong> {carrito.datos_facturacion.persona}
                </div>
              </Paper>
            </Stack>

            {carrito.alertas && carrito.alertas.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1, mt: 4 }}>
                  Alertas:
                </Typography>
                <ComponentBlock sx={blockProps}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ py: 1 }}>Descripción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {carrito.alertas.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ py: 1 }}>{row}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ComponentBlock>
              </>
            )}
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
