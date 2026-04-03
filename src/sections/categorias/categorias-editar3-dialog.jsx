import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  getCategoriaNivel3,
  eliminarCategoriaNivel3,
  actualizarCategoriaNivel3,
} from 'src/actions/categorias';

import { toast } from 'src/components/snackbar';
import { checkIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';

export default function CategoriasEditar3Dialog({ open, setOpen, id, fetchCategorias }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [nombre, setNombre] = useState('');
  const [singular, setSingular] = useState('');
  const [independiente, setIndependiente] = useState(0);

  const handleGetCategoriaNivel3 = async () => {
    const res = await getCategoriaNivel3(id);
    setCategoria(res);
    setNombre(res.nombreCategoriaNivel3);
    setSingular(res.singular || '');
    setIndependiente(res.independiente || 0);
  };

  const handleActializarCategoriaNivel3 = async () => {
    setIsLoading(true);
    const res = await actualizarCategoriaNivel3(
      categoria.idCategoriasNivel3,
      nombre,
      singular,
      independiente
    );
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();

    return toast.success(res.message);
  };

  const handleEliminarCategoriaNivel3 = async () => {
    setIsLoading(true);
    const res = await eliminarCategoriaNivel3(categoria.idCategoriasNivel3);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();

    setOpen(false);

    return toast.success(res.message);
  };

  useEffect(() => {
    if (open) {
      handleGetCategoriaNivel3();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle>Editar Categoría &quot;{nombre}&quot;</DialogTitle>

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
          <TextField
            size="small"
            label="Singular (si aplica)"
            onChange={(event) => {
              setSingular(event.target.value);
            }}
            value={singular}
            sx={{ flexGrow: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={independiente === 1}
                onChange={(event) => {
                  setIndependiente(event.target.checked ? 1 : 0);
                }}
              />
            }
            label="Independiente"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="outlined"
          color="primary"
          loading={isLoading}
          loadingPosition="start"
          startIcon={checkIcon}
          onClick={() => {
            handleActializarCategoriaNivel3();
          }}
        >
          Actualizar
        </LoadingButton>
        <Button
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            handleEliminarCategoriaNivel3();
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
