import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import { registrarPlantilla } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';

import PlantillaDialog from './productos-plantillas-dialog';
import ProductosPlantillasTabla from './productos-plantillas-tabla';

const ProductosPlantillas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [idPlantilla, setIdPlantilla] = useState(null);
  const [nombreRegistrarPlantilla, setNombreRegistrarPlantilla] = useState('');

  const handleRegistrarPlantilla = async () => {
    if (!nombreRegistrarPlantilla) return toast.error('El nombre no puede estar vacío');

    setIsLoading(true);
    const res = await registrarPlantilla(nombreRegistrarPlantilla);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setNombreRegistrarPlantilla('');

    setIdPlantilla(res.id);

    setIsOpenDialog(true);

    return toast.success(res.message);
  };

  return (
    <>
      <PlantillaDialog open={isOpenDialog} setOpen={setIsOpenDialog} idPlantilla={idPlantilla} />
      <Card>
        <CardHeader title="Plantillas de fichas" sx={{ p: 2 }} />
        <Box sx={{ px: 2 }}>
          <Stack direction="row" gap={1} sx={{ mt: 1, mb: 0 }}>
            <TextField
              inputProps={{ className: 'campoFichaTecnica' }}
              size="small"
              value={nombreRegistrarPlantilla}
              onChange={(e) => setNombreRegistrarPlantilla(e.target.value)}
              sx={{ width: '100%', maxWidth: '300px' }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleRegistrarPlantilla();
              }}
            >
              Registrar
            </Button>
          </Stack>
        </Box>
        <ProductosPlantillasTabla
          setIsOpenDialog={setIsOpenDialog}
          setIdPlantilla={setIdPlantilla}
        />
      </Card>
    </>
  );
};

export default ProductosPlantillas;
