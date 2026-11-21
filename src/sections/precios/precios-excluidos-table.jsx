'use client';

import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { actualizarExcluidoProducto, getTablaCompetidoresExcluidos } from 'src/actions/precios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PreciosCompetidorCommentDialog } from './precios-competidor-comment-dialog';

// ----------------------------------------------------------------------

export function PreciosExcluidosTable({ filters, refreshTrigger = 0, onProductRestored }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [restoringId, setRestoringId] = useState(null);

  const [paginationModel, setPaginationModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosExcluidosPagination');
      return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
    }
    return { page: 0, pageSize: 5 };
  });

  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedProductForComment, setSelectedProductForComment] = useState(null);

  const fetchIdRef = useRef(0);

  const hasActiveFilters = Boolean(filters?.marca || filters?.type || filters?.modelo);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosExcluidosPagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [filters]);

  const fetchTableData = useCallback(async () => {
    const currentFetchId = fetchIdRef.current + 1;
    fetchIdRef.current = currentFetchId;
    setIsLoading(true);
    try {
      const data = await getTablaCompetidoresExcluidos(paginationModel, {}, filters);
      if (currentFetchId !== fetchIdRef.current) return;

      if (data) {
        const fetchedRows = data.rows || [];
        const total = data.totalRows || 0;

        if (fetchedRows.length === 0 && total > 0 && paginationModel.page > 0) {
          setPaginationModel((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }));
          return;
        }

        setRows(fetchedRows);
        setRowsCount(total);
      }
    } catch (error) {
      if (currentFetchId !== fetchIdRef.current) return;
      console.error('Error fetching tabla competidores excluidos:', error);
      toast.error('Error al cargar la lista de productos excluidos');
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, refreshTrigger]);

  const handleOpenCommentDialog = (product) => {
    setSelectedProductForComment(product);
    setOpenCommentDialog(true);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
    setSelectedProductForComment(null);
  };

  const handleRestoreProduct = async (product) => {
    setRestoringId(product.id);
    try {
      const res = await actualizarExcluidoProducto(product.id, false);
      if (res.success) {
        toast.success(res.message || 'Producto restaurado correctamente');
        fetchTableData();
        onProductRestored?.();
      } else {
        toast.error(res.message || 'Error al restaurar el producto');
      }
    } catch (error) {
      console.error('Error restaurando producto excluido:', error);
      toast.error('Ocurrió un error al restaurar el producto');
    } finally {
      setRestoringId(null);
    }
  };

  const columns = [
    {
      field: 'nombre',
      headerName: 'Nombre (Tipo + Marca + Modelo)',
      minWidth: 260,
      flex: 1.3,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const fullName =
          params.row.full_name || `${params.row.type} ${params.row.brand} ${params.row.model}`;
        const urlsCount = params.row.competitor_urls_count || 0;
        const urlsList = params.row.competitor_urls || [];

        return (
          <Stack spacing={0.4} sx={{ py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {fullName}
            </Typography>

            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
              {params.row.mpn && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  MPN: <strong>{params.row.mpn}</strong>
                </Typography>
              )}

              {params.row.product_url && (
                <Link
                  href={params.row.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.3,
                  }}
                >
                  Ver en tienda
                  <Iconify icon="solar:arrow-right-up-linear" width={12} />
                </Link>
              )}

              {urlsCount > 0 && (
                <Tooltip
                  title={
                    <Stack spacing={0.25}>
                      {urlsList.map((u) => (
                        <Typography key={u.id} variant="caption">
                          • {u.domain || u.url}
                        </Typography>
                      ))}
                    </Stack>
                  }
                  placement="top"
                  arrow
                >
                  <span>
                    <Label variant="soft" color="default" sx={{ height: 18, fontSize: 10 }}>
                      {urlsCount} {urlsCount === 1 ? 'URL guardada' : 'URLs guardadas'}
                    </Label>
                  </span>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'views',
      headerName: 'Vistas',
      width: 95,
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
      minWidth: 210,
      flex: 1.1,
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
      field: 'comments',
      headerName: 'Comentarios',
      minWidth: 260,
      flex: 1.4,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const comment = (params.row.comments || '').trim();

        if (!comment) {
          return (
            <Button
              size="small"
              variant="soft"
              color="inherit"
              startIcon={<Iconify icon="solar:chat-line-bold" width={15} />}
              onClick={() => handleOpenCommentDialog(params.row)}
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Agregar nota
            </Button>
          );
        }

        return (
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={0.5}
            sx={{ py: 1.5, width: 1 }}
          >
            <Tooltip
              title={
                <Box sx={{ whiteSpace: 'pre-wrap', maxWidth: 360 }}>
                  {comment}
                </Box>
              }
              placement="top"
              arrow
            >
              <Box
                onClick={() => handleOpenCommentDialog(params.row)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: 'background.neutral',
                  border: (th) => `1px solid ${th.palette.divider}`,
                  transition: (th) => th.transitions.create(['border-color', 'background-color']),
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.primary',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.45,
                  }}
                >
                  {comment}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Editar comentario" placement="top">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenCommentDialog(params.row)}
                sx={{ p: 0.5, mt: 0.25, flexShrink: 0 }}
              >
                <Iconify icon="solar:pen-bold" width={15} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 145,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Quitar exclusión y volver a mostrar en la tabla principal" placement="top">
          <span>
            <LoadingButton
              size="small"
              variant="soft"
              color="success"
              loading={restoringId === params.row.id}
              startIcon={<Iconify icon="solar:restart-bold" width={16} />}
              onClick={() => handleRestoreProduct(params.row)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Restaurar
            </LoadingButton>
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <PreciosCompetidorCommentDialog
        open={openCommentDialog}
        onClose={handleCloseCommentDialog}
        product={selectedProductForComment}
        onSuccess={fetchTableData}
      />

      <Card sx={{ mt: 4, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ px: 2.5, py: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'warning.lighter',
                color: 'warning.dark',
                flexShrink: 0,
              }}
            >
              <Iconify icon="solar:forbidden-circle-bold-duotone" width={24} />
            </Box>

            <Stack spacing={0.25}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Productos Excluidos
                </Typography>
                <Label variant="soft" color={rowsCount > 0 ? 'warning' : 'default'}>
                  {rowsCount}
                </Label>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Productos omitidos en la tabla principal de URLs de competencia. Puedes editar sus
                comentarios o restaurarlos cuando lo necesites.
              </Typography>
            </Stack>
          </Stack>

          {hasActiveFilters && (
            <Label variant="soft" color="info" sx={{ flexShrink: 0 }}>
              Filtrado por marca / tipo / modelo
            </Label>
          )}
        </Stack>

        <Divider />

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
                title={
                  hasActiveFilters
                    ? 'No se encontraron productos excluidos'
                    : 'Sin productos excluidos'
                }
                description={
                  hasActiveFilters
                    ? 'No hay productos excluidos que coincidan con los filtros aplicados.'
                    : 'Actualmente no hay productos marcados como excluidos.'
                }
                sx={{ py: 4 }}
              />
            ),
            noResultsOverlay: () => (
              <EmptyContent title="No se encontraron resultados" sx={{ py: 4 }} />
            ),
          }}
          sx={{
            minHeight: 320,
            [`& .${gridClasses.cell}`]: {
              alignItems: 'center',
              display: 'inline-flex',
              py: 1,
            },
            border: 'none',
          }}
        />
      </Card>
    </>
  );
}

PreciosExcluidosTable.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
  }).isRequired,
  refreshTrigger: PropTypes.number,
  onProductRestored: PropTypes.func,
};
