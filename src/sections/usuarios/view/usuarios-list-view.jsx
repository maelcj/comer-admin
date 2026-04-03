'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { getUsuarios, deleteUsuario } from 'src/actions/usuarios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { RolesSection } from '../roles-section';
import { UsuariosTableRow } from '../usuarios-table-row';
import { AssignRolesDialog } from '../assign-roles-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre' },
  { id: 'email', label: 'Email' },
  { id: 'roles', label: 'Roles' },
  { id: 'email_verified_at', label: 'Email verificado' },
  { id: 'created_at', label: 'Fecha registro' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UsuariosListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const [rowCount, setRowCount] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [assignRolesOpen, setAssignRolesOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('usuarios');

  const loadUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsuarios(paginationModel, '', 0);
      if (response?.rows) {
        setTableData(response.rows);
        setRowCount(response.rowCount || 0);
      }
    } catch (error) {
      console.error('Error loading usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const notFound = !isLoading && tableData.length === 0;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteUsuario(id);

        toast.success('Usuario eliminado exitosamente');
        await loadUsuarios(); // Recargar datos

        // Actualizar selección si es necesario
        if (table.selected.includes(id)) {
          table.onSelectRow(id);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al eliminar el usuario');
      }
    },
    [table, loadUsuarios]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      // Eliminar usuarios seleccionados
      await Promise.all(table.selected.map((id) => deleteUsuario(id)));

      toast.success(`${table.selected.length} usuarios eliminados exitosamente`);
      await loadUsuarios(); // Recargar datos
      table.setSelected([]); // Limpiar selección
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar usuarios');
    }
  }, [table.selected, loadUsuarios, table]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.usuarios.edit(id));
    },
    [router]
  );

  const handleAssignRoles = useCallback((user) => {
    setSelectedUser(user);
    setAssignRolesOpen(true);
  }, []);

  const handleCloseAssignRoles = useCallback(() => {
    setAssignRolesOpen(false);
    setSelectedUser(null);
  }, []);

  const handleRolesAssigned = useCallback(() => {
    loadUsuarios(); // Recargar la lista para ver los roles actualizados
  }, [loadUsuarios]);

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
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Gestión de usuarios y roles"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Usuarios', href: paths.dashboard.usuarios.root },
          ]}
          action={
            currentTab === 'usuarios' && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => router.push(paths.dashboard.usuarios.new)}
              >
                Nuevo usuario
              </Button>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.divider}`,
            }}
          >
            <Tab
              iconPosition="start"
              value="usuarios"
              label="Usuarios"
              icon={<Iconify icon="solar:users-group-rounded-bold" />}
            />
            <Tab
              iconPosition="start"
              value="roles"
              label="Roles"
              icon={<Iconify icon="solar:shield-user-bold" />}
            />
          </Tabs>

          {currentTab === 'usuarios' && (
            <Box>
              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Eliminar">
                      <IconButton color="primary" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          tableData.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography>Cargando...</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        tableData.map((row) => (
                          <UsuariosTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onAssignRoles={() => handleAssignRoles(row)}
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
            </Box>
          )}

          {currentTab === 'roles' && (
            <Box sx={{ p: 2 }}>
              <RolesSection />
            </Box>
          )}
        </Card>
      </DashboardContent>

      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <DialogTitle>Eliminar usuarios</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar <strong> {table.selected.length} </strong> elementos?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <AssignRolesDialog
        open={assignRolesOpen}
        onClose={handleCloseAssignRoles}
        user={selectedUser}
        onSuccess={handleRolesAssigned}
      />
    </>
  );
}
