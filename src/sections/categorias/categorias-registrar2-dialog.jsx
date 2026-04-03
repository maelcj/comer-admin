import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { registrarCategoriaNivel2 } from 'src/actions/categorias';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export default function CategoriasRegistrar2Dialog({
  open,
  setOpen,
  idCategoriasNivel1,
  fetchCategorias,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');

  const handleRegistrarCategoriaNivel2 = async () => {
    setIsLoading(true);
    const res = await registrarCategoriaNivel2(idCategoriasNivel1, nombre);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    setNombre('');

    fetchCategorias();

    setOpen(false);

    return toast.success(res.message);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle>Registrar categoría</DialogTitle>

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

      <DialogContent sx={{ px: 3, pt: 1 }}>
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
        <Stack direction="column" gap={2} useFlexGap flexWrap="wrap">
          <TextField
            size="small"
            label="Nombre"
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            value={nombre}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="outlined"
          color="primary"
          loading={isLoading}
          loadingPosition="start"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={() => {
            handleRegistrarCategoriaNivel2();
          }}
        >
          Registrar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
