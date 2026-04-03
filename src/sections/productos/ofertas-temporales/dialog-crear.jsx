'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { esES } from '@mui/x-date-pickers/locales';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { crearOfertaTemporal } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const OfertaTemporalSchema = zod
  .object({
    fecha_inicio: zod.any().refine((val) => val && dayjs(val).isValid(), {
      message: 'La fecha de inicio es requerida',
    }),
    fecha_fin: zod.any().refine((val) => val && dayjs(val).isValid(), {
      message: 'La fecha de fin es requerida',
    }),
    aplicar_a: zod.enum(['precio_lista', 'precio_oferta'], {
      message: 'Selecciona dónde aplicar el descuento',
    }),
    tipo_descuento: zod.enum(['porcentaje', 'cantidad', 'precio_final'], {
      message: 'Selecciona un tipo de descuento válido',
    }),
    cantidad_descuento: zod.preprocess(
      Number,
      zod
        .number({
          required_error: 'La cantidad de descuento es requerida',
          invalid_type_error: 'La cantidad debe ser un número',
        })
        .min(0.01, 'La cantidad debe ser mayor que 0')
    ),
  })
  .refine(
    (data) => {
      const fechaInicio = dayjs(data.fecha_inicio);
      const fechaFin = dayjs(data.fecha_fin);
      return fechaFin.isAfter(fechaInicio) || fechaFin.isSame(fechaInicio, 'minute');
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['fecha_fin'],
    }
  );

const DialogCrear = ({ open, setOpen, producto, handleGetOfertas, handleGetProducto }) => {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    fecha_inicio: null,
    fecha_fin: null,
    aplicar_a: 'precio_lista',
    tipo_descuento: 'porcentaje',
    cantidad_descuento: 0,
  };

  const methods = useForm({
    resolver: zodResolver(OfertaTemporalSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const tipoDescuento = useWatch({
    control,
    name: 'tipo_descuento',
    defaultValue: 'porcentaje',
  });

  const getLabelCantidad = () => {
    switch (tipoDescuento) {
      case 'porcentaje':
        return 'Porcentaje de descuento (%) *';
      case 'cantidad':
        return 'Cantidad de descuento (MXN) *';
      case 'precio_final':
        return 'Precio final (MXN) *';
      default:
        return 'Cantidad de descuento *';
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    // Formatear las fechas para el backend
    const formattedData = {
      ...data,
      fecha_inicio: data.fecha_inicio
        ? dayjs(data.fecha_inicio).format('YYYY-MM-DD HH:mm:ss')
        : null,
      fecha_fin: data.fecha_fin ? dayjs(data.fecha_fin).format('YYYY-MM-DD HH:mm:ss') : null,
      producto_id: producto.id,
      moneda: 'mxn', // Siempre MXN
    };

    const res = await crearOfertaTemporal(formattedData);
    setIsLoading(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    await handleGetOfertas();
    if (handleGetProducto) await handleGetProducto();
    setOpen(false);
    reset();
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} maxWidth="sm" onClose={handleClose} fullWidth>
      <DialogTitle sx={{ p: 2 }}>
        Crear oferta temporal
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="es-mx"
          localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <Form methods={methods} onSubmit={onSubmit}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              sx={{ mt: 1 }}
            >
              <Field.DateTimePicker
                name="fecha_inicio"
                label="Fecha y hora de inicio *"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />

              <Field.DateTimePicker
                name="fecha_fin"
                label="Fecha y hora de fin *"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />

              <Field.Select native size="small" name="aplicar_a" label="Aplicar a: *">
                <option value="precio_lista">Precio de lista</option>
                <option value="precio_oferta">Precio de oferta</option>
              </Field.Select>

              <Field.Select native size="small" name="tipo_descuento" label="Tipo de descuento *">
                <option value="porcentaje">Porcentaje</option>
                <option value="cantidad">Cantidad fija</option>
                <option value="precio_final">Precio final</option>
              </Field.Select>

              <Field.Text
                size="small"
                name="cantidad_descuento"
                label={getLabelCantidad()}
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>
          </Form>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <LoadingButton onClick={onSubmit} variant="contained" loading={isSubmitting || isLoading}>
          Crear oferta
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCrear;
