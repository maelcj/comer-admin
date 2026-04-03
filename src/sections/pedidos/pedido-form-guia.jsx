import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { registrarGuia } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const FormSchema = zod
  .object({
    paqueteria: zod.string().min(1, {
      message: 'La paquetería es requerida.',
    }),
    otra_paqueteria: zod.string().optional(),
    guia: zod.string().min(1, {
      message: 'La guía es requerida.',
    }),
  })
  .refine(
    (data) => {
      if (
        data.paqueteria === 'Otra' &&
        (!data.otra_paqueteria || data.otra_paqueteria.trim() === '')
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Especifica el nombre de la paquetería.',
      path: ['otra_paqueteria'],
    }
  );

// ----------------------------------------------------------------------

export function FormGuia({ pedido, handleGetPedido }) {
  const defaultValues = useMemo(
    () => ({
      paqueteria: 'Fedex',
      otra_paqueteria: '',
      guia: '',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchedPaqueteria = watch('paqueteria');

  const onSubmit = handleSubmit(async (data) => {
    // If "Otra" is selected, replace paqueteria with otra_paqueteria value
    const submitData = { ...data };
    if (data.paqueteria === 'Otra' && data.otra_paqueteria) {
      submitData.paqueteria = data.otra_paqueteria;
    }

    // Remove otra_paqueteria from the data being sent
    delete submitData.otra_paqueteria;

    const res = await registrarGuia(pedido.id, submitData);

    if (res.type === 'error') return toast.error(res.message);

    handleGetPedido();

    return toast.success(res.message);
  });

  const renderForm = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Field.Select native size="small" name="paqueteria" label="paquetería">
            <option value="Fedex">Fedex</option>
            <option value="Estafeta">Estafeta</option>
            <option value="Paquete Express">Paquete Express</option>
            <option value="Tres Guerras">Tres Guerras</option>
            <option value="ODM Express">ODM Express</option>
            <option value="Otra">Otra</option>
          </Field.Select>
        </Grid>
        {watchedPaqueteria === 'Otra' && (
          <Grid item xs={12} md={6}>
            <Field.Text
              size="small"
              name="otra_paqueteria"
              label="Especifica la paquetería"
              type="text"
              placeholder="Ingresa el nombre de la paquetería"
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="guia" label="guia" type="text" />
        </Grid>
      </Grid>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        sx={{ mt: 1 }}
      >
        <LoadingButton
          type="submit"
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<Iconify icon="fa-solid:check" />}
          loading={isSubmitting}
          loadingPosition="start"
        >
          Registrar
        </LoadingButton>
      </Stack>
    </>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {renderForm}
    </Form>
  );
}
