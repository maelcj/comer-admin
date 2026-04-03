'use client';

import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { esES } from '@mui/x-data-grid/locales';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getClientes } from 'src/actions/clientes';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function ClientesTable() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('posTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
  });
  const [search, setSearch] = useState(() => localStorage.getItem('clientesTableSearch') || '');
  const [search1, setSearch1] = useState(() => localStorage.getItem('clientesTableSearch1') || '');
  const [search2, setSearch2] = useState(() => localStorage.getItem('clientesTableSearch2') || '');
  const [search3, setSearch3] = useState(() => localStorage.getItem('clientesTableSearch3') || '');
  const [searchType, setSearchType] = useState(
    () => localStorage.getItem('clientesTableSearchType') || 1
  );
  const [debouncedSearch1] = useDebounce(search1, 500);
  const [debouncedSearch2] = useDebounce(search2, 500);
  const [debouncedSearch3] = useDebounce(search3, 500);

  useEffect(() => {
    localStorage.setItem('productosTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('clientesTableSearch', search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('clientesTableSearch1', search1);
  }, [search1]);

  useEffect(() => {
    localStorage.setItem('clientesTableSearch2', search2);
  }, [search2]);

  useEffect(() => {
    localStorage.setItem('clientesTableSearch3', search3);
  }, [search3]);

  useEffect(() => {
    localStorage.setItem('clientesTableSearchType', searchType);
  }, [searchType]);

  const columns = [
    {
      field: 'nombre',
      headerName: 'nombre',
      flex: 1,
      minWidth: 150,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ py: 2 }}>
          <Link href={paths.dashboard.clientes.edit(params.row.id)} style={{ color: 'inherit' }}>
            {params.row.nombre}
          </Link>
        </Box>
      ),
    },
    {
      field: 'correo',
      headerName: 'correo',
      flex: 1,
      minWidth: 150,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cotizaciones',
      headerName: 'cotizaciones',
      minWidth: 110,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ py: 1 }} useFlexGap flexWrap="wrap">
          {params.row.cotizaciones.map((cotizacion, key) => (
            <Link
              key={key}
              href={paths.dashboard.cotizaciones.edit(cotizacion)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Label variant="outlined" color="success" sx={{ cursor: 'pointer' }}>
                {cotizacion}
              </Label>
            </Link>
          ))}
        </Stack>
      ),
    },
    {
      field: 'pedidos',
      headerName: 'pedidos',
      minWidth: 110,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ py: 1 }} useFlexGap flexWrap="wrap">
          {params.row.pedidos.map((pedido, key) => (
            <Link
              key={key}
              href={paths.dashboard.pedidos.edit(pedido)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Label variant="outlined" color="info" sx={{ cursor: 'pointer' }}>
                {pedido}
              </Label>
            </Link>
          ))}
        </Stack>
      ),
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getClientes(paginationModel, search, searchType);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setisLoading(false);
  }, [paginationModel, search, searchType]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, search]);

  useEffect(() => {
    if (!debouncedSearch1 && (debouncedSearch2 || debouncedSearch3)) {
      return;
    }

    setSearch(debouncedSearch1);
    setSearchType(1);

    setSearch2('');
    setSearch3('');
  }, [debouncedSearch1]);

  useEffect(() => {
    if (!debouncedSearch2 && (debouncedSearch1 || debouncedSearch3)) {
      return;
    }

    setSearch(debouncedSearch2);
    setSearchType(2);

    setSearch1('');
    setSearch3('');
  }, [debouncedSearch2]);

  useEffect(() => {
    if (!debouncedSearch3 && (debouncedSearch1 || debouncedSearch2)) {
      return;
    }

    setSearch(debouncedSearch3);
    setSearchType(3);

    setSearch1('');
    setSearch2('');
  }, [debouncedSearch3]);

  return (
    <DataGrid
      onCellClick={(event) => event.stopPropagation}
      rows={rows}
      columns={columns}
      pagination
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: () => <EmptyContent />,
        noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
      }}
      slotProps={{
        toolbar: { search1, setSearch1, search2, setSearch2, search3, setSearch3 },
      }}
      loading={isLoading}
      filterMode="server"
      paginationMode="server"
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      onPaginationModelChange={setPaginationModel}
      initialState={{
        pagination: { paginationModel },
        density: 'compact',
      }}
      pageSizeOptions={[5, 10, 25]}
      rowCount={rowsCount}
      getRowHeight={() => 'auto'}
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

function CustomToolbar({ search1, setSearch1, search2, setSearch2, search3, setSearch3 }) {
  return (
    <GridToolbarContainer
      sx={{
        '.MuiInputBase-input': { py: '0.5rem !important' },
      }}
    >
      <TextField
        size="small"
        label="Nombre, correo"
        placeholder="Buscar..."
        value={search1}
        onChange={(e) => {
          setSearch1(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        size="small"
        label="Cotización"
        placeholder="Buscar #..."
        value={search2}
        onChange={(e) => {
          setSearch2(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        size="small"
        label="Pedido"
        placeholder="Buscar #..."
        value={search3}
        onChange={(e) => {
          setSearch3(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="material-symbols:search" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </GridToolbarContainer>
  );
}
