import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { CotizacionRefaccionesAgregarTabla } from './cotizacion-refacciones-agregar-tabla';

export default function CotizacionRefaccionesAgregarDialog({
  cotizacion,
  open,
  setOpen,
  handleGetCotizacion,
}) {
  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle sx={{ p: 2 }}>Agregar refacciones a cotización</DialogTitle>

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

      <DialogContent sx={{ px: 0 }}>
        <CotizacionRefaccionesAgregarTabla
          cotizacion={cotizacion}
          handleGetCotizacion={handleGetCotizacion}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
