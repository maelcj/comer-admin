'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { getTablaPrecios } from 'src/actions/precios';

import { Label } from 'src/components/label';
import { penIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const eyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
      clipRule="evenodd"
    />
  </svg>
);

// ----------------------------------------------------------------------

export function PreciosTable({ filters, onOpenDetails }) {
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

  const [sortModel, setSortModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosTableSort');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosTablePagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosTableSort', JSON.stringify(sortModel));
    }
  }, [sortModel]);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTablaPrecios(paginationModel, {}, filters, sortModel);
      if (data) {
        setRows(data.rows || []);
        setRowsCount(data.totalRows || 0);
      }
    } catch (error) {
      console.error('Error fetching table precios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paginationModel, filters, sortModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Reiniciar a la página 0 cuando cambian los filtros
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [filters]);

  const columns = [
    {
      field: 'brand',
      headerName: 'Marca',
      minWidth: 140,
      flex: 0.8,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const content = (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              textTransform: 'capitalize',
              ...(params.row.store_product_id && { cursor: 'pointer' }),
            }}
          >
            {params.row.brand}
          </Typography>
        );

        return params.row.store_product_id ? (
          <Link
            href={paths.dashboard.productos.edit(params.row.store_product_id)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {content}
          </Link>
        ) : (
          content
        );
      },
    },
    {
      field: 'type',
      headerName: 'Tipo',
      minWidth: 140,
      flex: 0.9,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const content = (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              ...(params.row.store_product_id && { cursor: 'pointer' }),
            }}
          >
            {params.row.type || '-'}
          </Typography>
        );

        return params.row.store_product_id ? (
          <Link
            href={paths.dashboard.productos.edit(params.row.store_product_id)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {content}
          </Link>
        ) : (
          content
        );
      },
    },
    {
      field: 'model',
      headerName: 'Modelo',
      minWidth: 160,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const content = (
          <Stack
            spacing={0.2}
            sx={{
              py: 1,
              ...(params.row.store_product_id && { cursor: 'pointer' }),
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.row.model}
            </Typography>
            {params.row.mpn && params.row.mpn !== params.row.model && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                MPN: {params.row.mpn}
              </Typography>
            )}
          </Stack>
        );

        return params.row.store_product_id ? (
          <Link
            href={paths.dashboard.productos.edit(params.row.store_product_id)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {content}
          </Link>
        ) : (
          content
        );
      },
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
          <Stack component="span" sx={{ color: 'text.disabled', display: 'inline-flex' }}>
            {eyeIcon}
          </Stack>
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
      type: 'actions',
      field: 'actions',
      headerName: 'Acciones',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          {params.row.store_product_id && (
            <Tooltip title="Editar producto" placement="top">
              <Link
                href={paths.dashboard.productos.edit(params.row.store_product_id)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <IconButton color="primary" size="small">
                  {penIcon}
                </IconButton>
              </Link>
            </Tooltip>
          )}

          <Tooltip title="Ver más detalles" placement="top">
            <IconButton color="info" size="small" onClick={() => onOpenDetails(params.row)}>
              {eyeIcon}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        loading={isLoading}
        filterMode="server"
        sortingMode="server"
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        initialState={{
          pagination: { paginationModel },
          density: 'compact',
          sorting: { sortModel },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={rowsCount}
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
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
          },
          height: '600px',
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
    comparativa: PropTypes.string,
  }).isRequired,
  onOpenDetails: PropTypes.func.isRequired,
};
