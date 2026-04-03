'use client';

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

import {
  agregarRefaccionCotizacion,
  getTablaAgregarRefaccionesCotizacion,
} from 'src/actions/cotizaciones';

import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function CotizacionRefaccionesAgregarTabla({ cotizacion, handleGetCotizacion, setOpen }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const handleAgregarRefaccionCotizacion = async (id_refaccion) => {
    setIsLoading(true);
    const res = await agregarRefaccionCotizacion(cotizacion.id, id_refaccion);
    setOpen(false);
    await handleGetCotizacion();
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const columns = [
    {
      field: 'id',
      type: 'actions',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 60,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="Agregar" placement="top" arrow>
          <IconButton
            color="primary"
            onClick={() => {
              handleAgregarRefaccionCotizacion(params.row.id);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'modelo',
      headerName: 'modelo',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'descripcion',
      headerName: 'descripción',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'disponible',
      headerName: 'disponible',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'precio',
      headerName: 'precio',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 120,
      flex: 1,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaAgregarRefaccionesCotizacion(paginationModel, debounceFilterModel);
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
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '5px' },
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
