import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/lab/LoadingButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import {
  getImagenes,
  subirImagenCarrusel,
  subirImagenPrincipal,
  eliminarImagenCarrusel,
} from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

const ProductoImagenes = ({ producto }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagenes, setImagenes] = useState({ imagenPrincipal: null, images: [] });

  const accept = {
    'image/png': ['.jpg', '.jpeg', '.png'],
  };

  const timestamp = Date.now();

  const handleGetImagenes = async () => {
    setIsLoading(true);
    const res = await getImagenes(producto.id);
    setIsLoading(false);
    if (res) {
      setImagenes(res);
    }
  };

  useEffect(() => {
    handleGetImagenes();
  }, [producto.id]);

  const handleSubirImagenPrincipal = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await subirImagenPrincipal(producto.id, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetImagenes();
    return toast.success(res.message);
  };

  const handleSubirImagenCarrusel = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await subirImagenCarrusel(producto.id, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetImagenes();
    return toast.success(res.message);
  };

  const handleEliminarImagenCarrusel = async (id) => {
    setIsLoading(true);
    const res = await eliminarImagenCarrusel(id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetImagenes();
    return toast.success(res.message);
  };

  const carruselCount = imagenes?.images?.length || 0;

  return (
    <Card sx={{ position: 'relative' }}>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CardHeader title="Imagen principal" />

      <Stack direction="row" spacing={3} sx={{ p: 3 }}>
        {imagenes?.imagenPrincipal && (
          <Avatar
            alt={producto.name}
            src={`${CONFIG.site.serverUrl}/${imagenes.imagenPrincipal.url}?t=${timestamp}`}
            variant="rounded"
            sx={{ width: 94, height: 94, mr: 2 }}
          />
        )}
        <UploadBox
          value={file}
          onDrop={handleSubirImagenPrincipal}
          multiple={false}
          accept={accept}
          placeholder={
            <Stack spacing={0.5} alignItems="center">
              <Iconify icon="eva:cloud-upload-fill" width={40} />
              <Typography variant="body2">Subir archivo</Typography>
            </Stack>
          }
          sx={{ py: 2, flexGrow: 1, height: 'auto' }}
        />
      </Stack>

      <Divider />
      <CardHeader title="Imágenes secundarias" />

      <Stack direction="row" spacing={1} sx={{ px: 3, pt: 3 }} useFlexGap flexWrap="wrap">
        {imagenes &&
          imagenes.images &&
          imagenes.images.map(
            (image, index) =>
              image.principal === 0 && (
                <Stack direction="column" key={index} spacing={1}>
                  <Avatar
                    alt={producto.name}
                    src={`${CONFIG.site.serverUrl}/${image.url}?t=${timestamp}`}
                    variant="rounded"
                    sx={{ width: 94, height: 94, mr: 2 }}
                  />

                  <IconButton
                    color="error"
                    variant="soft"
                    onClick={() => {
                      handleEliminarImagenCarrusel(image.id);
                    }}
                  >
                    <Iconify icon="fa-solid:times" />
                  </IconButton>
                </Stack>
              )
          )}
      </Stack>

      <Stack direction="row" spacing={3} sx={{ p: 3 }}>
        <UploadBox
          value={file}
          onDrop={handleSubirImagenCarrusel}
          multiple={false}
          accept={accept}
          placeholder={
            <Stack spacing={0.5} alignItems="center">
              <Iconify icon="eva:cloud-upload-fill" width={40} />
              <Typography variant="body2">Subir archivo</Typography>
            </Stack>
          }
          sx={{ py: 1, flexGrow: 1, height: 'auto' }}
        />
      </Stack>
    </Card>
  );
};

export default ProductoImagenes;
