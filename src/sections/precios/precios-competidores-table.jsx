'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import {
  exportarJson,
  getTablaCompetidores,
  eliminarCompetidorUrl,
} from 'src/actions/precios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PreciosImportDialog } from './precios-import-dialog';
import { PreciosCompetidorAddDialog } from './precios-competidor-add-dialog';

// ----------------------------------------------------------------------

export function PreciosCompetidoresTable({ filters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const [paginationModel, setPaginationModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosCompetidoresPagination');
      return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
    }
    return { page: 0, pageSize: 10 };
  });

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProductForAdd, setSelectedProductForAdd] = useState(null);

  const [openImportDialog, setOpenImportDialog] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosCompetidoresPagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTablaCompetidores(paginationModel, {}, filters);
      if (data) {
        setRows(data.rows || []);
        setRowsCount(data.totalRows || 0);
      }
    } catch (error) {
      console.error('Error fetching tabla competidores:', error);
      toast.error('Error al cargar la lista de competidores');
    } finally {
      setIsLoading(false);
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Manejar apertura de diálogo para agregar URL
  const handleOpenAddDialog = (product) => {
    setSelectedProductForAdd(product);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedProductForAdd(null);
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

  // Manejar exportación JSON de filas seleccionadas
  const handleExportJson = async () => {
    if (rowSelectionModel.length === 0) {
      toast.warning('Selecciona al menos un producto para exportar.');
      return;
    }

    try {
      // Intentar obtener los datos completos desde el servidor
      const res = await exportarJson(rowSelectionModel);
      let productsData = res?.products;

      // Fallback a los datos en memoria si la API devuelve vacío
      if (!productsData || productsData.length === 0) {
        const selectedRows = rows.filter((r) => rowSelectionModel.includes(r.id));
        productsData = selectedRows.map((r) => ({
          id: r.id,
          brand: r.brand,
          model: r.model,
          mpn: r.mpn,
          name: r.name,
          product_url: r.product_url,
        }));
      }

      const exportPayload = {
        products: productsData,
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `productos-competencia-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Se exportaron ${productsData.length} productos en JSON`);
    } catch (error) {
      console.error('Error exportando JSON:', error);
      toast.error('Error al generar la exportación JSON');
    }
  };

  const columns = [
    {
      field: 'nombre',
      headerName: 'Nombre (Tipo + Marca + Modelo)',
      minWidth: 260,
      flex: 1.2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const fullName = params.row.full_name || `${params.row.type} ${params.row.brand} ${params.row.model}`;
        return (
          <Stack spacing={0.3} sx={{ py: 1.5 }}>
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
            </Stack>
          </Stack>
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
          <Iconify icon="solar:eye-bold" width={16} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {Number(params.row.views || 0).toLocaleString()}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'urls',
      headerName: 'URLs de Competencia',
      minWidth: 420,
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const competitorUrls = params.row.competitor_urls || [];

        if (competitorUrls.length === 0) {
          return (
            <Label variant="soft" color="default" sx={{ my: 1.5 }}>
              Sin URLs registradas
            </Label>
          );
        }

        return (
          <Stack spacing={0.75} sx={{ py: 1.5, width: 1 }}>
            {competitorUrls.map((urlItem) => (
              <Stack
                key={urlItem.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 1,
                  bgcolor: urlItem.has_error ? 'error.lighter' : 'background.neutral',
                  border: (th) =>
                    `1px solid ${urlItem.has_error ? th.palette.error.light : th.palette.divider}`,
                }}
              >
                {/* Enlace y dominio */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
                  {/* Signo de alerta si tiene error registrado */}
                  {urlItem.has_error && (
                    <Tooltip
                      title={`Error registrado: ${urlItem.errors}`}
                      placement="top"
                      arrow
                    >
                      <span>
                        <Iconify
                          icon="solar:danger-triangle-bold"
                          width={18}
                          sx={{ color: 'error.main', flexShrink: 0, verticalAlign: 'middle' }}
                        />
                      </span>
                    </Tooltip>
                  )}

                  <Stack spacing={0} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: urlItem.has_error ? 'error.darker' : 'text.primary',
                      }}
                    >
                      {urlItem.domain || 'Competidor'}
                    </Typography>

                    <Link
                      href={urlItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      sx={{
                        color: urlItem.has_error ? 'error.dark' : 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                        maxWidth: { xs: 200, md: 320 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                      }}
                      title={urlItem.url}
                    >
                      {urlItem.url}
                    </Link>
                  </Stack>
                </Stack>

                {/* Precio o estado y botón eliminar */}
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                  {urlItem.price_formatted ? (
                    <Typography variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>
                      {urlItem.price_formatted}
                    </Typography>
                  ) : null}

                  <Tooltip title="Eliminar URL" placement="top">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUrl(urlItem)}
                      sx={{ p: 0.5 }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={16} />
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
      field: 'agregar',
      headerName: 'Agregar',
      width: 130,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          size="small"
          variant="soft"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleOpenAddDialog(params.row)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Agregar
        </Button>
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

      <PreciosImportDialog
        open={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onSuccess={fetchTableData}
      />

      <Card sx={{ borderRadius: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          checkboxSelection
          onRowSelectionModelChange={setRowSelectionModel}
          rowSelectionModel={rowSelectionModel}
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
            toolbar: CustomCompetidoresToolbar,
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
          slotProps={{
            toolbar: {
              selectedCount: rowSelectionModel.length,
              onExport: handleExportJson,
              onImport: () => setOpenImportDialog(true),
            },
          }}
          sx={{
            minHeight: 480,
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

PreciosCompetidoresTable.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
    soloSinCompetidores: PropTypes.bool,
  }).isRequired,
};

// ----------------------------------------------------------------------

function CustomCompetidoresToolbar({ selectedCount, onExport, onImport }) {
  return (
    <GridToolbarContainer sx={{ p: 1.5, gap: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" flex={1}>
        {/* Botón Exportar JSON */}
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:download-track-bold" />}
          onClick={onExport}
          disabled={selectedCount === 0}
        >
          Exportar JSON {selectedCount > 0 ? `(${selectedCount})` : ''}
        </Button>

        {/* Botón Importar JSON */}
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="solar:upload-track-bold" />}
          onClick={onImport}
        >
          Importar JSON
        </Button>
      </Stack>

      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
    </GridToolbarContainer>
  );
}

CustomCompetidoresToolbar.propTypes = {
  selectedCount: PropTypes.number,
  onExport: PropTypes.func,
  onImport: PropTypes.func,
};
