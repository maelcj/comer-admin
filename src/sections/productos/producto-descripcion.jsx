import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { actualizarDescripcion } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const ProductoDescripcion = ({ producto }) => {
  const [descripcion, setDescripcion] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [merchantTitle, setMerchantTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialValuesRef = useRef(null);

  useEffect(() => {
    const newValues = {
      descripcion: producto.datos_producto?.descripcion || '',
      metaTitle: producto.datos_producto?.meta_title || '',
      metaDescription: producto.datos_producto?.meta_description || '',
      merchantTitle: producto.datos_producto?.merchant_title || '',
    };

    setDescripcion(newValues.descripcion);
    setMetaTitle(newValues.metaTitle);
    setMetaDescription(newValues.metaDescription);
    setMerchantTitle(newValues.merchantTitle);

    // Reiniciar referencia cuando cambia el producto
    initialValuesRef.current = newValues;
    setHasUnsavedChanges(false);
  }, [producto.id]);

  // Detectar cambios comparando con los valores iniciales
  useEffect(() => {
    if (!initialValuesRef.current) return;

    const current = { descripcion, metaTitle, metaDescription, merchantTitle };
    const hasChanges = Object.keys(current).some(
      (key) => current[key] !== initialValuesRef.current[key]
    );
    setHasUnsavedChanges(hasChanges);
  }, [descripcion, metaTitle, metaDescription, merchantTitle]);

  // Prevenir pérdida de datos al salir de la página
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        return e.returnValue;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleActualizarDescripcion = async () => {
    setIsLoading(true);
    const res = await actualizarDescripcion(
      producto.id,
      descripcion,
      metaTitle,
      metaDescription,
      merchantTitle
    );
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    // Actualizar referencia después de guardar exitosamente
    initialValuesRef.current = { descripcion, metaTitle, metaDescription, merchantTitle };
    setHasUnsavedChanges(false);

    return toast.success(res.message);
  };

  return (
    <Card>
      <CardHeader
        title="Descripción y SEO"
        subheader="Configura la descripción y los metadatos para mejorar el posicionamiento"
      />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Stack spacing={3}>
              <Typography variant="subtitle2">Descripción del Producto</Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder="Escribe la descripción detallada del producto aquí..."
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
              />
            </Stack>
          </Grid>
          <Grid xs={12} md={4}>
            <Stack spacing={3}>
              <Typography variant="subtitle2">Optimización SEO (Opcional)</Typography>
              <TextField
                fullWidth
                label="Meta Title"
                placeholder="Título para buscadores"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                helperText={`${metaTitle.length}/60 caracteres recomendados`}
              />
              <TextField
                fullWidth
                label="Merchant Title"
                placeholder="Título para Google Merchant / Catálogos"
                value={merchantTitle}
                onChange={(event) => setMerchantTitle(event.target.value)}
                helperText={`${merchantTitle.length}/100 como máximo`}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Meta Description"
                placeholder="Breve descripción para resultados de búsqueda"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                helperText={`${metaDescription.length}/160 caracteres recomendados`}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Stack
        spacing={3}
        sx={{ p: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          {hasUnsavedChanges && (
            <Chip
              icon={<Iconify icon="mdi:alert-circle-outline" />}
              label="Hay cambios sin guardar"
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        <LoadingButton
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => {
            handleActualizarDescripcion();
          }}
        >
          Guardar Cambios
        </LoadingButton>
      </Stack>
    </Card>
  );
};

export default ProductoDescripcion;
