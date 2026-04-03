import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react'; // Add useState import
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { updateRefaccion } from 'src/actions/refacciones';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const RefaccionSchema = zod.object({
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
  marcaCustom: zod.string().optional(), // Add this for custom brand input
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

  proveedor: zod.string().optional(),

  inventario: zod.preprocess(
    (val) => !!(val === 'true' || val === true),
    zod.boolean({
      required_error: 'El inventario es requerido.',
      invalid_type_error: 'El inventario debe ser verdadero o falso.',
    })
  ),

  visible: zod.string().min(1, {
    message: 'La visibilidad es requerida.',
  }),
});

// ----------------------------------------------------------------------

export function RefaccionEditForm({ refaccion, marcas }) {
  // Add state to track if user selected "Otro" option
  const [showCustomMarca, setShowCustomMarca] = useState(false);

  const defaultValues = useMemo(() => {
    // Check if the brand exists in the marcas list
    const brandExists = marcas.some((marca) => marca.nombreCategoriaNivel2 === refaccion?.marca);

    return {
      moneda: refaccion?.moneda || '',
      disponible: refaccion?.disponible || '',
      modelo: refaccion?.modelo || '',
      // If the brand doesn't exist in the list and we have a value, set to "otro"
      marca: brandExists ? refaccion?.marca : refaccion?.marca ? 'otro' : '',
      // If we're using a custom brand, populate the custom field
      marcaCustom: !brandExists && refaccion?.marca ? refaccion.marca : '',
      descripcion: refaccion?.descripcion || '',
      precio: refaccion?.moneda === 'usd' ? refaccion.precioUSD : refaccion.precio,
      proveedor: refaccion?.proveedor || '',
      inventario:
        typeof refaccion?.inventario === 'boolean' ? refaccion.inventario : !!refaccion?.inventario,
      visible: refaccion?.visible || '',
    };
  }, [refaccion, marcas]);

  const methods = useForm({
    resolver: zodResolver(RefaccionSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  // Watch the marca field to detect when "otro" is selected
  const marcaValue = watch('marca');

  // Update UI when marca selection changes
  useEffect(() => {
    setShowCustomMarca(marcaValue === 'otro');

    // If user switches away from custom option, clear the custom value
    if (marcaValue !== 'otro') {
      setValue('marcaCustom', '');
    }
  }, [marcaValue, setValue]);

  // Add this useEffect to set initial state
  useEffect(() => {
    // Set showCustomMarca based on initial marca value
    setShowCustomMarca(marcaValue === 'otro');
  }, []); // Empty dependency array ensures it only runs once on mount

  const onSubmit = handleSubmit(async (data) => {
    // If user entered a custom brand, use that instead of "otro"
    if (data.marca === 'otro' && data.marcaCustom) {
      data.marca = data.marcaCustom;
    }

    // Remove the custom field before sending to API
    const { marcaCustom, ...submitData } = data;

    const res = await updateRefaccion(refaccion.id, submitData);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  });

  const renderForm = (
    <Card>
      <CardHeader title="Información general" sx={{ p: 2 }} />

      <Stack spacing={3} sx={{ p: 2 }}>
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

          <Field.Select size="small" native name="marca" label="marca *">
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.idCategoriasNivel2} value={marca.nombreCategoriaNivel2}>
                {marca.nombreCategoriaNivel2}
              </option>
            ))}
            <option value="otro">Otro (especificar)</option>
          </Field.Select>

          {showCustomMarca && (
            <Field.Text size="small" name="marcaCustom" label="Especificar marca *" type="text" />
          )}
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Text size="small" name="descripcion" label="descripción *" type="text" />
          <Field.Text size="small" name="precio" label="precio *" type="number" />

          <Field.Text size="small" name="proveedor" label="proveedor" type="text" />

          <Field.Select size="small" native name="visible" label="visible *">
            <option value="si">Si</option>
            <option value="no">No</option>
          </Field.Select>
        </Box>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        >
          <Field.Select size="small" native name="inventario" label="inventario *">
            <option value>Sí</option>
            <option value={false}>No</option>
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
          Guardar
        </LoadingButton>
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderForm}
      </Stack>
    </Form>
  );
}
