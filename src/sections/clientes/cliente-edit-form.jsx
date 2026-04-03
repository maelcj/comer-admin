import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { updateCliente } from 'src/actions/clientes';

import { toast } from 'src/components/snackbar';
import { checkIcon } from 'src/components/icons';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  nombre: zod.string().min(1, {
    message: 'El nombre es requerido.',
  }),
  telefono: zod.string().optional(),
  extension: zod.string().optional(),
  celular: zod.string().optional(),
  correo: zod.string().optional(),
  empresa: zod.string().optional(),
  estado: zod.string().optional(),
  ciudad: zod.string().optional(),
  comentarios: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function ClienteEditForm({ cliente }) {
  const defaultValues = useMemo(
    () => ({
      nombre: cliente?.nombre || '',
      telefono: cliente?.telefono || '',
      extension: cliente?.extension || '',
      celular: cliente?.celular || '',
      correo: cliente?.correo || '',
      empresa: cliente?.empresa || '',
      estado: cliente?.estado ? cliente.estado : 'Aguascalientes',
      ciudad: cliente?.ciudad || '',
      comentarios: cliente?.comentarios || '',
    }),
    [cliente]
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
    const res = await updateCliente(cliente.id, data);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  });

  const renderForm = (
    <Card sx={{ p: 0 }}>
      <CardHeader title="Datos de contacto" sx={{ p: 2 }} />

      <Divider />

      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="nombre" label="nombre *" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="telefono" label="telefono" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="extension" label="extension" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="celular" label="celular" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="correo" label="correo" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="empresa" label="empresa" type="text" />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Select native size="small" name="estado" label="estado">
            <option value="Aguascalientes">Aguascalientes</option>
            <option value="Baja California">Baja California</option>
            <option value="Baja California Sur">Baja California Sur</option>
            <option value="Campeche">Campeche</option>
            <option value="Chiapas">Chiapas</option>
            <option value="Chihuahua">Chihuahua</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Coahuila">Coahuila</option>
            <option value="Colima">Colima</option>
            <option value="Durango">Durango</option>
            <option value="Estado de México">Estado de México</option>
            <option value="Guanajuato">Guanajuato</option>
            <option value="Guerrero">Guerrero</option>
            <option value="Hidalgo">Hidalgo</option>
            <option value="Jalisco">Jalisco</option>
            <option value="Michoacán">Michoacán</option>
            <option value="Morelos">Morelos</option>
            <option value="Nayarit">Nayarit</option>
            <option value="Nuevo León">Nuevo León</option>
            <option value="Oaxaca">Oaxaca</option>
            <option value="Puebla">Puebla</option>
            <option value="Querétaro">Querétaro</option>
            <option value="Quintana Roo">Quintana Roo</option>
            <option value="San Luis Potosí">San Luis Potosí</option>
            <option value="Sinaloa">Sinaloa</option>
            <option value="Sonora">Sonora</option>
            <option value="Tabasco">Tabasco</option>
            <option value="Tamaulipas">Tamaulipas</option>
            <option value="Tlaxcala">Tlaxcala</option>
            <option value="Veracruz">Veracruz</option>
            <option value="Yucatán">Yucatán</option>
            <option value="Zacatecas">Zacatecas</option>
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text size="small" name="ciudad" label="ciudad" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="comentarios" label="comentarios" type="text" />
        </Grid>
      </Grid>

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
          startIcon={checkIcon}
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
