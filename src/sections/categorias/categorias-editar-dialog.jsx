import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { getCategoria, eliminarCategoria, actualizarCategoria } from 'src/actions/categorias';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export default function CategoriasEditarDialog({ open, setOpen, id, fetchCategorias }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [nombre, setNombre] = useState('');
  const [filterBrands, setFilterBrands] = useState(false);

  const handleGetCategoria = async () => {
    const res = await getCategoria(id);
    setCategoria(res);
    setNombre(res.name); // backend model uses "name"
    setFilterBrands(Boolean(res.filter_brands));
  };

  const handleActualizarCategoria = async () => {
    setIsLoading(true);
    const res = await actualizarCategoria(categoria.id, nombre, filterBrands);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();

    return toast.success(res.message);
  };

  const handleEliminarCategoria = async () => {
    setIsLoading(true);
    const res = await eliminarCategoria(categoria.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();
    setOpen(false);

    return toast.success(res.message);
  };

  useEffect(() => {
    if (open && id) {
      handleGetCategoria();
    }
  }, [open, id]);

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

          <FormControlLabel
            control={
              <Checkbox
                checked={filterBrands}
                onChange={(event) => setFilterBrands(event.target.checked)}
              />
            }
            label="Habilitar filtro por marcas"
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
            handleActualizarCategoria();
          }}
        >
          Actualizar
        </LoadingButton>
        <Button
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            handleEliminarCategoria();
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
