'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { eliminarOfertaTemporal } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';

import DialogEditar from './dialog-editar';

const OfertaChip = ({ oferta, handleGetOfertas, handleGetProducto }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEliminar = async () => {
    setIsLoading(true);
    const res = await eliminarOfertaTemporal(oferta.id);
    setIsLoading(false);
    handleClose();

    if (res.type === 'error') return toast.error(res.message);

    await handleGetOfertas();
    if (handleGetProducto) await handleGetProducto();
    return toast.success(res.message);
  };

  const getLabel = () => {
    const fechaInicio = format(new Date(oferta.fecha_inicio), 'dd/MM/yyyy HH:mm', { locale: es });
    const fechaFin = format(new Date(oferta.fecha_fin), 'dd/MM/yyyy HH:mm', { locale: es });
    const descuento =
      oferta.tipo_descuento === 'porcentaje'
        ? `${oferta.cantidad_descuento}%`
        : `$${oferta.cantidad_descuento}`;

    return `${descuento} (${fechaInicio} - ${fechaFin})`;
  };

  const getColor = () => {
    const now = new Date();
    const inicio = new Date(oferta.fecha_inicio);
    const fin = new Date(oferta.fecha_fin);

    if (!oferta.activa) return 'default';
    if (now < inicio) return 'info';
    if (now >= inicio && now <= fin) return 'success';
    return 'warning';
  };

  return (
    <>
      <DialogEditar
        open={openDialogEditar}
        setOpen={setOpenDialogEditar}
        oferta={oferta}
        handleGetOfertas={handleGetOfertas}
        handleGetProducto={handleGetProducto}
      />

      <Chip
        label={getLabel()}
        color={getColor()}
        onClick={handleClick}
        disabled={isLoading}
        sx={{ cursor: 'pointer' }}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenDialogEditar(true);
          }}
        >
          Editar
        </MenuItem>
        <MenuItem onClick={handleEliminar} disabled={isLoading}>
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};

export default OfertaChip;
