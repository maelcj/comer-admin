'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { createUsuario, updateUsuario } from 'src/actions/usuarios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const createUsuarioSchema = zod
  .object({
    name: zod.string().min(1, { message: 'El nombre es obligatorio' }),
    email: zod.string().email({ message: 'El email debe tener un formato válido' }),
    password: zod.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    password_confirmation: zod.string().min(1, { message: 'Confirmar contraseña es obligatorio' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  });

const editUsuarioSchema = zod
  .object({
    name: zod.string().min(1, { message: 'El nombre es obligatorio' }),
    email: zod.string().email({ message: 'El email debe tener un formato válido' }),
    password: zod.string().optional(),
    password_confirmation: zod.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation && data.password.length >= 8;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden o deben tener al menos 8 caracteres',
      path: ['password_confirmation'],
    }
  );

// ----------------------------------------------------------------------

export function UsuarioCreateForm({ currentUser }) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();
  const passwordConfirm = useBoolean();

  const isEdit = Boolean(currentUser);

  const defaultValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    password_confirmation: '',
  };

  const methods = useForm({
    resolver: zodResolver(isEdit ? editUsuarioSchema : createUsuarioSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Reset form when currentUser changes (for edit mode)
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');

      // Filtrar campos vacíos para edición
      const submitData = { ...data };
      if (isEdit) {
        if (!submitData.password) {
          delete submitData.password;
          delete submitData.password_confirmation;
        }

        await updateUsuario(currentUser.id, submitData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await createUsuario(submitData);
        toast.success('Usuario creado exitosamente');
      }

      router.push(paths.dashboard.usuarios.root);
    } catch (error) {
      console.error('Error:', error);

      if (error?.response?.data?.errors) {
        const { errors } = error.response.data;
        let errorMessage = 'Error de validación:\n';

        Object.keys(errors).forEach((key) => {
          errorMessage += `${errors[key].join(', ')}\n`;
        });

        setErrorMsg(errorMessage);
      } else {
        setErrorMsg(
          error?.response?.data?.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`
        );
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader
              title="Información del usuario"
              subheader={
                isEdit ? 'Edite los datos del usuario' : 'Ingrese los datos del nuevo usuario'
              }
              sx={{ mb: 3 }}
            />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text name="name" label="Nombre completo" InputLabelProps={{ shrink: true }} />

              <Field.Text
                name="email"
                label="Correo electrónico"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="password"
                label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                placeholder={isEdit ? 'Dejar vacío para mantener la actual' : 'Mínimo 8 caracteres'}
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Field.Text
                name="password_confirmation"
                label={isEdit ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
                type={passwordConfirm.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={passwordConfirm.onToggle} edge="end">
                        <Iconify
                          icon={passwordConfirm.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {errorMsg && (
                <Typography variant="body2" sx={{ color: 'error.main', whiteSpace: 'pre-line' }}>
                  {errorMsg}
                </Typography>
              )}
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Acciones" />
              <Stack spacing={2} sx={{ p: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  startIcon={<Iconify icon="eva:save-fill" />}
                >
                  {isEdit ? 'Actualizar usuario' : 'Guardar usuario'}
                </LoadingButton>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push(paths.dashboard.usuarios.root)}
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                >
                  Cancelar
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
