import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { guardarDatosEnvio } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { PedidoDatosEnvioDialog } from './pedido-datos-envio-dialog';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  recibe: zod.string().min(1, {
    message: 'El campo recibe es requerido.',
  }),
  empresa: zod.string().optional(),
  calle: zod
    .string()
    .min(1, {
      message: 'La calle es requerida',
    })
    .max(100),
  colonia: zod
    .string()
    .min(1, {
      message: 'La colonia es requerida',
    })
    .max(100),
  ciudad: zod
    .string()
    .min(1, {
      message: 'La ciudad es requerida',
    })
    .max(100),
  estado: zod.string().min(1, {
    message: 'El estado es requerido',
  }),
  telefono: zod.preprocess(
    Number,
    zod
      .number({
        required_error: 'El teléfono es requerido',
        invalid_type_error: 'El teléfono debe ser un número',
      })
      .gte(1000000000, 'debe contener 10 dígitos')
      .lte(9999999999, 'debe contener 10 dígitos')
  ),
  cp: zod.string().optional(),
  instrucciones: zod.string().max(80).optional(),
  comentarios: zod.string().max(200).optional(),
});

// ----------------------------------------------------------------------

export function FormEnvio({ pedido }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      recibe: pedido.datos_envio?.recibe || '',
      empresa: pedido.datos_envio?.empresa || '',
      calle: pedido.datos_envio?.calle || '',
      colonia: pedido.datos_envio?.colonia || '',
      ciudad: pedido.datos_envio?.ciudad || '',
      estado: pedido.datos_envio?.estado || 'Aguascalientes',
      telefono: pedido.datos_envio?.telefono || '',
      cp: pedido.datos_envio?.cp || '',
      instrucciones: pedido.datos_envio?.instrucciones || '',
      comentarios: pedido.datos_envio?.comentarios || '',
    }),
    [pedido]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const res = await guardarDatosEnvio(pedido.id, data);

    if (res.type === 'error') return toast.error(res.message);

    // Resetear el estado dirty después de guardar exitosamente
    reset(data);
    return toast.success(res.message);
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSelectDatosEnvio = (datos) => {
    // Copiar los datos al formulario
    setValue('recibe', datos.recibe || '');
    setValue('empresa', datos.empresa || '');
    setValue('calle', datos.calle || '');
    setValue('colonia', datos.colonia || '');
    setValue('ciudad', datos.ciudad || '');
    setValue('estado', datos.estado || 'Aguascalientes');
    setValue('telefono', datos.telefono || '');
    setValue('cp', datos.cp || '');
    setValue('instrucciones', datos.instrucciones || '');
    setValue('comentarios', datos.comentarios || '');

    toast.success('Datos de envío copiados correctamente');
  };

  const renderForm = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="recibe" label="recibe *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="empresa" label="empresa" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="calle" label="calle y número *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="colonia" label="colonia *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="ciudad" label="ciudad *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="telefono" label="teléfono *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="cp" label="código postal *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="instrucciones" label="instrucciones" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="comentarios" label="comentarios" type="text" />
        </Grid>
      </Grid>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{ mt: 3 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<Iconify icon="material-symbols:history" />}
            onClick={handleOpenDialog}
          >
            Ver datos anteriores
          </Button>

          {isDirty && (
            <Chip
              size="small"
              label="Cambios sin guardar"
              color="warning"
              icon={<Iconify icon="material-symbols:edit" width={16} />}
            />
          )}
        </Stack>

        <LoadingButton
          type="submit"
          variant="outlined"
          color="primary"
          size="small"
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
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <PedidoDatosEnvioDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        pedidoId={pedido.id}
        onSelect={handleSelectDatosEnvio}
      />
    </>
  );
}
