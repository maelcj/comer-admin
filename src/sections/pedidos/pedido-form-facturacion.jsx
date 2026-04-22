import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { guardarDatosFacturacion } from 'src/actions/pedidos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { PedidoDatosFacturacionDialog } from './pedido-datos-facturacion-dialog';

// ----------------------------------------------------------------------

export const FormSchema = zod
  .object({
    razon: zod.string().optional(),
    rfc: zod.string().optional(),
    persona: zod.string().min(1, {
      message: 'Tipo de persona requerido',
    }),
    correo: zod.string().optional(),
    regimen: zod.string().min(1, {
      message: 'El régimen es requerido',
    }),
    metodo_pago: zod.string().optional(),
    forma_pago: zod.string().optional(),
    uso_cfdi: zod.string().optional(),

    /*
    cp: zod
      .string({
        required_error: 'El código postal es requerido',
        invalid_type_error: 'El código postal debe ser un número',
      })
      .refine((val) => /^\d{5}$/.test(val), {
        message: 'El código postal debe tener 5 dígitos',
      }),
      */
    cp: zod.string().optional(),
    comentarios: zod.string().optional(),
  })
  .refine(
    ({ persona, razon }) => {
      if (persona !== 'general') {
        return razon !== '';
      }
      return true;
    },
    () => ({
      path: ['razon'],
      message: 'Razón social requerida',
    })
  )
  .refine(
    ({ persona, rfc }) => {
      if (persona !== 'general') {
        return rfc !== '';
      }
      return true;
    },
    () => ({
      path: ['rfc'],
      message: 'RFC requerido',
    })
  )
  .refine(
    ({ persona, metodo_pago }) => {
      if (persona !== 'general') {
        return metodo_pago !== '';
      }
      return true;
    },
    () => ({
      path: ['metodo_pago'],
      message: 'Método de pago requerido',
    })
  )
  .refine(
    ({ persona, forma_pago }) => {
      if (persona !== 'general') {
        return forma_pago !== '';
      }
      return true;
    },
    () => ({
      path: ['forma_pago'],
      message: 'Forma de pago requerida',
    })
  )
  .refine(
    ({ persona, uso_cfdi }) => {
      if (persona !== 'general') {
        return uso_cfdi !== '';
      }
      return true;
    },
    () => ({
      path: ['uso_cfdi'],
      message: 'Uso de cfdi requerido',
    })
  )
  .refine(
    ({ persona, cp }) => {
      if (persona !== 'general') {
        return cp !== '';
      }
      return true;
    },
    () => ({
      path: ['cp'],
      message: 'Código postal requerido',
    })
  );

// ----------------------------------------------------------------------

const metodo_pago = [
  {
    value: 'pue',
    label: 'PUE pago en una sola exhibición',
  },
  {
    value: 'pip',
    label: 'PIP pago inicial y parcialidades',
  },
  {
    value: 'ppd',
    label: 'PPD pago en parcialidades o diferido',
  },
];

const forma_pago = [
  {
    value: '01',
    label: '01 Efectivo',
  },
  {
    value: '02',
    label: '02 Cheque nominativo',
  },
  {
    value: '03',
    label: '03 Transferencia electrónica de fondos',
  },
  {
    value: '04',
    label: '04 Tarjeta de crédito',
  },
  {
    value: '05',
    label: '05 Monedero electrónico',
  },
  {
    value: '06',
    label: '06 Dinero electrónico',
  },
  {
    value: '08',
    label: '08 Vales de despensa',
  },

  {
    value: '28',
    label: '28 Tarjeta de débito',
  },
  {
    value: '29',
    label: '29 Tarjeta de servicios',
  },
  {
    value: '99',
    label: '99 Otros',
  },
];

const uso_cfdi = [
  {
    value: 'G03',
    label: 'G03 Gastos en general',
  },
  {
    value: 'G01',
    label: 'G01 Adquisición de mercancias',
  },
  {
    value: 'G02',
    label: 'G02 Devoluciones, descuentos o bonificaciones',
  },
  {
    value: 'I01',
    label: 'I01 Construcciones',
  },
  {
    value: 'I02',
    label: 'I02 Mobiliario y equipo de oficina por inversiones',
  },
  {
    value: 'I03',
    label: 'I03 Equipo de transporte',
  },
  {
    value: 'I05',
    label: 'I05 Dados, troqueles, moldes, matrices y herramental',
  },
  {
    value: 'I08',
    label: 'I08 Otra maquinaria y equipo',
  },
  {
    value: 'S01',
    label: 'S01 Sin efectos fiscales',
  },
  {
    value: 'CP01',
    label: 'CP01 Pagos',
  },
  {
    value: 'CN01',
    label: 'CN01 Nomina',
  },
];

// ----------------------------------------------------------------------

export function FormFacturacion({ pedido }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      razon: pedido.datos_facturacion?.razon || '',
      rfc: pedido.datos_facturacion?.rfc || '',
      persona: pedido.datos_facturacion?.persona || 'general',
      correo: pedido.datos_facturacion?.correo || '',
      regimen: pedido.datos_facturacion?.regimen || '601',
      metodo_pago: pedido.datos_facturacion?.metodo_pago || '',
      forma_pago: pedido.datos_facturacion?.forma_pago || '',
      uso_cfdi: pedido.datos_facturacion?.uso_cfdi || '',
      cp: pedido.datos_facturacion?.cp || '',
      comentarios: pedido.datos_facturacion?.comentarios || '',
    }),
    [pedido]
  );

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const res = await guardarDatosFacturacion(pedido.id, data);

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

  const handleSelectDatosFacturacion = (datos) => {
    // Copiar los datos al formulario
    setValue('razon', datos.razon || '');
    setValue('rfc', datos.rfc || '');
    setValue('persona', datos.persona || 'general');
    setValue('correo', datos.correo || '');
    setValue('regimen', datos.regimen || '601');
    setValue('metodo_pago', datos.metodo_pago || '');
    setValue('forma_pago', datos.forma_pago || '');
    setValue('uso_cfdi', datos.uso_cfdi || '');
    setValue('cp', datos.cp || '');
    setValue('comentarios', datos.comentarios || '');

    toast.success('Datos de facturación copiados correctamente');
  };

  const renderForm = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="razon" label="razón social" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="rfc" label="rfc" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select native size="small" name="persona" label="tipo de persona">
            <option value="general">Público en general</option>
            <option value="moral">Persona moral</option>
            <option value="fisica">Persona física</option>
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select native size="small" name="regimen" label="régimen fiscal">
            <option value="601">General de Ley Personas Morales</option>
            <option value="603">Personas Morales con Fines no Lucrativos</option>
            <option value="605">Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
            <option value="606">Arrendamiento</option>
            <option value="607">Régimen de Enajenación o Adquisición de Bienes</option>
            <option value="608">Demás ingresos</option>
            <option value="609">Consolidación</option>
            <option value="610">
              Residentes en el Extranjero sin Establecimiento Permanente en México
            </option>
            <option value="611">Ingresos por Dividendos (socios y accionistas)</option>
            <option value="612">
              Personas Físicas con Actividades Empresariales y Profesionales
            </option>
            <option value="614">Ingresos por intereses</option>
            <option value="615">Régimen de los ingresos por obtención de premios</option>
            <option value="616">Sin obligaciones fiscales</option>
            <option value="620">
              Sociedades Cooperativas de Producción que optan por diferir sus ingresos
            </option>
            <option value="621">Incorporación Fiscal</option>
            <option value="622">Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
            <option value="623">Opcional para Grupos de Sociedades</option>
            <option value="624">Coordinados</option>
            <option value="625">
              Régimen de las Actividades Empresariales con ingresos a través de Plataformas
              Tecnológicas
            </option>
            <option value="626">Régimen Simplificado de Confianza</option>
            <option value="628">Hidrocarburos</option>
            <option value="629">
              De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales
            </option>
            <option value="630">Enajenación de acciones en bolsa de valores</option>
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
            native
            size="small"
            name="metodo_pago"
            label="método de pago"
            sx={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
          >
            <option value="">Selecciona método de pago</option>
            {metodo_pago.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
            native
            size="small"
            name="forma_pago"
            label="forma de pago"
            sx={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
          >
            <option value="">Selecciona forma de pago</option>
            {forma_pago.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
            native
            size="small"
            name="uso_cfdi"
            label="uso cfdi"
            sx={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
          >
            <option value="">Selecciona uso de CFDI</option>
            {uso_cfdi.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="cp" label="código postal" type="text" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text size="small" name="correo" label="correo" type="text" />
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

      <PedidoDatosFacturacionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        pedidoId={pedido.id}
        onSelect={handleSelectDatosFacturacion}
      />
    </>
  );
}
