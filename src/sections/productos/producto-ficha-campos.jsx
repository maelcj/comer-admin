import { Reorder } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { getCampos, actualizarFichaCampos, aplicarPlantillaFicha } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const ProductoFichaCampos = ({ producto, plantillas }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCampos, setIsLoadingCampos] = useState(false);
  const [idPlantilla, setIdPlantilla] = useState(plantillas[0]?.id || '');
  const [campos, setCampos] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialCamposRef = useRef(null);

  const popoverAplicarPlantilla = usePopover();

  const handleGetCampos = useCallback(async () => {
    setIsLoadingCampos(true);
    try {
      const res = await getCampos(producto.id);
      if (res) {
        const mapped = res.map((c) => ({
          id: crypto.randomUUID(),
          nombre: c[0] || '',
          valor: c[1] || '',
        }));
        setCampos(mapped);
        initialCamposRef.current = mapped.map((c) => ({ nombre: c.nombre, valor: c.valor }));
      } else {
        setCampos([]);
        initialCamposRef.current = [];
      }
    } catch (error) {
      toast.error('Error al cargar los campos de la ficha técnica');
      setCampos([]);
    } finally {
      setIsLoadingCampos(false);
    }
  }, [producto.id]);

  useEffect(() => {
    handleGetCampos();
  }, [handleGetCampos]);

  // Detectar cambios comparando estado actual con valores iniciales
  useEffect(() => {
    if (!initialCamposRef.current) return;

    const initial = initialCamposRef.current;
    const hasChanges =
      campos.length !== initial.length ||
      campos.some((c, i) => c.nombre !== initial[i]?.nombre || c.valor !== initial[i]?.valor);

    setHasUnsavedChanges(hasChanges);
  }, [campos]);

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

  const handleActualizarCampos = async () => {
    setIsLoading(true);

    // Construimos el JSON string manualmente para evitar que
    // JavaScript ordene las propiedades numéricas automáticamente.
    const jsonParts = [];
    campos.forEach((campo) => {
      const nombreTrimmed = campo.nombre.trim();
      if (nombreTrimmed) {
        jsonParts.push(`${JSON.stringify(nombreTrimmed)}:${JSON.stringify(campo.valor)}`);
      }
    });

    const camposJson = `{${jsonParts.join(',')}}`;

    const res = await actualizarFichaCampos(producto.id, camposJson);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetCampos();

    return toast.success(res.message);
  };

  const handleAplicarPlantillaFicha = async () => {
    if (!idPlantilla) return toast.warning('Seleccione una plantilla');

    setIsLoading(true);
    const res = await aplicarPlantillaFicha(producto.id, idPlantilla);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetCampos();

    return toast.success(res.message);
  };

  const handleAgregarCampo = () => {
    setCampos([
      ...campos,
      {
        id: crypto.randomUUID(),
        nombre: '',
        valor: '',
      },
    ]);
  };

  const handleChangeCampo = useCallback((id, field, value) => {
    setCampos((prevCampos) =>
      prevCampos.map((campo) => (campo.id === id ? { ...campo, [field]: value } : campo))
    );
  }, []);

  const handleEliminarCampo = useCallback((id) => {
    setCampos((prevCampos) => prevCampos.filter((campo) => campo.id !== id));
  }, []);

  return (
    <Card>
      <CardHeader
        title="Ficha técnica - Campos"
        sx={{ p: 2, pb: 1 }}
        action={
          <Button
            size="small"
            color="primary"
            variant="soft"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAgregarCampo}
          >
            Agregar Campo
          </Button>
        }
      />

      <Divider />

      <Stack direction="row" spacing={2} sx={{ p: 2, pb: 1.5, alignItems: 'center' }}>
        <TextField
          select
          size="small"
          label="Aplicar Plantilla"
          value={idPlantilla}
          onChange={(event) => setIdPlantilla(event.target.value)}
          sx={{ minWidth: 240 }}
        >
          {plantillas.length === 0 && (
            <MenuItem value="" disabled>
              No hay plantillas
            </MenuItem>
          )}
          {plantillas.map((plantilla) => (
            <MenuItem key={plantilla.id} value={plantilla.id}>
              {plantilla.nombre}
            </MenuItem>
          ))}
        </TextField>

        <LoadingButton
          variant="soft"
          color="success"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isLoading}
          onClick={popoverAplicarPlantilla.onOpen}
          disabled={!idPlantilla}
        >
          Aplicar Plantilla
        </LoadingButton>
      </Stack>

      <Box sx={{ px: 2 }}>
        <Reorder.Group
          axis="y"
          values={campos}
          onReorder={setCampos}
          style={{ padding: 0, margin: 0 }}
        >
          {campos.map((campo) => (
            <Reorder.Item key={campo.id} value={campo} style={{ listStyle: 'none' }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'box-shadow 0.2s',
                }}
              >
                <Box
                  sx={{
                    cursor: 'grab',
                    color: 'text.disabled',
                    display: 'flex',
                    '&:active': { cursor: 'grabbing' },
                  }}
                >
                  <Iconify icon="mingcute:dots-grid-move-line" width={24} height={24} />
                </Box>

                <TextField
                  size="small"
                  label="Propiedad"
                  value={campo.nombre}
                  onChange={(e) => handleChangeCampo(campo.id, 'nombre', e.target.value)}
                  sx={{ width: { xs: 150, md: 240 } }}
                  placeholder="Ej: Marca"
                />

                <TextField
                  size="small"
                  label="Valor"
                  value={campo.valor}
                  onChange={(e) => handleChangeCampo(campo.id, 'valor', e.target.value)}
                  fullWidth
                  placeholder="Ej: Samsung"
                />

                <IconButton
                  color="error"
                  onClick={() => handleEliminarCampo(campo.id)}
                  sx={{ flexShrink: 0 }}
                >
                  <Iconify icon="mingcute:delete-2-line" />
                </IconButton>
              </Paper>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {campos.length === 0 && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              py: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            No hay campos en la ficha técnica. Haz clic en Agregar Campo para comenzar.
          </Typography>
        )}
      </Box>

      <Stack
        spacing={2}
        sx={{ px: 2, pb: 2, mt: 1.5 }}
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
          startIcon={<Iconify icon="fa-solid:save" />}
          loading={isLoading}
          onClick={handleActualizarCampos}
        >
          Guardar Cambios
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popoverAplicarPlantilla.open}
        onClose={popoverAplicarPlantilla.onClose}
        anchorEl={popoverAplicarPlantilla.anchorEl}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <Box sx={{ p: 2, maxWidth: 320 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.5 }} gutterBottom>
            ¿Estás seguro de que deseas aplicar esta plantilla?{' '}
            <strong>Se reemplazarán los datos actuales.</strong>
          </Typography>
          <Stack direction="row" gap={2} sx={{ mt: 2 }}>
            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<Iconify icon="fa-solid:check" />}
              onClick={() => {
                popoverAplicarPlantilla.onClose();
                handleAplicarPlantillaFicha();
              }}
            >
              Aceptar
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => {
                popoverAplicarPlantilla.onClose();
              }}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </CustomPopover>
    </Card>
  );
};

export default ProductoFichaCampos;
