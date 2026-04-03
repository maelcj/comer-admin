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

import { getGoogleProductCategories, deleteGoogleProductCategory } from 'src/actions/google';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function GoogleTable() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('googleTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
  });
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('googleTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem('googleTableSort');
    return saved ? JSON.parse(saved) : [{ field: 'id', sort: 'desc' }];
  });

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useEffect(() => {
    localStorage.setItem('googleTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('googleTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  useEffect(() => {
    localStorage.setItem('googleTableSort', JSON.stringify(sortModel));
  }, [sortModel]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      const result = await deleteGoogleProductCategory(id);
      if (result.type === 'success') {
        fetchTableData();
      }
    }
  };

  const columns = [
    {
      field: 'actions',
      headerName: '',
      align: 'left',
      headerAlign: 'right',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center">
          <Tooltip title="Editar" placement="top" arrow>
            <Link
              href={paths.dashboard.google.edit(params.row.id)}
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
          <Tooltip title="Eliminar" placement="top" arrow>
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                />
              </svg>
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'category_id',
      headerName: 'ID',
      minWidth: 150,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      minWidth: 250,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'taxonomy',
      headerName: 'Taxonomía',
      minWidth: 300,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'created_at',
      headerName: 'Fecha de creación',
      minWidth: 180,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getGoogleProductCategories(paginationModel, debounceFilterModel, sortModel);
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
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}
