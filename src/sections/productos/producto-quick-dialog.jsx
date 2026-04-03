import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { getProducto } from 'src/actions/productos';

import { ProductoEditForm } from './producto-edit-form';

export default function QuickDialog({ open, setOpen, id }) {
  const [producto, setProducto] = useState(null);
  const handleGetProducto = async () => {
    const res = await getProducto(id);
    setProducto(res.producto);
  };

  useEffect(() => {
    setProducto(null);
    if (open) {
      handleGetProducto();
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
      <DialogTitle sx={{ p: 2 }}>Editar producto</DialogTitle>

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
        {producto && <ProductoEditForm producto={producto} />}
      </DialogContent>
    </Dialog>
  );
}
