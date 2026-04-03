'use client';

import * as NProgress from 'nprogress';
import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  asignarPedidoPendiente,
  eliminarPedidoPendiente,
  getTablaPedidosPendientes,
} from 'src/actions/clientes';

import { toast } from 'src/components/snackbar';
import { trashIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function PedidosPendientesTabla({ cliente, setOpen }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const handleAsignarPedidoPendiente = async (id_pedido) => {
    setIsLoading(true);
    const res = await asignarPedidoPendiente(id_pedido, cliente.id);
    setOpen(false);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    NProgress.start();
    router.push(paths.dashboard.pedidos.edit(id_pedido));

    return toast.success(res.message);
  };

  const handleEliminarPedidoPendiente = async (id_pedido) => {
    setIsLoading(true);
    const res = await eliminarPedidoPendiente(id_pedido);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    fetchTableData();

    return toast.success(res.message);
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 60,
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Asignar" placement="top" arrow>
            <IconButton
              color="primary"
              onClick={() => {
                handleAsignarPedidoPendiente(params.row.id);
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" placement="top" arrow>
            <IconButton
              color="error"
              onClick={() => {
                handleEliminarPedidoPendiente(params.row.id);
              }}
            >
              {trashIcon}
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {
      field: 'id',
      headerName: 'pedido',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 50,
    },
    {
      field: 'cliente',
      headerName: 'cliente',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'fecha',
      headerName: 'fecha',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'total',
      headerName: 'total',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'productos',
      headerName: 'productos',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 80,
      flex: 1,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaPedidosPendientes(paginationModel, debounceFilterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pagination
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: () => <EmptyContent />,
        noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
      }}
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      loading={isLoading}
      filterMode="server"
      paginationMode="server"
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
      }}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
          quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
        />
      </Stack>
    </GridToolbarContainer>
  );
}
