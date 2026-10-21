'use client';

import PropTypes from 'prop-types';
import * as NProgress from 'nprogress';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { getTablaPrecios } from 'src/actions/precios';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function PreciosTable({ filters, onOpenDetails }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosTablePagination');
      return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
    }
    return { page: 0, pageSize: 10 };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosTablePagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  const handleEditRow = (storeProductId) => {
    if (storeProductId) {
      NProgress.start();
      router.push(paths.dashboard.productos.edit(storeProductId));
    }
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTablaPrecios(paginationModel, {}, filters);
      if (data) {
        setRows(data.rows || []);
        setRowsCount(data.totalRows || 0);
      }
    } catch (error) {
      console.error('Error fetching table precios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const columns = [
    {
      field: 'brand',
      headerName: 'Marca',
      minWidth: 140,
      flex: 0.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
          {params.row.brand}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Tipo',
      minWidth: 140,
      flex: 0.9,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.row.type || '-'}
        </Typography>
      ),
    },
    {
      field: 'model',
      headerName: 'Modelo',
      minWidth: 160,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack spacing={0.2} sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.model}
          </Typography>
          {params.row.mpn && params.row.mpn !== params.row.model && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              MPN: {params.row.mpn}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: 'views',
      headerName: 'Vistas',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
          <Iconify icon="solar:eye-bold" width={16} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {Number(params.row.views || 0).toLocaleString()}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'precios_tiendas',
      headerName: 'Precios',
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const tiendas = params.row.precios_tiendas || [];
        if (tiendas.length === 0) {
          return (
            <Typography variant="caption" color="text.secondary">
              Sin precios
            </Typography>
          );
        }

        return (
          <Stack spacing={0.5} sx={{ py: 1.5, width: 1 }}>
            {tiendas.map((store) => (
              <Stack
                key={store.store_id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: store.is_current_store ? 700 : 500,
                      color: store.is_current_store ? 'primary.main' : 'text.secondary',
                      textTransform: 'capitalize',
                    }}
                  >
                    {store.store_name}:
                  </Typography>
                  {store.is_current_store && (
                    <Label
                      variant="filled"
                      color="primary"
                      sx={{ height: 16, fontSize: 9, px: 0.5 }}
                    >
                      Actual
                    </Label>
                  )}
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: store.is_current_store ? 700 : 600,
                    color: store.is_current_store ? 'primary.dark' : 'text.primary',
                  }}
                >
                  {store.current_price_formatted}
                </Typography>
              </Stack>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'competidores',
      headerName: 'Competencia',
      minWidth: 320,
      flex: 1.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const competidores = params.row.competidores || [];
        if (competidores.length === 0) {
          return (
            <Label variant="soft" color="default" sx={{ my: 1 }}>
              Sin competencia registrada
            </Label>
          );
        }

        return (
          <Stack spacing={0.75} sx={{ py: 1.5, width: 1 }}>
            {competidores.map((comp) => {
              let statusColor = 'default';
              let statusLabel = '';

              if (comp.diff_status === 'above') {
                statusColor = 'error';
                statusLabel = `+${comp.diff_percentage}% (+$${Math.abs(comp.diff_amount).toFixed(2)})`;
              } else if (comp.diff_status === 'below') {
                statusColor = 'success';
                statusLabel = `${comp.diff_percentage}% (-$${Math.abs(comp.diff_amount).toFixed(2)})`;
              } else if (comp.diff_status === 'equal') {
                statusColor = 'info';
                statusLabel = '0% ($0.00)';
              }

              return (
                <Stack
                  key={comp.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      maxWidth: 130,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={comp.domain}
                  >
                    {comp.domain || 'Competidor'}:
                  </Typography>

                  {comp.price_formatted ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {comp.price_formatted}
                      </Typography>
                      {statusLabel && (
                        <Label
                          variant="soft"
                          color={statusColor}
                          sx={{ height: 18, fontSize: 10, px: 0.75 }}
                        >
                          {statusLabel}
                        </Label>
                      )}
                    </Stack>
                  ) : (
                    <Label
                      variant="soft"
                      color="warning"
                      sx={{ height: 18, fontSize: 10, px: 0.75 }}
                    >
                      Sin precio
                    </Label>
                  )}
                </Stack>
              );
            })}
          </Stack>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: 1 }}>
          <Tooltip title="Editar producto" placement="top">
            <span>
              <IconButton
                color="primary"
                size="small"
                disabled={!params.row.store_product_id}
                onClick={() => handleEditRow(params.row.store_product_id)}
              >
                <Iconify icon="solar:pen-bold" width={18} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Ver más detalles" placement="top">
            <IconButton
              color="info"
              size="small"
              onClick={() => onOpenDetails(params.row)}
            >
              <Iconify icon="solar:eye-bold-duotone" width={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Card sx={{ borderRadius: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        loading={isLoading}
        filterMode="server"
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={rowsCount}
        paginationModel={paginationModel}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <EmptyContent
              title="No se encontraron productos"
              description="No hay productos que coincidan con los filtros aplicados."
              sx={{ py: 5 }}
            />
          ),
          noResultsOverlay: () => (
            <EmptyContent title="No se encontraron resultados" sx={{ py: 5 }} />
          ),
        }}
        sx={{
          minHeight: 450,
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
            py: 1,
          },
          border: 'none',
        }}
      />
    </Card>
  );
}

PreciosTable.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
    soloConCompetidores: PropTypes.bool,
  }).isRequired,
  onOpenDetails: PropTypes.func.isRequired,
};
