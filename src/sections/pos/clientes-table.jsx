'use client';

import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

const MAX_VISIBLE_ITEMS = 10;

export function ClientesTable({ refreshTrigger = 0 }) {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('posTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
  });
  const [search, setSearch] = useState('');
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [search3, setSearch3] = useState('');
  const [searchType, setSearchType] = useState(1);
  const [debouncedSearch1] = useDebounce(search1, 500);
  const [debouncedSearch2] = useDebounce(search2, 500);
  const [debouncedSearch3] = useDebounce(search3, 500);

  useEffect(() => {
    localStorage.setItem('productosTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  const renderBadgesCell = (items, getHref, color, clienteId) => {
    const rawItems = items ?? [];
    const allNumeric = rawItems.every((item) => !Number.isNaN(Number(item)));
    const sortedItems = allNumeric
      ? [...rawItems].sort((a, b) => Number(b) - Number(a))
      : [...rawItems].reverse();

    const visibleItems = sortedItems.slice(0, MAX_VISIBLE_ITEMS);
    const hasMore = sortedItems.length > MAX_VISIBLE_ITEMS;

    return (
      <Box
        sx={{
          py: 0.75,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {visibleItems.map((item, key) => (
          <Link
            key={`${item}-${key}`}
            href={getHref(item)}
            style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex' }}
          >
            <Label variant="outlined" color={color} sx={{ cursor: 'pointer' }}>
              {item}
            </Label>
          </Link>
        ))}

        {hasMore && (
          <Button
            component={Link}
            href={paths.dashboard.clientes.edit(clienteId)}
            size="small"
            variant="soft"
            color={color}
            sx={{
              height: 24,
              minWidth: 'auto',
              px: 1,
              fontSize: 12,
              lineHeight: 1,
              borderRadius: 0.75,
            }}
          >
            Ver todos
          </Button>
        )}
      </Box>
    );
  };

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
      flex: 1.5,
      minWidth: 250,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        renderBadgesCell(
          params.row.cotizaciones,
          paths.dashboard.cotizaciones.edit,
          'success',
          params.row.id
        ),
    },
    {
      field: 'pedidos',
      headerName: 'pedidos',
      flex: 1.5,
      minWidth: 250,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        renderBadgesCell(params.row.pedidos, paths.dashboard.pedidos.edit, 'info', params.row.id),
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
  }, [fetchTableData, paginationModel, search, refreshTrigger]);

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
