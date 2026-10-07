import * as React from 'react';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { getCategoriaSeo, actualizarCategoriaSeo, subirImagenCategoriaSeo } from 'src/actions/seo';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import { Editor, editorClasses } from 'src/components/editor';

export default function SeoCategoriasEditarDialog({ open, setOpen, id, fetchCategorias }) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState(null);

  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');

  const [file, setFile] = useState(null);

  const accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp'],
  };

  const handleSubirImagen = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await subirImagenCategoriaSeo(id, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetCategoria();
    return toast.success(res.message);
  };

  const handleGetCategoria = async () => {
    setIsLoading(true);
    const res = await getCategoriaSeo(id);
    setCategoria(res);
    setTitle(res.title || '');
    setMetaTitle(res.meta_title || '');
    setDescription(res.description || '');
    setMetaDescription(res.meta_description || '');
    setContent(res.content || '');
    setIsLoading(false);
  };

  const handleActualizarCategoria = async () => {
    setIsLoading(true);
    const res = await actualizarCategoriaSeo(id, {
      title,
      meta_title: metaTitle,
      description,
      meta_description: metaDescription,
      content,
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  const renderLengthIndicator = (value, min, max) => {
    const { length } = value;
    let color = 'text.secondary';
    if (length > max) color = 'error.main';
    else if (min && length < min && length > 0) color = 'warning.main';
    else if (length > 0) color = 'success.main';

    return (
      <Typography variant="caption" sx={{ color }}>
        {length} / {min ? `${min}-${max}` : max} caracteres sugeridos
      </Typography>
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" scroll="body">
      <DialogTitle>Editar categoría: {categoria?.name}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 3, pt: 2, pb: 3, overflowY: 'unset' }}>
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

        <Stack spacing={3}>
          <div>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormHelperText sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>El título principal de la página.</span>
              {renderLengthIndicator(title, null, 150)}
            </FormHelperText>
          </div>

          <div>
            <TextField
              fullWidth
              label="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            <FormHelperText sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Etiqueta meta title para buscadores.</span>
              {renderLengthIndicator(metaTitle, 60, 70)}
            </FormHelperText>
          </div>

          <div>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormHelperText sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Descripción general de la categoría.</span>
              {renderLengthIndicator(description, 300, 500)}
            </FormHelperText>
          </div>

          <div>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
            <FormHelperText sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Etiqueta meta description para buscadores.</span>
              {renderLengthIndicator(metaDescription, 150, 160)}
            </FormHelperText>
          </div>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Contenido</Typography>
            <Editor
              fullItem={false}
              value={content}
              onChange={(val) => setContent(val)}
              placeholder="Escribe el contenido enriquecido aquí..."
              immediatelyRender={false}
              sx={{
                [`& .${editorClasses.content.root}`]: {
                  overflow: 'visible',
                },
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Imagen</Typography>
            {categoria?.image && (
              <Image
                src={`${CONFIG.site.serverUrl}/${categoria.image}?t=${Date.now()}`}
                sx={{ borderRadius: 1, maxWidth: '200px', height: 'auto', mb: 1 }}
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
                    <Typography variant="body2">Subir imagen</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      1200px × 630px horizontal
                    </Typography>
                  </Stack>
                }
                sx={{ py: 2, px: 2, flexGrow: 1, height: 'auto' }}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isLoading}
          loadingPosition="start"
          startIcon={<Iconify icon="fa-solid:check" />}
          onClick={handleActualizarCategoria}
        >
          Actualizar categoría
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
