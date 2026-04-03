'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getUsuario } from 'src/actions/usuarios';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UsuarioCreateForm } from '../usuario-create-form';

// ----------------------------------------------------------------------

export function UsuarioEditView({ id }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsuario(id);
      if (response?.usuario) {
        setCurrentUser(response.usuario);
      } else {
        toast.error('Usuario no encontrado');
        router.push(paths.dashboard.usuarios.root);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Error al cargar el usuario');
      router.push(paths.dashboard.usuarios.root);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [loadUser, id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar usuario"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuarios', href: paths.dashboard.usuarios.root },
          { name: currentUser?.name || 'Editar' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!loading && currentUser && <UsuarioCreateForm currentUser={currentUser} />}
    </DashboardContent>
  );
}
