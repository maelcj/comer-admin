'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { createGoogleProductCategory } from 'src/actions/google';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export const GoogleProductCategorySchema = zod.object({
  category_id: zod.string().min(1, { message: 'Category ID es requerido!' }),
  name: zod.string().min(1, { message: 'Nombre es requerido!' }),
  taxonomy: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function GoogleCreateView() {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      category_id: '',
      name: '',
      taxonomy: '',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(GoogleProductCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await createGoogleProductCategory(data);

      if (result.type === 'success') {
        toast.success(result.message);
        router.push(paths.dashboard.google.root);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado');
    }
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Crear Nueva Categoría"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Google Product Categories', href: paths.dashboard.google.root },
          { name: 'Nueva Categoría' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Información de la Categoría" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text
                name="category_id"
                label="Category ID"
                helperText="ID de la categoría de Google"
              />

              <Field.Text name="name" label="Nombre" helperText="Nombre de la categoría" />

              <Field.Text
                name="taxonomy"
                label="Taxonomía"
                multiline
                rows={3}
                helperText="Taxonomía completa de la categoría"
              />
            </Stack>
          </Card>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => router.push(paths.dashboard.google.root)}>
              Cancelar
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Crear Categoría
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </DashboardContent>
  );
}
