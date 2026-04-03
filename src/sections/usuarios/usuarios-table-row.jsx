import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function UsuariosTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onAssignRoles,
}) {
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.email}</TableCell>

        <TableCell>
          {row.role ? (
            <Label variant="soft" color="primary">
              {row.role}
            </Label>
          ) : (
            <Label variant="soft" color="default">
              Sin rol
            </Label>
          )}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={row.email_verified_at ? 'success' : 'warning'}>
            {row.email_verified_at ? 'Verificado' : 'Pendiente'}
          </Label>
        </TableCell>

        <TableCell>{fDate(row.created_at)}</TableCell>

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
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              onAssignRoles?.();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:user-id-bold" />
            Asignar rol
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
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
