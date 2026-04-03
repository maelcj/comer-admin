import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { registrarPago } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form'; // Import the Mexico Spanish locale
import { esES } from '@mui/x-date-pickers/locales';

// ----------------------------------------------------------------------

export const FormSchema = zod.object({
  cantidad: zod.string().min(1, {
    message: 'La cantidad es requerida.',
  }),
  forma: zod.string().min(1, {
    message: 'La forma de pago es requerida.',
  }),
  fecha: zod.string().optional(),
  banco: zod.string().min(1, {
    message: 'El banco es requerido.',
  }),
  referencia: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function FormPago({ pedido, handleGetPedido }) {
  const [currentDate, setCurrentDate] = useState(dayjs(new Date()));

  const defaultValues = useMemo(
    () => ({
      cantidad: pedido.total_formateado,
      forma: '01',
      banco: 'Banamex',
      referencia: '',
    }),
    [pedido]
  );

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // get the datetime string with dayjs from currentDate value
    data.fecha = dayjs(currentDate).format('YYYY-MM-DD HH:mm:ss');

    const res = await registrarPago(pedido.id, data);

    if (res.type === 'error') return toast.error(res.message);

    handleGetPedido();

    return toast.success(res.message);
  });

  const renderForm = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="cantidad" label="cantidad *" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select native size="small" name="forma" label="forma de pago">
            <option value="Efectivo">Efectivo</option>
            <option value="Cheque">Cheque</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
            <option value="Monedero electrónico">Monedero electrónico</option>
            <option value="Dinero electrónico">Dinero electrónico</option>
            <option value="Vales de despensa">Vales de despensa</option>
            <option value="Tarjeta de débito">Tarjeta de débito</option>
            <option value="Tarjeta de servicios">Tarjeta de servicios</option>
            <option value="Otros">Otros</option>
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select native size="small" name="banco" label="Banco">
            <option value="Banamex">Banamex</option>
            <option value="Banbajio">Banbajio</option>
            <option value="Bancomer">Bancomer</option>
            <option value="Banorte">Banorte</option>
            <option value="HSBC">HSBC</option>
            <option value="Santander">Santander</option>
            <option value="PayPal">PayPal</option>
            <option value="Mercado Pago">Mercado Pago</option>
            <option value="OpenPay">OpenPay</option>
            <option value="otro">otro</option>
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es-mx"
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <MobileDateTimePicker
              label="fecha"
              value={currentDate}
              onChange={(date) => setCurrentDate(date)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="referencia" label="referencia" type="text" />
        </Grid>
      </Grid>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        sx={{ mt: 3 }}
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
