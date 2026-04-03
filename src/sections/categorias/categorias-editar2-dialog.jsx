import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import {
  getCategoriaNivel2,
  eliminarCategoriaNivel2,
  actualizarCategoriaNivel2,
  subirImagenCategoriaNivel2,
  subirImagenRefaccionesCategoriaNivel2,
} from 'src/actions/categorias';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

export default function CategoriasEditar2Dialog({ open, setOpen, id, fetchCategorias }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [nombre, setNombre] = useState('');
  const [singular, setSingular] = useState('');

  const [file, setFile] = useState(null);

  const accept = {
    'image/png': ['.png'],
  };

  const timestamp = Date.now();

  const handleSubirImagen = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await subirImagenCategoriaNivel2(categoria.idCategoriasNivel2, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetCategoriaNivel2();

    return toast.success(res.message);
  };

  const handleSubirImagenRefacciones = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await subirImagenRefaccionesCategoriaNivel2(categoria.idCategoriasNivel2, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetCategoriaNivel2();

    return toast.success(res.message);
  };

  const handleGetCategoriaNivel2 = async () => {
    const res = await getCategoriaNivel2(id);
    setCategoria(res);
    setNombre(res.nombreCategoriaNivel2);
    setSingular(res.singular || '');
  };

  const handleActializarCategoriaNivel2 = async () => {
    setIsLoading(true);
    const res = await actualizarCategoriaNivel2(categoria.idCategoriasNivel2, nombre, singular);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();

    return toast.success(res.message);
  };

  const handleEliminarCategoriaNivel2 = async () => {
    setIsLoading(true);
    const res = await eliminarCategoriaNivel2(categoria.idCategoriasNivel2);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    fetchCategorias();

    setOpen(false);

    return toast.success(res.message);
  };

  useEffect(() => {
    if (open) {
      handleGetCategoriaNivel2();
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

          <Stack direction="column" sx={{ flexGrow: 1 }} gap={2}>
            {categoria?.logoCategoria && (
              <Image
                src={`${CONFIG.site.serverUrl}/img/categorias/logoCategoria${categoria.idCategoriasNivel2}.png?t=${timestamp}`}
                sx={{ borderRadius: 1, maxWidth: '200px', height: 'auto' }}
              />
            )}

            <Stack direction="row">
              <UploadBox
                value={file}
                onDrop={handleSubirImagen}
                multiple={false}
                accept={accept}
                placeholder={
                  <Stack spacing={0.1} alignItems="center">
                    <Iconify icon="eva:cloud-upload-fill" width={30} />
                    <Typography variant="body2">Subir imagen productos</Typography>
                  </Stack>
                }
                sx={{ py: 0, flexGrow: 1, height: 'auto' }}
              />
            </Stack>
          </Stack>
          <Stack direction="column" sx={{ flexGrow: 1 }} gap={2}>
            {categoria?.logoCategoriaRefacciones && (
              <Image
                src={`${CONFIG.site.serverUrl}/img/categorias/logoCategoriaRefacciones${categoria.idCategoriasNivel2}.png?t=${timestamp}`}
                sx={{ borderRadius: 1, maxWidth: '200px', height: 'auto' }}
              />
            )}

            <Stack direction="row">
              <UploadBox
                value={file}
                onDrop={handleSubirImagenRefacciones}
                multiple={false}
                accept={accept}
                placeholder={
                  <Stack spacing={0.1} alignItems="center">
                    <Iconify icon="eva:cloud-upload-fill" width={30} />
                    <Typography variant="body2">Subir imagen refacciones</Typography>
                  </Stack>
                }
                sx={{ py: 0, flexGrow: 1, height: 'auto' }}
              />
            </Stack>
          </Stack>
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
            handleActializarCategoriaNivel2();
          }}
        >
          Actualizar
        </LoadingButton>
        <Button
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            handleEliminarCategoriaNivel2();
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
