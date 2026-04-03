import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { cargarExcel } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';

const ProductosCarga = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const accept = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  };

  const handleCargarExcel = async (acceptedFiles) => {
    setIsLoading(true);
    const newFile = acceptedFiles[0];
    setFile(newFile);
    const formData = new FormData();
    formData.append('file', newFile, 'imagen');
    const res = await cargarExcel(formData);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleExportarExcel = async () => {
    // abre url
    window.open(`${CONFIG.site.serverUrl}/api/productos/exportarExcel`);
  };

  return (
    <Card>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CardHeader title="Carga y descarga" sx={{ p: 2 }} />

      <Box sx={{ px: 2, pb: 2 }}>
        <Stack direction="row">
          <UploadBox
            value={file}
            onDrop={handleCargarExcel}
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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            handleExportarExcel();
          }}
          sx={{ mt: 2 }}
        >
          Descargar excel
        </Button>
      </Box>
    </Card>
  );
};

export default ProductosCarga;
