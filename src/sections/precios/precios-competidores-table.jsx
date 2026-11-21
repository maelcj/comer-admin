'use client';

import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { getTablaCompetidores, eliminarCompetidorUrl } from 'src/actions/precios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PreciosCompetidorAddDialog } from './precios-competidor-add-dialog';
import { PreciosCompetidorCommentDialog } from './precios-competidor-comment-dialog';
import { PreciosCompetidorExcludeDialog } from './precios-competidor-exclude-dialog';

// ----------------------------------------------------------------------

export function PreciosCompetidoresTable({ filters, refreshTrigger = 0, onProductExcluded }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosCompetidoresPagination');
      return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
    }
    return { page: 0, pageSize: 5 };
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProductForAdd, setSelectedProductForAdd] = useState(null);

  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [selectedProductForComment, setSelectedProductForComment] = useState(null);

  const [openExcludeDialog, setOpenExcludeDialog] = useState(false);
  const [selectedProductForExclude, setSelectedProductForExclude] = useState(null);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosCompetidoresPagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  // Reiniciar a la página 0 cuando cambian los filtros
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [filters]);

  const fetchTableData = useCallback(async () => {
    const currentFetchId = fetchIdRef.current + 1;
    fetchIdRef.current = currentFetchId;
    setIsLoading(true);
    try {
      const data = await getTablaCompetidores(paginationModel, {}, filters);
      if (currentFetchId !== fetchIdRef.current) return;

      if (data) {
        const fetchedRows = data.rows || [];
        const total = data.totalRows || 0;

        // Si se excluyó el último registro de una página > 0, retroceder de página
        if (fetchedRows.length === 0 && total > 0 && paginationModel.page > 0) {
          setPaginationModel((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }));
          return;
        }

        setRows(fetchedRows);
        setRowsCount(total);
      }
    } catch (error) {
      if (currentFetchId !== fetchIdRef.current) return;
      console.error('Error fetching tabla competidores:', error);
      toast.error('Error al cargar la lista de competidores');
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, refreshTrigger]);

  // Manejar apertura de diálogo para agregar URL
  const handleOpenAddDialog = (product) => {
    setSelectedProductForAdd(product);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedProductForAdd(null);
  };

  // Manejar apertura de diálogo de comentarios
  const handleOpenCommentDialog = (product) => {
    setSelectedProductForComment(product);
    setOpenCommentDialog(true);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
    setSelectedProductForComment(null);
  };

  // Manejar apertura de diálogo de exclusión
  const handleOpenExcludeDialog = (product) => {
    setSelectedProductForExclude(product);
    setOpenExcludeDialog(true);
  };

  const handleCloseExcludeDialog = () => {
    setOpenExcludeDialog(false);
    setSelectedProductForExclude(null);
  };

  const handleExcludeSuccess = () => {
    fetchTableData();
    onProductExcluded?.();
  };

  // Manejar eliminación de una URL de competidor
  const handleDeleteUrl = async (urlItem) => {
    const confirmed = window.confirm(`¿Deseas eliminar la URL de competencia?\n\n${urlItem.url}`);
    if (!confirmed) return;

    try {
      const res = await eliminarCompetidorUrl(urlItem.id);
      if (res.success) {
        toast.success(res.message || 'URL eliminada correctamente');
        fetchTableData();
      } else {
        toast.error(res.message || 'Error al eliminar la URL');
      }
    } catch (error) {
      console.error('Error eliminando URL de competidor:', error);
      toast.error('Ocurrió un error al eliminar la URL');
    }
  };

  const columns = [
    {
      field: 'nombre',
      headerName: 'Nombre (Tipo + Marca + Modelo)',
      minWidth: 230,
      flex: 1.5,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const fullName =
          params.row.full_name || `${params.row.type} ${params.row.brand} ${params.row.model}`;
        return (
          <Stack
            spacing={0.5}
            sx={{
              py: 1,
              width: 1,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.35,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {fullName}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              {params.row.mpn && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  MPN: <strong>{params.row.mpn}</strong>
                </Typography>
              )}

              <Tooltip title="Vistas del producto" placement="top">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.35}
                  sx={{ color: 'text.secondary' }}
                >
                  <Iconify icon="solar:eye-bold" width={13} sx={{ color: 'text.disabled' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {Number(params.row.views || 0).toLocaleString()}
                  </Typography>
                </Stack>
              </Tooltip>

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
                    gap: 0.25,
                  }}
                >
                  Tienda
                  <Iconify icon="solar:arrow-right-up-linear" width={12} />
                </Link>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'precios_tiendas',
      headerName: 'Precios',
      minWidth: 150,
      flex: 0.8,
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
          <Stack spacing={0.4} sx={{ py: 1, width: 1 }}>
            {tiendas.map((store) => (
              <Stack
                key={store.store_id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.75}
              >
                <Tooltip
                  title={store.is_current_store ? `${store.store_name} (Tienda actual)` : store.store_name}
                  placement="top"
                >
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      fontWeight: store.is_current_store ? 700 : 500,
                      color: store.is_current_store ? 'primary.main' : 'text.secondary',
                      textTransform: 'capitalize',
                      minWidth: 0,
                    }}
                  >
                    {store.store_name}:
                  </Typography>
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: store.is_current_store ? 700 : 600,
                    color: store.is_current_store ? 'primary.dark' : 'text.primary',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
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
      field: 'urls',
      headerName: 'URLs de Competencia',
      minWidth: 215,
      flex: 1.25,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const competitorUrls = params.row.competitor_urls || [];

        if (competitorUrls.length === 0) {
          return (
            <Label variant="soft" color="default" sx={{ my: 1 }}>
              Sin URLs
            </Label>
          );
        }

        return (
          <Stack spacing={0.6} sx={{ py: 1, width: 1 }}>
            {competitorUrls.map((urlItem) => (
              <Stack
                key={urlItem.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.75}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: urlItem.has_error ? 'error.lighter' : 'background.neutral',
                  border: (th) =>
                    `1px solid ${urlItem.has_error ? th.palette.error.light : th.palette.divider}`,
                }}
              >
                {/* Dominio clickeable con tooltip de URL completa */}
                <Stack direction="row" alignItems="center" spacing={0.6} sx={{ minWidth: 0, flex: 1 }}>
                  {urlItem.has_error && (
                    <Tooltip
                      title={`Error registrado: ${urlItem.errors}`}
                      placement="top"
                      arrow
                    >
                      <span>
                        <Iconify
                          icon="solar:danger-triangle-bold"
                          width={16}
                          sx={{ color: 'error.main', flexShrink: 0, verticalAlign: 'middle' }}
                        />
                      </span>
                    </Tooltip>
                  )}

                  <Tooltip title={urlItem.url} placement="top" arrow>
                    <Link
                      href={urlItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: urlItem.has_error ? 'error.dark' : 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        display: 'block',
                      }}
                    >
                      {urlItem.domain || urlItem.url}
                    </Link>
                  </Tooltip>
                </Stack>

                {/* Precio y botón eliminar */}
                <Stack direction="row" alignItems="center" spacing={0.35} sx={{ flexShrink: 0 }}>
                  {urlItem.price_formatted ? (
                    <Typography variant="caption" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {urlItem.price_formatted}
                    </Typography>
                  ) : null}

                  <Tooltip title="Eliminar URL" placement="top">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUrl(urlItem)}
                      sx={{ p: 0.35 }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={15} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'comments',
      headerName: 'Comentarios',
      minWidth: 145,
      flex: 0.9,
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
              startIcon={<Iconify icon="solar:chat-line-bold" width={14} />}
              onClick={() => handleOpenCommentDialog(params.row)}
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.75rem',
                px: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Nota
            </Button>
          );
        }

        return (
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={0.25}
            sx={{ py: 1, width: 1 }}
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
                  px: 1,
                  py: 0.6,
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
                    lineHeight: 1.35,
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
                sx={{ p: 0.35, mt: 0.25, flexShrink: 0 }}
              >
                <Iconify icon="solar:pen-bold" width={14} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 105,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack spacing={0.6} sx={{ py: 0.75, width: 1 }}>
          <Tooltip title="Agregar URL de competencia" placement="left">
            <Button
              size="small"
              variant="soft"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" width={15} />}
              onClick={() => handleOpenAddDialog(params.row)}
              sx={{
                px: 1,
                py: 0.35,
                minWidth: 0,
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              URL
            </Button>
          </Tooltip>

          <Tooltip title="Marcar producto como excluido" placement="left">
            <Button
              size="small"
              variant="soft"
              color="warning"
              startIcon={<Iconify icon="solar:forbidden-circle-bold" width={14} />}
              onClick={() => handleOpenExcludeDialog(params.row)}
              sx={{
                px: 1,
                py: 0.35,
                minWidth: 0,
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              Excluir
            </Button>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <PreciosCompetidorAddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        product={selectedProductForAdd}
        onSuccess={fetchTableData}
      />

      <PreciosCompetidorCommentDialog
        open={openCommentDialog}
        onClose={handleCloseCommentDialog}
        product={selectedProductForComment}
        onSuccess={fetchTableData}
      />

      <PreciosCompetidorExcludeDialog
        open={openExcludeDialog}
        onClose={handleCloseExcludeDialog}
        product={selectedProductForExclude}
        onSuccess={handleExcludeSuccess}
      />

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
            minHeight: 480,
            [`& .${gridClasses.cell}`]: {
              alignItems: 'center',
              display: 'inline-flex',
              py: 0.75,
              px: 1,
              lineHeight: 'normal',
            },
            [`& .${gridClasses.columnHeader}`]: {
              px: 1,
            },
            border: 'none',
          }}
        />
      </Card>
    </>
  );
}

PreciosCompetidoresTable.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
    soloSinCompetidores: PropTypes.bool,
  }).isRequired,
  refreshTrigger: PropTypes.number,
  onProductExcluded: PropTypes.func,
};
