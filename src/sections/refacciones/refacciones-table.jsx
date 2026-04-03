'use client';

import Link from 'next/link';
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
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getRefacciones } from 'src/actions/refacciones';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function RefaccionesTable() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('refaccionesTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('refaccionesTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem('refaccionesTableSort');
    return saved ? JSON.parse(saved) : [{ field: 'id', sort: 'desc' }];
  });

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useEffect(() => {
    localStorage.setItem('refaccionesTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('refaccionesTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  useEffect(() => {
    localStorage.setItem('refaccionesTableSort', JSON.stringify(sortModel));
  }, [sortModel]);

  const columns = [
    {
      field: 'actions',
      headerName: '',
      align: 'left',
      headerAlign: 'right',
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center">
          <Tooltip title="Editar" placement="top" arrow>
            <Link
              href={paths.dashboard.refacciones.edit(params.row.id)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <IconButton size="small" color="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m11.4 18.161l7.396-7.396a10.289 10.289 0 0 1-3.326-2.234a10.29 10.29 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.556 6.556 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56c.43-.205.836-.456 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.754 8.754 0 0 0 2.092 3.32a8.754 8.754 0 0 0 3.431 2.13z"
                  />
                </svg>
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'id',
      headerName: 'id',
      width: 80,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'modelo',
      headerName: 'modelo',
      minWidth: 150,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'descripcion',
      headerName: 'descripcion',
      minWidth: 250,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'disponible',
      headerName: 'disponible',
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'visible',
      headerName: 'visible',
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'inventario',
      headerName: 'inventario',
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'marca',
      headerName: 'marca',
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getRefacciones(paginationModel, debounceFilterModel, sortModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setisLoading(false);
  }, [debounceFilterModel, paginationModel, sortModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel, sortModel]);

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
        pageSizeOptions={[5, 10, 25]}
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
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
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
