import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { actualizarFichaDescripcion } from 'src/actions/productos';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ProductoFichaDescripcion = ({ producto }) => {
  const [fichaTecnica, setFichaTecnica] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialValueRef = useRef(null);

  useEffect(() => {
    const valor = producto.datos_producto?.ficha || '';
    setFichaTecnica(valor);
    initialValueRef.current = valor;
    setHasUnsavedChanges(false);
  }, [producto.id]);

  // Detectar cambios comparando con el valor inicial
  useEffect(() => {
    if (initialValueRef.current === null) return;
    setHasUnsavedChanges(fichaTecnica !== initialValueRef.current);
  }, [fichaTecnica]);

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

  const handleActualizarFichaDescripcion = async () => {
    setIsLoading(true);
    const res = await actualizarFichaDescripcion(producto.id, fichaTecnica);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    // Actualizar valor de referencia después de guardar exitosamente
    initialValueRef.current = fichaTecnica;
    setHasUnsavedChanges(false);

    return toast.success(res.message);
  };

  return (
    <Card>
      <CardHeader title="Ficha técnica - Descripción" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Editor
          fullItem={false}
          value={fichaTecnica}
          onChange={(value) => setFichaTecnica(value)}
          placeholder=""
          immediatelyRender={false}
          sx={{ maxHeight: 240 }}
        />
      </Stack>

      <Stack
        spacing={3}
        sx={{ px: 3, pb: 3, mt: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
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
          onClick={handleActualizarFichaDescripcion}
        >
          Guardar
        </LoadingButton>
      </Stack>
    </Card>
  );
};

export default ProductoFichaDescripcion;
