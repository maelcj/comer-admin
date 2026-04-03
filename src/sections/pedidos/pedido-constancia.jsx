'use client';

import { useState } from 'react';

import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { subirConstancia, eliminarConstancia } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

export const Constancia = ({ pedido, handleGetPedido }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const accept = {
    'application/pdf': ['.pdf'],
  };

  const handleSubirConstancia = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    const fileNameWithExtension = newFile.name;
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, fileNameWithExtension);
    const res = await subirConstancia(pedido.id, formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetPedido();
    return toast.success(res.message);
  };

  const handleEliminarConstancia = async () => {
    setIsLoading(true);
    const res = await eliminarConstancia(pedido.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    handleGetPedido();
    return toast.success(res.message);
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack direction="column" gap={2}>
        {pedido.datos_facturacion.constancia ? (
          <Paper
            variant="outlined"
            sx={{
              gap: 1,
              borderRadius: 2,
              display: 'flex',
              position: 'relative',
              bgcolor: 'transparent',
              p: { xs: 2.5, sm: 2 },
              alignItems: { xs: 'unset', sm: 'center' },
              flexDirection: { xs: 'row' },
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.customShadows.z20,
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'block' }}>{pedido.datos_facturacion.constancia}</Box>
            </Box>
            <Stack direction="row" gap={1}>
              <Tooltip title="Eliminar" placement="top" arrow>
                <IconButton color="error" onClick={() => handleEliminarConstancia()}>
                  <Iconify icon="fa-regular:trash-alt" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        ) : (
          <Stack direction="row">
            <UploadBox
              value={file}
              onDrop={handleSubirConstancia}
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
        )}
      </Stack>
    </>
  );
};
