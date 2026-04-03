'use client';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { getComentarios } from 'src/actions/comentarios';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Comentario from '../comentario';
import CreateComentarioDialog from '../create-comentario-dialog';

// ----------------------------------------------------------------------

export function ComentariosView({ page }) {
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [lastPage, setLastPage] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleGetComentarios = async () => {
    const res = await getComentarios(currentPage);
    if (res.type === 'error') return toast.error(res.message);
    setComentarios(res.data);
    setLastPage(res.last_page);
    return null;
  };

  const handleChangePage = (value) => {
    setCurrentPage(value);
    // scroll to top
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    handleGetComentarios();
  }, [currentPage]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Comentarios"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Comentarios' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={() => setCreateDialogOpen(true)}>
          Crear Comentario
        </Button>
        <Pagination
          shape="rounded"
          color="primary"
          count={lastPage}
          variant="text"
          page={currentPage}
          onChange={(event, value) => {
            handleChangePage(value);
          }}
        />
      </Stack>
      {comentarios.map((comentario) => (
        <Comentario
          key={comentario.id}
          comentario={comentario}
          handleGetComentarios={handleGetComentarios}
        />
      ))}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Pagination
          shape="rounded"
          color="primary"
          count={lastPage}
          variant="text"
          page={currentPage}
          onChange={(event, value) => {
            handleChangePage(value);
          }}
        />
      </Stack>

      <CreateComentarioDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onComentarioCreated={handleGetComentarios}
      />
    </DashboardContent>
  );
}
