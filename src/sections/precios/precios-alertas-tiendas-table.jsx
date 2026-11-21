'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { varAlpha, stylesMode } from 'src/theme/styles';
import { getTablaAlertasTiendas } from 'src/actions/precios';

import { Label } from 'src/components/label';
import { penIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const PERCENT_PRESETS = [5, 10, 15, 20];
const AMOUNT_PRESETS = [100, 250, 500, 1000];

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

export function PreciosAlertasTiendasTable({ onOpenDetails, refreshTrigger = 0 }) {
  const [filters, setFilters] = useState({
    metric: 'percent', // 'percent' | 'amount' (mutuamente excluyente)
    threshold: '',
    direction: 'both', // 'both' | 'above' | 'below'
    marca: '',
    type: '',
    modelo: '',
  });
  const [debouncedFilters] = useDebounce(filters, 400);

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preciosAlertasTiendasPagination');
      return saved ? JSON.parse(saved) : { page: 0, pageSize: 5 };
    }
    return { page: 0, pageSize: 5 };
  });

  const [sortModel, setSortModel] = useState([{ field: 'max_diff', sort: 'desc' }]);

  const fetchIdRef = useRef(0);

  const parsedThreshold = Number(debouncedFilters.threshold);
  const hasValidThreshold =
    debouncedFilters.threshold !== '' && Number.isFinite(parsedThreshold) && parsedThreshold > 0;

  const hasAnyFilter =
    Boolean(filters.threshold) ||
    Boolean(filters.marca) ||
    Boolean(filters.type) ||
    Boolean(filters.modelo) ||
    filters.direction !== 'both';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preciosAlertasTiendasPagination', JSON.stringify(paginationModel));
    }
  }, [paginationModel]);

  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [debouncedFilters]);

  const fetchTableData = useCallback(async () => {
    const currentFetchId = fetchIdRef.current + 1;
    fetchIdRef.current = currentFetchId;

    if (!hasValidThreshold) {
      setRows([]);
      setRowsCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getTablaAlertasTiendas(paginationModel, {}, debouncedFilters, sortModel);
      if (currentFetchId !== fetchIdRef.current) return;

      if (data) {
        setRows(data.rows || []);
        setRowsCount(data.totalRows || 0);
      }
    } catch (error) {
      if (currentFetchId !== fetchIdRef.current) return;
      console.error('Error fetching alertas entre tiendas:', error);
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [hasValidThreshold, paginationModel, debouncedFilters, sortModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, refreshTrigger]);

  const handleMetricChange = (event, newMetric) => {
    if (!newMetric || newMetric === filters.metric) return;
    setFilters((prev) => ({
      ...prev,
      metric: newMetric,
      threshold: '',
    }));
  };

  const handleThresholdChange = (event) => {
    const { value } = event.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFilters((prev) => ({
        ...prev,
        threshold: value,
      }));
    }
  };

  const handleSelectPreset = (value) => {
    setFilters((prev) => ({
      ...prev,
      threshold: String(prev.threshold) === String(value) ? '' : String(value),
    }));
  };

  const handleDirectionChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      direction: event.target.value,
    }));
  };

  const handleReset = () => {
    setFilters((prev) => ({
      metric: prev.metric,
      threshold: '',
      direction: 'both',
      marca: '',
      type: '',
      modelo: '',
    }));
  };

  const presets = filters.metric === 'percent' ? PERCENT_PRESETS : AMOUNT_PRESETS;

  const columns = [
    {
      field: 'brand',
      headerName: 'Marca',
      minWidth: 130,
      flex: 0.75,
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
            target="_blank"
            rel="noopener noreferrer"
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
      minWidth: 130,
      flex: 0.85,
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
            target="_blank"
            rel="noopener noreferrer"
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
      minWidth: 150,
      flex: 0.95,
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
            target="_blank"
            rel="noopener noreferrer"
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
      width: 90,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
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
      field: 'current_price',
      headerName: 'Tienda Actual',
      minWidth: 130,
      flex: 0.75,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack spacing={0.2} sx={{ py: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'primary.dark',
              [stylesMode.dark]: { color: 'primary.light' },
            }}
          >
            {params.row.current_store_price_formatted}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              [stylesMode.dark]: { color: 'primary.lighter' },
              textTransform: 'capitalize',
              fontWeight: 600,
            }}
          >
            {params.row.current_store_name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'otras_tiendas',
      headerName: 'Otras Tiendas (Comparativa)',
      minWidth: 320,
      flex: 1.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const otrasTiendas = params.row.otras_tiendas || [];
        if (otrasTiendas.length === 0) {
          return (
            <Typography variant="caption" color="text.secondary">
              Sin otras tiendas
            </Typography>
          );
        }

        return (
          <Stack spacing={0.75} sx={{ py: 1.25, width: 1 }}>
            {otrasTiendas.map((store) => {
              let statusColor = 'default';
              let statusLabel = '';

              if (store.diff_status === 'above') {
                statusColor = 'error';
                statusLabel = `+${store.diff_percentage}% (+$${Math.abs(store.diff_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
              } else if (store.diff_status === 'below') {
                statusColor = 'success';
                statusLabel = `${store.diff_percentage}% (-$${Math.abs(store.diff_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
              } else if (store.diff_status === 'equal') {
                statusColor = 'info';
                statusLabel = '0% ($0.00)';
              }

              return (
                <Stack
                  key={store.store_id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={(th) => ({
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 1,
                    bgcolor: store.triggers_alert
                      ? varAlpha(th.vars.palette.warning.mainChannel, 0.14)
                      : varAlpha(th.vars.palette.grey['500Channel'], 0.08),
                    border: store.triggers_alert
                      ? `1px solid ${varAlpha(th.vars.palette.warning.mainChannel, 0.45)}`
                      : `1px solid ${varAlpha(th.vars.palette.grey['500Channel'], 0.16)}`,
                    [stylesMode.dark]: {
                      bgcolor: store.triggers_alert
                        ? varAlpha(th.vars.palette.warning.mainChannel, 0.18)
                        : varAlpha(th.vars.palette.grey['500Channel'], 0.12),
                      borderColor: store.triggers_alert
                        ? varAlpha(th.vars.palette.warning.mainChannel, 0.55)
                        : varAlpha(th.vars.palette.grey['500Channel'], 0.24),
                    },
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 0 }}>
                    {store.triggers_alert && (
                      <Tooltip title="Cumple el criterio de alerta" placement="top">
                        <span>
                          <Iconify
                            icon="solar:danger-triangle-bold"
                            width={15}
                            sx={{
                              color: 'warning.dark',
                              [stylesMode.dark]: { color: 'warning.light' },
                              verticalAlign: 'middle',
                              flexShrink: 0,
                            }}
                          />
                        </span>
                      </Tooltip>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: store.triggers_alert ? 700 : 600,
                        color: 'text.primary',
                        textTransform: 'capitalize',
                      }}
                    >
                      {store.store_name}:
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {store.current_price_formatted}
                    </Typography>
                    {statusLabel && (
                      <Label
                        variant={store.triggers_alert ? 'filled' : 'soft'}
                        color={statusColor}
                        sx={{ height: 20, fontSize: 11, px: 0.75 }}
                      >
                        {statusLabel}
                      </Label>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        );
      },
    },
    {
      field: 'max_diff',
      headerName: debouncedFilters.metric === 'percent' ? 'Máx. Dif. (%)' : 'Máx. Dif. ($)',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const displayValue =
          debouncedFilters.metric === 'percent'
            ? `${Number(params.row.max_diff_pct || 0).toFixed(1)}%`
            : `$${Number(params.row.max_diff_amount || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;

        return (
          <Label variant="soft" color="warning" sx={{ fontWeight: 700 }}>
            {displayValue}
          </Label>
        );
      },
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
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
                target="_blank"
                rel="noopener noreferrer"
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
    <Card sx={{ mt: 4, borderRadius: 2 }}>
      {/* Encabezado */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ px: 2.5, py: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={(th) => ({
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: varAlpha(th.vars.palette.warning.mainChannel, 0.16),
              color: 'warning.dark',
              [stylesMode.dark]: { color: 'warning.light' },
              flexShrink: 0,
            })}
          >
            <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
          </Box>

          <Stack spacing={0.25}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Alertas por Diferencia de Precios entre Tiendas
              </Typography>
              {hasValidThreshold && (
                <Label variant="soft" color={rowsCount > 0 ? 'warning' : 'default'}>
                  {rowsCount}
                </Label>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Detecta productos cuyo precio en la tienda actual difiera por porcentaje (%) o monto
              ($) respecto a cualquiera de tus otras tiendas.
            </Typography>
          </Stack>
        </Stack>

        {hasAnyFilter && (
          <Button
            size="small"
            color="error"
            variant="soft"
            onClick={handleReset}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            sx={{ flexShrink: 0 }}
          >
            Limpiar
          </Button>
        )}
      </Stack>

      <Divider />

      {/* Controles de criterio y filtros server-side */}
      <Stack spacing={2} sx={{ px: 2.5, py: 2, bgcolor: 'background.neutral' }}>
        {/* Fila 1: Selector excluyente (% vs $), valor numérico, dirección y accesos rápidos */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            color="primary"
            value={filters.metric}
            onChange={handleMetricChange}
            sx={{ bgcolor: 'background.paper', flexShrink: 0 }}
          >
            <ToggleButton value="percent" sx={{ px: 1.5, fontWeight: 600 }}>
              Porcentaje (%)
            </ToggleButton>
            <ToggleButton value="amount" sx={{ px: 1.5, fontWeight: 600 }}>
              Monto ($)
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            size="small"
            type="text"
            inputMode="decimal"
            placeholder={filters.metric === 'percent' ? 'Ej. 10' : 'Ej. 500'}
            value={filters.threshold}
            onChange={handleThresholdChange}
            sx={{ width: { xs: '100%', sm: 160 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment:
                filters.metric === 'amount' ? (
                  <InputAdornment position="start">
                    <Typography variant="subtitle2" color="text.secondary">
                      $
                    </Typography>
                  </InputAdornment>
                ) : null,
              endAdornment:
                filters.metric === 'percent' ? (
                  <InputAdornment position="end">
                    <Typography variant="subtitle2" color="text.secondary">
                      %
                    </Typography>
                  </InputAdornment>
                ) : null,
            }}
          />

          <TextField
            select
            size="small"
            value={filters.direction}
            onChange={handleDirectionChange}
            sx={{ minWidth: { sm: 230 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:sort-vertical-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="both">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:sort-vertical-bold-duotone" width={18} sx={{ color: 'warning.main' }} />
                <Typography variant="body2">Más alto o más bajo (±)</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="above">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:arrow-up-bold-duotone" width={18} sx={{ color: 'error.main' }} />
                <Typography variant="body2">Más alto que otra tienda (+)</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="below">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:arrow-down-bold-duotone" width={18} sx={{ color: 'success.main' }} />
                <Typography variant="body2">Más bajo que otra tienda (-)</Typography>
              </Stack>
            </MenuItem>
          </TextField>

          {/* Presets rápidos */}
          <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.25 }}>
              Rápido:
            </Typography>
            {presets.map((preset) => {
              const isSelected = String(filters.threshold) === String(preset);
              const label =
                filters.metric === 'percent' ? `${preset}%` : `$${preset.toLocaleString('en-US')}`;
              return (
                <Chip
                  key={preset}
                  size="small"
                  label={label}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  onClick={() => handleSelectPreset(preset)}
                  sx={{ fontWeight: 600, bgcolor: isSelected ? undefined : 'background.paper' }}
                />
              );
            })}
          </Stack>
        </Stack>

        {/* Fila 2: Filtros por marca, tipo y modelo */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={1.5}
        >
          <TextField
            size="small"
            placeholder="Filtrar por marca..."
            value={filters.marca}
            onChange={(e) => setFilters((prev) => ({ ...prev, marca: e.target.value }))}
            sx={{ minWidth: { sm: 170 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:tag-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            placeholder="Filtrar por tipo..."
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            sx={{ minWidth: { sm: 170 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:folder-with-files-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            placeholder="Filtrar por modelo..."
            value={filters.modelo}
            onChange={(e) => setFilters((prev) => ({ ...prev, modelo: e.target.value }))}
            sx={{ minWidth: { sm: 170 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:box-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <Divider />

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
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={rowsCount}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <EmptyContent
              title={
                hasValidThreshold
                  ? 'Sin alertas de diferencia de precios'
                  : 'Ingresa un porcentaje o monto para consultar alertas'
              }
              description={
                hasValidThreshold
                  ? 'No se encontraron productos que coincidan con el umbral y filtros seleccionados.'
                  : 'Selecciona Porcentaje (%) o Monto ($) e introduce una cantidad mayor a 0 (o elige una opción rápida).'
              }
              sx={{ py: 4 }}
            />
          ),
          noResultsOverlay: () => (
            <EmptyContent title="No se encontraron resultados" sx={{ py: 4 }} />
          ),
        }}
        sx={{
          minHeight: 340,
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
          },
          border: 'none',
        }}
      />
    </Card>
  );
}

PreciosAlertasTiendasTable.propTypes = {
  onOpenDetails: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number,
};
