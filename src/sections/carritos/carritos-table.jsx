'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { getCarritos } from 'src/actions/carritos';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function CarritosTable({ handleViewCarrito }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const handleEditRow = (id) => {
    window.location.href = `/dashboard/carritos/${id}/editar`;
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
          <Tooltip title="Ver" placement="top" arrow>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                handleViewCarrito(params.row.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.821 12.43c-.083-.119-2.062-2.944-4.793-4.875C15.612 6.552 13.826 6 12 6s-3.611.552-5.03 1.555c-2.731 1.931-4.708 4.756-4.791 4.875a1 1 0 0 0 0 1.141c.083.119 2.06 2.944 4.791 4.875C8.389 19.448 10.175 20 12 20s3.612-.552 5.028-1.555c2.731-1.931 4.71-4.756 4.793-4.875a1 1 0 0 0 0-1.14M12 16.5c-1.934 0-3.5-1.57-3.5-3.5c0-1.934 1.566-3.5 3.5-3.5c1.93 0 3.5 1.566 3.5 3.5c0 1.93-1.57 3.5-3.5 3.5m2-3.5c0 1.102-.898 2-2 2a2 2 0 1 1 2-2"
                />
              </svg>
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar" placement="top" arrow>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                handleEditRow(params.row.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                />
              </svg>
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'id',
      headerName: 'id',
      width: 80,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {params.row.id}
          </Box>
          {params.row.alertas && params.row.alertas.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'warning.main',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15"
                />
              </svg>
            </Box>
          )}
        </Stack>
      ),
    },
    {
      field: 'cliente',
      headerName: 'cliente',
      width: 150,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'total',
      headerName: 'total',
      width: 110,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'creado',
      headerName: 'creado',
      width: 150,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'actualizado',
      headerName: 'actualizado',
      width: 150,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getCarritos(paginationModel, debounceFilterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel]);

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
  return <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }} />;
}
