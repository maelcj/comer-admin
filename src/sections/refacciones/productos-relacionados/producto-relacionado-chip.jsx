'use client';

import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { eliminarProductoRelacionado } from 'src/actions/refacciones';

import { toast } from 'src/components/snackbar';

const ProductoChip = ({
  producto,
  refaccion,
  isLoading,
  setIsLoading,
  handleGetProductosRelacionados,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(paths.dashboard.productos.edit(producto.id));
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await eliminarProductoRelacionado(producto.id, refaccion.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetProductosRelacionados();

    return toast.success(res.message);
  };

  return (
    <Chip
      label={producto?.mpn}
      onClick={handleClick}
      onDelete={handleDelete}
      deleteIcon={<DeleteIcon />}
      variant="outlined"
    />
  );
};

export default ProductoChip;
