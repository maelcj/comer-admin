'use client';

import { useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCupones, registrarCupon } from 'src/actions/cupones';

import { plusIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Cupon from '../cupon';

// ----------------------------------------------------------------------

export function CuponesView() {
  const [cupones, setCupones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCupones = async () => {
    const res = await getCupones();
    if (res.type === 'error') return toast.error(res.message);
    return setCupones(res);
  };

  const handleRegistrarCupon = async () => {
    setIsLoading(true);
    const res = await registrarCupon();

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetCupones();

    return toast.success(res.message);
  };

  useEffect(() => {
    handleGetCupones();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Cupones"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Cupones' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <LoadingButton
            variant="contained"
            loading={isLoading}
            loadingPosition="start"
            startIcon={plusIcon}
            onClick={() => {
              handleRegistrarCupon();
            }}
          >
            Nuevo cupón
          </LoadingButton>
        }
      />
      {cupones.map((cupon) => (
        <Cupon key={cupon.id} cupon={cupon} handleGetCupones={handleGetCupones} />
      ))}
    </DashboardContent>
  );
}
