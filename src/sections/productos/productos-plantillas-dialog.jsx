import * as React from 'react';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getPlantilla,
  editarCampoPlantilla,
  eliminarCampoPlantilla,
  registrarCampoPlantilla,
} from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export default function PlantillaDialog({ open, setOpen, idPlantilla }) {
  const [isLoading, setIsLoading] = useState('');
  const [plantilla, setPlantilla] = useState({});
  const [nombreRegistrarCampoPlatilla, setNombreRegistrarCampoPlatilla] = useState('');

  const handleGetPlantilla = async () => {
    setIsLoading(true);

    setPlantilla({});
    const res = await getPlantilla(idPlantilla);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setPlantilla(res);

    return null;
  };

  const handleEditarCampoPlantilla = async (id) => {
    setIsLoading(true);
    const nombre = document.getElementById(`nombreCampoPlantilla-${id}`).value;
    const res = await editarCampoPlantilla(idPlantilla, nombre, id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleEliminarCampoPlantilla = async (id) => {
    setIsLoading(true);
    const res = await eliminarCampoPlantilla(idPlantilla, id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetPlantilla();

    return toast.success(res.message);
  };

  const handleRegistrarCampoPlantilla = async () => {
    if (!nombreRegistrarCampoPlatilla) return toast.error('El campo no puede estar vacío');

    setIsLoading(true);
    const res = await registrarCampoPlantilla(idPlantilla, nombreRegistrarCampoPlatilla);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    setNombreRegistrarCampoPlatilla('');

    handleGetPlantilla();

    return toast.success(res.message);
  };

  // use effect for open
  useEffect(() => {
    if (open) {
      handleGetPlantilla();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <Backdrop
        open={isLoading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'absolute',
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <DialogTitle>Editar plantilla &quot;{plantilla?.nombre}&quot;</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={() => {
          setOpen(false);
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        {plantilla?.campos &&
          plantilla.campos.map((campo, index) => (
            <Stack direction="row" key={index} sx={{ mt: 1, mb: 0 }}>
              <TextField
                inputProps={{ className: 'campoFichaTecnica' }}
                size="small"
                defaultValue={campo}
                name={campo}
                id={`nombreCampoPlantilla-${index}`}
                sx={{ width: '100%', maxWidth: '300px' }}
              />
              <IconButton
                size="medium"
                color="primary"
                onClick={() => {
                  handleEditarCampoPlantilla(index);
                }}
              >
                <Iconify icon="fa-solid:check" />
              </IconButton>
              <IconButton
                size="medium"
                color="error"
                onClick={() => {
                  handleEliminarCampoPlantilla(index);
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          ))}
        <Stack direction="row" gap={1} sx={{ mt: 1, mb: 0 }}>
          <TextField
            inputProps={{ className: 'campoFichaTecnica' }}
            size="small"
            value={nombreRegistrarCampoPlatilla}
            onChange={(e) => setNombreRegistrarCampoPlatilla(e.target.value)}
            sx={{ width: '100%', maxWidth: '300px' }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              handleRegistrarCampoPlantilla();
            }}
          >
            Registrar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
