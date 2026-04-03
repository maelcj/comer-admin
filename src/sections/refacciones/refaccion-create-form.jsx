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

import { createRefaccion } from 'src/actions/refacciones';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  moneda: zod.string().min(1, {
    message: 'La moneda es requerida.',
  }),

  disponible: zod.string(),
  modelo: zod.string().min(1, {
    message: 'El modelo es requerido.',
  }),
  marca: zod.string().min(1, {
    message: 'La marca es requerida.',
  }),
  descripcion: zod.string().min(1, {
    message: 'La descripción es requerida.',
  }),

  precio: zod.preprocess(
    Number,
    zod
      .number({
        required_error: 'El precio es requerido.',
        invalid_type_error: 'El precio debe ser un número.',
      })
      .min(0.01, 'El precio debe ser mayor que 0.')
  ),

  costo: zod.preprocess(
    Number,
    zod.number({
      required_error: 'El costo es requerido.',
      invalid_type_error: 'El costo debe ser un número.',
    })
  ),

  proveedor: zod.string().optional(),

  visible: zod.string().min(1, {
    message: 'La visibilidad es requerida.',
  }),
});

// ----------------------------------------------------------------------

export function RefaccionCreateForm({ marcas }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      moneda: 'mxn',
      disponible: 'in stock',
      modelo: '',
      marca: '',
      descripcion: '',
      precio: '',
      costo: '',
      proveedor: '',
      visible: 'si',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const res = await createRefaccion(data);

    if (res.type === 'error') return toast.error(res.message);

    toast.success(res.message);

    NProgress.start();
    router.push(paths.dashboard.refacciones.edit(res.id));

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
          <Field.Select native size="small" name="moneda" label="moneda *">
            <option value="mxn">MXN</option>
            <option value="usd">USD</option>
          </Field.Select>

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

          <Field.Text size="small" name="modelo" label="modelo *" type="text" />

          <Field.Text size="small" name="descripcion" label="descripción *" type="text" />
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Select size="small" native name="marca" label="marca *">
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.idCategoriasNivel2} value={marca.nombreCategoriaNivel2}>
                {marca.nombreCategoriaNivel2}
              </option>
            ))}
          </Field.Select>

          <Field.Text size="small" name="precio" label="precio *" type="number" />

          <Field.Text size="small" name="costo" label="costo *" type="number" />

          <Field.Text size="small" name="proveedor" label="proveedor" type="text" />

          <Field.Select size="small" native name="visible" label="visible *">
            <option value="si">Si</option>
            <option value="no">No</option>
          </Field.Select>
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
