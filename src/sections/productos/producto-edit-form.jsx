import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { updateProducto } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  mpn: zod.string().min(1, {
    message: 'El mpn es requerido.',
  }),

  disponible: zod.string(),
  tipo: zod.string().min(1, {
    message: 'El tipo es requerido.',
  }),
  marca: zod.string().min(1, {
    message: 'La marca es requerida.',
  }),
  modelo: zod.string().min(1, {
    message: 'El modelo es requerido.',
  }),
  nombre_publicitario: zod.string().optional(),

  precio: zod.preprocess(
    Number,
    zod
      .number({
        required_error: 'El precio es requerido.',
        invalid_type_error: 'El precio debe ser un número.',
      })
      .min(0.01, 'El precio debe ser mayor que 0.')
  ),

  moneda_precio: zod.string().min(3, {
    message: 'Moneda requerida.',
  }),

  precioDeOferta: zod.preprocess(
    Number,
    zod
      .number({
        invalid_type_error: 'El precio de oferta debe ser un número.',
      })
      .optional()
  ),

  moneda_precioDeOferta: zod.string().min(3, {
    message: 'Moneda requerida.',
  }),

  porcentaje_oferta_cotizacion: zod.union([zod.number(), zod.null(), zod.string()]).optional(),

  oferta: zod.string().min(2, {
    message: 'oferta requerida.',
  }),

  proveedor: zod.string().optional(),

  visible: zod.string().min(2, {
    message: 'visible requerido.',
  }),

  iva: zod.string().min(2, {
    message: 'iva requerido.',
  }),

  upc: zod.string().optional(),

  video: zod.string().optional(),

  outlet: zod.boolean(),

  importacion: zod.boolean(),
});

// ----------------------------------------------------------------------

export function ProductoEditForm({ producto, handleGetProducto = () => {} }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialValuesRef = useRef(null);
  const defaultValues = useMemo(
    () => ({
      mpn: producto?.mpn || '',
      disponible: producto?.disponible || '',
      tipo: producto?.tipo || '',
      marca: producto?.marca || '',
      modelo: producto?.modelo || '',
      nombre_publicitario: producto?.nombre_publicitario || '',
      precio:
        producto?.moneda_precio === 'usd' ? (producto?.precioUSD ?? 0) : (producto?.precio ?? 0),
      moneda_precio: producto?.moneda_precio || '',
      precioDeOferta:
        producto?.moneda_precioDeOferta === 'usd'
          ? (producto?.precioDeOfertaUSD ?? 0)
          : (producto?.precioDeOferta ?? 0),
      proveedor: producto?.proveedor || '',
      moneda_precioDeOferta: producto?.moneda_precioDeOferta || '',
      porcentaje_oferta_cotizacion: producto?.porcentaje_oferta_cotizacion || '',
      oferta: producto?.oferta || '',
      visible: producto?.visible || '',
      iva: producto?.iva || '',
      upc: producto?.upc || '',
      video: producto?.video || '',
      outlet: Boolean(producto?.outlet),
      importacion: Boolean(producto?.importacion),
    }),
    [producto]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Observar todos los campos del formulario
  const watchedValues = watch();

  // Sincronizar valores de referencia cuando el producto cambia externamente
  useEffect(() => {
    initialValuesRef.current = { ...defaultValues };
    methods.reset(defaultValues);
    setHasUnsavedChanges(false);
  }, [defaultValues, methods]);

  // Detectar cambios comparando con los valores iniciales
  useEffect(() => {
    if (!initialValuesRef.current) return;

    const hasChanges = Object.keys(initialValuesRef.current).some(
      (key) => String(watchedValues[key] ?? '') !== String(initialValuesRef.current[key] ?? '')
    );
    setHasUnsavedChanges(hasChanges);
  }, [watchedValues]);

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

  const onSubmit = handleSubmit(async (data) => {
    const res = await updateProducto(producto.id, data);

    if (res.type === 'error') return toast.error(res.message);

    // Actualizar valores de referencia después de guardar exitosamente
    initialValuesRef.current = { ...data };
    setHasUnsavedChanges(false);

    handleGetProducto();

    return toast.success(res.message);
  });

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ p: 2 }}>
        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text size="small" name="mpn" label="mpn *" type="text" />

          <Field.Select
            native
            size="small"
            name="disponible"
            label="disponible"
            InputLabelProps={{ shrink: true }}
          >
            <option value="in stock">in stock</option>
            <option value="out of stock">out of stock</option>
          </Field.Select>

          <Field.Text size="small" name="tipo" label="tipo *" type="text" />

          <Field.Text size="small" name="marca" label="marca *" type="text" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text size="small" name="modelo" label="modelo *" type="text" />

          <Field.Text
            size="small"
            name="nombre_publicitario"
            label="nombre publicitario"
            type="text"
          />

          <Field.Text size="small" name="precio" label="precio *" type="number" />

          <Field.Select native size="small" name="moneda_precio" label="moneda del precio *">
            <option value="mxn">MXN</option>
            <option value="usd">USD</option>
          </Field.Select>
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }}
        >
          <Field.Text size="small" name="precioDeOferta" label="precio de oferta" type="number" />

          <Field.Select
            size="small"
            native
            name="moneda_precioDeOferta"
            label="moneda del precio de oferta *"
          >
            <option value="mxn">MXN</option>
            <option value="usd">USD</option>
          </Field.Select>

          <Field.Text
            size="small"
            name="porcentaje_oferta_cotizacion"
            label="porcentaje oferta cotización"
            type="number"
          />

          <Field.Select native size="small" name="oferta" label="oferta *">
            <option value="si">Si</option>
            <option value="no">No</option>
          </Field.Select>

          <Field.Text size="small" name="proveedor" label="proveedor" type="text" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }}
        >
          <Field.Select size="small" native name="visible" label="visible *">
            <option value="si">Si</option>
            <option value="no">No</option>
          </Field.Select>

          <Field.Select size="small" native name="iva" label="iva *">
            <option value="si">Si</option>
            <option value="no">No</option>
          </Field.Select>

          <Field.Text size="small" name="upc" label="upc" type="text" />

          <Field.Text size="small" name="video" label="video (youtube)" type="text" />

          <Field.Checkbox name="outlet" label="Outlet" />

          <Field.Checkbox name="importacion" label="Importación" />
        </Box>
      </Stack>

      <Stack
        spacing={2}
        sx={{ px: 2, pb: 2 }}
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
          type="submit"
          variant="outlined"
          color="primary"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isSubmitting}
          loadingPosition="start"
        >
          Guardar
        </LoadingButton>
      </Stack>
    </>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ mx: 'auto' }}>
        {renderForm}
      </Stack>
    </Form>
  );
}
