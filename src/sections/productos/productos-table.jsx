'use client';

import * as NProgress from 'nprogress';
import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { getProductos } from 'src/actions/productos';

import { penIcon, cartIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

import { RenderCellProducto } from './productos-table-row';
import { ProductosTableToolbar } from './productos-table-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'no_visible', label: 'No visible' },
  { value: 'out_of_stock', label: 'Sin stock' },
];

// ----------------------------------------------------------------------

export function ProductosTable({
  handleQuickEdit,
  openQuickDialog,
  productosCarrito,
  setProductosCarrito,
}) {
  const router = useRouter();
  const filters = useSetState({ status: [] });
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('productosTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('productosTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useEffect(() => {
    localStorage.setItem('productosTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('productosTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  const handleEditRow = (id) => {
    NProgress.start();
    router.push(paths.dashboard.productos.edit(id));
  };

  const handleAddToCart = (id, nombre) => {
    const newProductosCarrito = [...productosCarrito];
    const cantidad = 1;
    newProductosCarrito.push({ id, nombre, cantidad });
    setProductosCarrito(newProductosCarrito);
  };

  const columns = [
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 40,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="column" spacing={0}>
          <Tooltip title="Edición rápida" placement="right">
            <IconButton
              color="warning"
              variant="soft"
              onClick={() => {
                handleQuickEdit(params.row.id);
              }}
            >
              {penIcon}
            </IconButton>
          </Tooltip>

          <Tooltip title="Carrito" placement="right">
            <IconButton
              color="success"
              variant="soft"
              onClick={() => {
                handleAddToCart(params.row.id, params.row.nombre_final);
              }}
            >
              {cartIcon}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'producto',
      headerName: 'producto',
      flex: 1,
      minWidth: 210,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProducto params={params} />,
    },
    {
      field: 'mpn',
      headerName: 'mpn',
      minWidth: 130,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'tipo',
      headerName: 'tipo',
      minWidth: 150,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'marca',
      headerName: 'marca',
      minWidth: 110,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'precio_final',
      headerName: 'precio final',
      minWidth: 150,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'moneda',
      headerName: 'moneda',
      minWidth: 50,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getProductos(paginationModel, debounceFilterModel, filters.state);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setisLoading(false);
  }, [debounceFilterModel, paginationModel, filters.state]);

  useEffect(() => {
    if (!openQuickDialog) {
      fetchTableData();
    }
  }, [fetchTableData, paginationModel, debounceFilterModel, filters.state, openQuickDialog]);

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
        }}
        slotProps={{
          toolbar: { filters },
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
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [initialQuickFilterValue],
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        rowCount={rowsCount}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        sx={{
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
          // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '2px' },
          // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '2px' },
          // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '2px' },
          height: '600px',
        }}
      />
    </Card>
  );
}

function CustomToolbar({ filters }) {
  return (
    <GridToolbarContainer>
      <ProductosTableToolbar filters={filters} options={{ status: STATUS_OPTIONS }} />

      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
      {/* <GridToolbarDensitySelector /> */}
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        {/* <GridToolbarExport /> */}
      </Stack>
    </GridToolbarContainer>
  );
}
