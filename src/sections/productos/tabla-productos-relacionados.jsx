'use client';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { esES } from '@mui/x-data-grid/locales';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import {
  agregarProductoSimilar,
  agregarProductoRelacionado,
  getTablaProductosRelacionados,
} from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function TablaProductosRelacionados({ producto, handleGetProducto }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });

  const handleAgregarProductoRelacionado = async (id_relacionado) => {
    setIsLoading(true);
    const res = await agregarProductoRelacionado(producto.id, id_relacionado);
    await handleGetProducto(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleAgregarProductoSimilar = async (id_similar) => {
    setIsLoading(true);
    const res = await agregarProductoSimilar(producto.id, id_similar);
    await handleGetProducto(producto.id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const columns = [
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'left',
      headerAlign: 'right',
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify sx={{ color: 'primary.main' }} icon="fa6-solid:plus" />}
          label="Productos relacionados"
          onClick={() => {
            handleAgregarProductoRelacionado(params.row.id);
          }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify sx={{ color: 'warning.main' }} icon="fa6-solid:plus" />}
          label="Productos similares"
          onClick={() => {
            handleAgregarProductoSimilar(params.row.id);
          }}
        />,
      ],
    },
    {
      field: 'mpn',
      headerName: 'mpn',
      minWidth: 130,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'nombre_publicitario',
      headerName: 'nombre publicitario',
      minWidth: 250,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaProductosRelacionados(paginationModel, filterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [filterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, filterModel]);

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
      loading={isLoading}
      filterMode="server"
      paginationMode="server"
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      onPaginationModelChange={setPaginationModel}
      onFilterModelChange={setFilterModel}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[5, 10, 25]}
      rowCount={rowsCount}
      getRowHeight={() => 'auto'}
      disableRowSelectionOnClick
      autoHeight
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
      }}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
      {/* <GridToolbarDensitySelector /> */}
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}
