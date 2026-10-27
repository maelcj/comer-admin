'use client';

import Link from 'next/link';
import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import { esES } from '@mui/x-data-grid/locales';
import { Box, Stack, Tooltip, IconButton } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getTablaPedidos, finalizarPedido } from 'src/actions/pedidos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const PedidosTabla = forwardRef((props, ref) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });

  useImperativeHandle(ref, () => ({
    fetchTableData: () => fetchTableData(props.fechaInicio, props.fechaFin),
  }));

  const columns = [
    {
      field: 'id',
      headerName: '#',
      width: 80,
      minWidth: 80,
      flex: 0.5,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Link
          href={paths.dashboard.pedidos.edit(params.row.id)}
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
      headerName: 'detalles',
      minWidth: 180,
      flex: 1.5,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack sx={{ typography: 'body2', minWidth: 0, width: 1, py: 0.5 }}>
          <Link
            href={paths.dashboard.clientes.edit(params.row.clienteId)}
            style={{
              color: 'inherit',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Tooltip title={params.row.cliente || ''} placement="top-start" disableInteractive>
              <span>{params.row.cliente}</span>
            </Tooltip>
          </Link>
          <Box
            component="span"
            sx={{ color: 'text.disabled', typography: 'caption', whiteSpace: 'nowrap' }}
          >
            {params.row.created_at}
          </Box>
        </Stack>
      ),
    },
    {
      field: 'total',
      headerName: 'total',
      minWidth: 100,
      flex: 0.8,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'estado',
      headerName: 'estado',
      minWidth: 240,
      flex: 1.2,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const { row } = params;

        const handleFinalizarPedido = async (event) => {
          setIsLoading(true);
          event.stopPropagation(); // Evita que el click se propague al DataGrid
          event.preventDefault(); // Previene el comportamiento por defecto
          try {
            const res = await finalizarPedido(row.id);
            if (res.type === 'error') {
              toast.error(res.message);
            } else {
              toast.success(res.message);
              // Refrescar la tabla
              fetchTableData(props.fechaInicio, props.fechaFin);
            }
            setIsLoading(false);
          } catch (error) {
            toast.error('Error al finalizar el pedido');
            setIsLoading(false);
          }
        };

        const getTrackingUrl = (guia) => {
          // Si la paquetería tiene un enlace específico y es enlazable, usarlo
          if (guia.enlace && guia.enlazable) {
            return guia.enlace + guia.guia;
          }

          // URLs por defecto para paqueterías conocidas (fallback)
          const trackingUrls = {
            Fedex: `https://www.fedex.com/fedextrack/?trknbr=${guia.guia}`,
            Estafeta: `https://rastreo3.estafeta.com/RastreoWebInternet/consultaEnvio.do?dispatch=doConsultaEnvioInternet&amp;idioma=sp&amp;pais=mx&amp;numero=${guia.guia}`,
            'Paquete Express': `https://www.paquetexpress.com.mx/rastreo/?guia=${guia.guia}`,
            'Tres Guerras': `https://tresguerras.com.mx/rastreo/?tracking=${guia.guia}`,
            'ODM Express': `https://www.odmexpress.com/rastreo/?guia=${guia.guia}`,
          };
          return trackingUrls[guia.paqueteria] || '#';
        };

        return (
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ minWidth: 0, width: 1, flexWrap: 'nowrap' }}
          >
            {/* Mostrar el estado del pedido */}
            <Label
              variant="outlined"
              color="info"
              sx={{ flexShrink: 0, mr: 0.5, whiteSpace: 'nowrap' }}
            >
              {row.estadoNombre}
            </Label>

            {/* Botones de tracking de guías (solo para estado 5 - enviado) */}
            {row.guias &&
              row.guias.length > 0 &&
              row.guias.map((guia) => (
                <Tooltip key={guia.id} title={`Rastrear guía ${guia.guia} - ${guia.paqueteria}`}>
                  <IconButton
                    size="small"
                    color="info"
                    disableRipple
                    onMouseUp={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      window.open(getTrackingUrl(guia), '_blank');
                    }}
                    sx={{ flexShrink: 0, minWidth: 0, p: 0.5 }}
                  >
                    <Iconify icon="mdi:truck-delivery" width={16} />
                  </IconButton>
                </Tooltip>
              ))}

            {/* Botón para finalizar pedido (para estado 2 o superior, excepto 3) */}
            {row.estado >= 2 && row.estado !== 3 && (
              <Tooltip title="Finalizar pedido">
                <IconButton
                  size="small"
                  color="success"
                  disableRipple
                  onMouseUp={handleFinalizarPedido}
                  sx={{ flexShrink: 0, minWidth: 0, p: 0.5 }}
                >
                  <Iconify icon="mdi:check-circle" width={16} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  const fetchTableData = useCallback(
    async (fechaInicio, fechaFin) => {
      setIsLoading(true);
      const data = await getTablaPedidos(paginationModel, filterModel, fechaInicio, fechaFin);
      setRows(data.rows);
      setRowsCount(data.totalRows);
      setIsLoading(false);
    },
    [filterModel, paginationModel]
  );

  useEffect(() => {
    fetchTableData(props.fechaInicio, props.fechaFin);
  }, [fetchTableData, paginationModel, filterModel]);

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
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
        getRowHeight={() => 'auto'}
        sx={{
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '5px' },
        }}
      />
    </Box>
  );
});

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{ '.MuiInputBase-input': { py: '0.5rem !important' }, pt: '2px', px: 1 }}
    >
      <Stack
        spacing={1}
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ flexWrap: 'wrap', width: 1, py: 0.5 }}
      >
        <GridToolbarExport />
        <GridToolbarQuickFilter
          quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
          quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
        />
      </Stack>
    </GridToolbarContainer>
  );
}

export default PedidosTabla;
