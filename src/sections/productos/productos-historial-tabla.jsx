'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { getHistorialProductos } from 'src/actions/auditorias';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function ProductosHistorialTabla() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const columns = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        // Convertir fecha a formato d-m-y h:m:s
        const fecha = new Date(params.row.fecha);
        const day = fecha.getDate().toString().padStart(2, '0');
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const year = fecha.getFullYear();
        const hours = fecha.getHours().toString().padStart(2, '0');
        const minutes = fecha.getMinutes().toString().padStart(2, '0');
        const seconds = fecha.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

        return (
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            {formattedDate}
          </Typography>
        );
      },
    },
    {
      field: 'producto_mpn',
      headerName: 'MPN',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'usuario',
      headerName: 'Usuario',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'campos_cambiados',
      headerName: 'Cambios',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 350,
      flex: 3,
      renderCell: (params) => {
        const campos = params.row.campos_cambiados || [];

        if (params.row.evento === 'created') {
          return (
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              Producto creado
            </Typography>
          );
        }

        if (params.row.evento === 'deleted') {
          return (
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              Producto eliminado
            </Typography>
          );
        }

        if (campos.length === 0) {
          return (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sin cambios detectados
            </Typography>
          );
        }

        const cambiosDetallados = campos.map((campo) => {
          const valorAnterior = campo.old_value_formatted || campo.old_value || 'Sin valor';
          const valorNuevo = campo.new_value_formatted || campo.new_value || 'Sin valor';
          return `${campo.field_label}: "${valorAnterior}" → "${valorNuevo}"`;
        });

        const tooltipText = cambiosDetallados.join('\n');
        const displayText =
          campos.length === 1
            ? cambiosDetallados[0]
            : `Modificó ${campos.length} campos: ${campos.map((c) => c.field_label).join(', ')}`;

        return (
          <Tooltip title={tooltipText} placement="top">
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {displayText}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getHistorialProductos(paginationModel, debounceFilterModel);
      setRows(data.rows);
      setRowsCount(data.totalRows);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRows([]);
      setRowsCount(0);
    }
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
      pageSizeOptions={[5, 10, 25, 50]}
      rowCount={rowsCount}
      disableRowSelectionOnClick
      autoHeight
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '5px' },
        minHeight: 400,
      }}
    />
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <GridToolbarQuickFilter placeholder="Buscar..." />
      </Stack>
    </GridToolbarContainer>
  );
}
