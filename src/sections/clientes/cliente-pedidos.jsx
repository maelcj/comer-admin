'use client';

import * as NProgress from 'nprogress';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { esES } from '@mui/x-data-grid/locales';
import CardHeader from '@mui/material/CardHeader';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { registrarPedido } from 'src/actions/pedidos';
import { getTablaPedidos } from 'src/actions/clientes';

import { Label } from 'src/components/label';
import { plusIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';

import PedidosPendientesDialog from './pedidos-pendientes-dialog';

export const ClientePedidos = ({ cliente }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [openDialogPedidosPendientes, setOpenDialogPedidosPendientes] = useState(false);

  const handleEditRow = (id) => {
    NProgress.start();
    router.push(paths.dashboard.pedidos.edit(id));
  };

  const columns = [
    {
      field: 'id',
      headerName: '#',
      minWidth: 60,
      flex: 1,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Label
          variant="outlined"
          color="info"
          onClick={() => {
            handleEditRow(params.row.id);
          }}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.id}
        </Label>
      ),
    },
    {
      field: 'usuario',
      headerName: 'usuario',
      minWidth: 100,
      flex: 1,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'fecha',
      headerName: 'fecha',
      minWidth: 100,
      flex: 1,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total',
      headerName: 'total',
      minWidth: 100,
      flex: 1,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const handleRegistrarPedido = async () => {
    setIsLoading(true);
    const res = await registrarPedido(cliente.id);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    NProgress.start();
    router.push(paths.dashboard.pedidos.edit(res.data.id));

    return null;
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaPedidos(cliente.id, paginationModel, filterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [filterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, filterModel]);

  return (
    <>
      <PedidosPendientesDialog
        cliente={cliente}
        open={openDialogPedidosPendientes}
        setOpen={setOpenDialogPedidosPendientes}
      />
      <Card>
        <CardHeader
          title="Pedidos"
          action={
            <>
              <Button
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => {
                  setOpenDialogPedidosPendientes(true);
                }}
              >
                Pedidos pendientes
              </Button>
              <Button
                color="primary"
                startIcon={plusIcon}
                onClick={() => {
                  handleRegistrarPedido();
                }}
              >
                Nuevo
              </Button>
            </>
          }
          sx={{ mb: 2, pt: 2, px: 2 }}
        />

        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: () => <EmptyContent />,
            noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
          }}
          loading={isLoading}
          filterMode="server"
          paginationMode="server"
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onPaginationModelChange={setPaginationModel}
          onFilterModelChange={setFilterModel}
          initialState={{
            pagination: { paginationModel },
            density: 'compact',
          }}
          pageSizeOptions={[5, 10, 25]}
          rowCount={rowsCount}
          disableRowSelectionOnClick
          sx={{
            '--DataGrid-overlayHeight': '220px',
            [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '5px' },
          }}
        />
      </Card>
    </>
  );
};

function CustomToolbar() {
  return <GridToolbarContainer />;
}
