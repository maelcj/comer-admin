'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { esES } from '@mui/x-data-grid/locales';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { updatePublicidad, getTablaEstadisticas } from 'src/actions/estadisticas';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const EstadisticasTable = forwardRef((props, ref) => {
  const { fechaInicio, fechaFin } = props;

  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('estadisticasTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('estadisticasTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem('estadisticasTableSort');
    return saved ? JSON.parse(saved) : [{ field: 'total_vendido', sort: 'desc' }];
  });

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useImperativeHandle(ref, () => ({
    fetchTableData,
  }));

  useEffect(() => {
    localStorage.setItem('estadisticasTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('estadisticasTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  useEffect(() => {
    localStorage.setItem('estadisticasTableSort', JSON.stringify(sortModel));
  }, [sortModel]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'mpn',
      headerName: 'MPN',
      minWidth: 150,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      flex: 1,
    },

    {
      field: 'marca',
      headerName: 'Marca',
      width: 120,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cantidad_vendida',
      headerName: 'Cant. Vendida',
      width: 120,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      type: 'number',
    },
    {
      field: 'total_vendido',
      headerName: 'Total Vendido',
      width: 130,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cantidad_cotizada',
      headerName: 'Cant. Cotizada',
      width: 130,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      type: 'number',
    },
    {
      field: 'total_cotizado',
      headerName: 'Total Cotizado',
      width: 140,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'publicidad',
      headerName: 'Publicidad',
      width: 100,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={async (event) => {
            try {
              await updatePublicidad(params.row.id, event.target.checked);
              // Refresh the table data after successful update
              fetchTableData();
            } catch (error) {
              console.error('Error updating publicidad:', error);
            }
          }}
          size="small"
        />
      ),
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getTablaEstadisticas(
      paginationModel,
      debounceFilterModel,
      fechaInicio,
      fechaFin
    );
    if (data && data.rows) {
      setRows(data.rows);
      setRowsCount(data.totalRows);
    }
    setisLoading(false);
  }, [debounceFilterModel, paginationModel, sortModel, fechaInicio, fechaFin]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return (
    <Card>
      <DataGrid
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
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
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [initialQuickFilterValue],
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        rowCount={rowsCount}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        }}
      />
    </Card>
  );
});

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}

export default EstadisticasTable;
