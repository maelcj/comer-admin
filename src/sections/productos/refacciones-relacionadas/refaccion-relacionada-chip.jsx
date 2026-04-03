'use client';

import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { eliminarRefaccionRelacionada } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';

const RefaccionChip = ({
  refaccion,
  producto,
  isLoading,
  setIsLoading,
  handleGetRefaccionesRelacionadas,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(paths.dashboard.refacciones.edit(refaccion.id));
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await eliminarRefaccionRelacionada(refaccion.id, producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetRefaccionesRelacionadas();

    return toast.success(res.message);
  };

  return (
    <Chip
      label={refaccion?.modelo}
      onClick={handleClick}
      onDelete={handleDelete}
      deleteIcon={<DeleteIcon />}
      variant="outlined"
    />
  );
};

export default RefaccionChip;
