import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { TablaAgregarRefaccionesRelacionadas } from './tabla-agregar-refacciones-relacionadas';

export default function DialogAgregar({
  producto,
  open,
  setOpen,
  handleGetRefaccionesRelacionadas,
}) {
  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle sx={{ p: 2 }}>Agregar refacciones</DialogTitle>

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

      <DialogContent sx={{ px: 0 }}>
        <TablaAgregarRefaccionesRelacionadas
          producto={producto}
          handleGetRefaccionesRelacionadas={handleGetRefaccionesRelacionadas}
        />
      </DialogContent>
    </Dialog>
  );
}
