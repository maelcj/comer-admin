import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { CotizacionProductosAgregarTabla } from './cotizacion-productos-agregar-tabla';

export default function CotizacionProductosAgregarDialog({
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
      <DialogTitle sx={{ p: 2 }}>Agregar productos a cotización</DialogTitle>

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
        <CotizacionProductosAgregarTabla
          cotizacion={cotizacion}
          handleGetCotizacion={handleGetCotizacion}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
