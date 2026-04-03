'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { Box, Stack } from '@mui/material';
import { esES } from '@mui/x-data-grid/locales';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getTablaCotizaciones } from 'src/actions/cotizaciones';

import { Label } from 'src/components/label';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const CotizacionesTabla = ({ fechaInicio, fechaFin }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });

  const columns = [
    {
      field: 'id',
      headerName: '#',
      flex: 1,
      minWidth: 70,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Link
          href={paths.dashboard.cotizaciones.edit(params.row.id)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Label variant="outlined" color="primary" sx={{ cursor: 'pointer' }}>
            {params.row.id}
          </Label>
        </Link>
      ),
    },
    {
      field: 'cliente',
      headerName: 'cliente',
      flex: 1,
      minWidth: 250,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            href={paths.dashboard.clientes.edit(params.row.clienteId)}
            style={{ color: 'inherit' }}
          >
            {params.row.cliente}
          </Link>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {params.row.correo}
          </Box>
        </Stack>
      ),
    },
    {
      field: 'fecha',
      headerName: 'fecha',
      flex: 1,
      minWidth: 150,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="column">
          <Box sx={{ lineHeight: 1.2 }}>{params.row.fecha}</Box>
          <Box sx={{ lineHeight: 1.2 }}>{params.row.hora}</Box>
        </Stack>
      ),
    },
    {
      field: 'total',
      headerName: 'total',
      flex: 1,
      minWidth: 150,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaCotizaciones(paginationModel, filterModel);

    setRows(data.rows);

    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [filterModel, paginationModel]);

  useEffect(() => {
    fetchTableData(fechaInicio, fechaFin);
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
      pageSizeOptions={[5, 10, 100, 1000]}
      rowCount={rowsCount}
      disableRowSelectionOnClick
      // getRowHeight={() => 'auto'}
      rowHeight={80}
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
        // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
        // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '5px' },
      }}
    />
  );
};

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' }, pt: '2px' }}>
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
          quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
        />
      </Stack>
    </GridToolbarContainer>
  );
}

export default CotizacionesTabla;
