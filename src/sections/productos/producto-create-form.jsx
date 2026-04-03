import { z as zod } from 'zod';
import { useMemo } from 'react';
import * as NProgress from 'nprogress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createProducto } from 'src/actions/productos';

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
    zod.number({
      required_error: 'El precio es requerido.',
      invalid_type_error: 'El precio debe ser un número.',
    })
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

export function ProductoCreateForm() {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      mpn: '',
      disponible: 'in stock',
      tipo: '',
      marca: '',
      modelo: '',
      nombre_publicitario: '',
      precio: '',
      moneda_precio: 'mxn',
      precioDeOferta: '',
      proveedor: '',
      moneda_precioDeOferta: 'mxn',
      porcentaje_oferta_cotizacion: '',
      oferta: 'no',
      visible: 'si',
      iva: 'si',
      upc: '',
      video: '',
      outlet: false,
      importacion: false,
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const res = await createProducto(data);

    if (res.type === 'error') return toast.error(res.message);

    toast.success(res.message);

    NProgress.start();
    router.push(paths.dashboard.productos.edit(res.id));

    return null;
  });

  const renderPricing = (
    <Card sx={{ mb: { xs: 3, md: 5 } }}>
      <CardHeader title="Información general" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
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
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(6, 1fr)' }}
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
        spacing={3}
        sx={{ px: 3, pb: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <LoadingButton
          type="submit"
          variant="outlined"
          color="primary"
          size="medium"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isSubmitting}
          loadingPosition="start"
        >
          Crear
        </LoadingButton>
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderPricing}
      </Stack>
    </Form>
  );
}
