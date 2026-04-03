'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { getRoles, createRole, deleteRole, updateRole } from 'src/actions/roles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre' },
  { id: 'description', label: 'Descripción' },
  { id: 'users_count', label: 'Usuarios asignados' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

function RolesTableRow({ row, onDeleteRow, onRefresh }) {
  const confirm = useBoolean();
  const editDialog = useBoolean();
  const popover = useBoolean();

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
          <Button
            size="small"
            onClick={() => editDialog.onTrue()}
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => confirm.onTrue()}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            sx={{ ml: 1 }}
          >
            Eliminar
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <DialogTitle>Eliminar rol</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar el rol &quot;{row.name}&quot;?</Typography>
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
            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={editForm.description}
            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={editDialog.onFalse}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={!editForm.name.trim()}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function RolesSection() {
  const table = useTable();
  const createDialog = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [rowCount, setRowCount] = useState(0);

  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
  });

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRoles(paginationModel, '');
      if (response?.rows) {
        setTableData(response.rows);
        setRowCount(response.rowCount || 0);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Error al cargar roles');
    } finally {
      setIsLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleDeleteRole = useCallback(
    async (id) => {
      try {
        await deleteRole(id);
        toast.success('Rol eliminado exitosamente');
        await loadRoles();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al eliminar el rol');
      }
    },
    [loadRoles]
  );

  const handleCreateRole = async () => {
    try {
      await createRole(newRoleForm);
      toast.success('Rol creado exitosamente');
      setNewRoleForm({ name: '', description: '' });
      createDialog.onFalse();
      await loadRoles();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear el rol');
    }
  };

  const handleChangePage = useCallback((event, newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    }));
  }, []);

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={createDialog.onTrue}
        >
          Nuevo rol
        </Button>
      </Box>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Cargando...</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row) => (
                  <RolesTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => handleDeleteRole(row.id)}
                    onRefresh={loadRoles}
                  />
                ))
              )}

              <TableNoData notFound={!isLoading && tableData.length === 0} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        page={paginationModel.page}
        dense={table.dense}
        count={rowCount}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={handleChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog para crear nuevo rol */}
      <Dialog open={createDialog.value} onClose={createDialog.onFalse} maxWidth="sm" fullWidth>
        <DialogTitle>Crear nuevo rol</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del rol"
            value={newRoleForm.name}
            onChange={(e) => setNewRoleForm((prev) => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={newRoleForm.description}
            onChange={(e) => setNewRoleForm((prev) => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={createDialog.onFalse}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateRole}
            disabled={!newRoleForm.name.trim()}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
