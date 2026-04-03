import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { updateRole } from 'src/actions/roles';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function RolesTableRow({ row, onDeleteRow, onRefresh }) {
  const confirm = useBoolean();
  const editDialog = useBoolean();
  const popover = usePopover();

  const [editForm, setEditForm] = useState({
    name: row.name,
    description: row.description || '',
  });

  const handleEditSubmit = async () => {
    try {
      await updateRole(row.id, editForm);
      toast.success('Rol actualizado exitosamente');
      editDialog.onFalse();
      onRefresh?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.name}</TableCell>
        
        <TableCell>{row.description || '-'}</TableCell>

        <TableCell>{row.users_count || 0}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Acciones" placement="top" arrow>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              editDialog.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <DialogTitle>Eliminar rol</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el rol &quot;{row.name}&quot;?
          </Typography>
          {row.users_count > 0 && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              Este rol está asignado a {row.users_count} usuario(s).
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.value} onClose={editDialog.onFalse} maxWidth="sm" fullWidth>
        <DialogTitle>Editar rol</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del rol"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={editDialog.onFalse}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSubmit}
            disabled={!editForm.name.trim()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}