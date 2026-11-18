'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ToolTip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { buscarClientesFusion, getClientesDuplicados } from 'src/actions/clientes';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ClientesFusionDialog } from './clientes-fusion-dialog';

// ----------------------------------------------------------------------

function getRecommendedPrincipalId(clientes = []) {
  if (!clientes.length) return null;
  const sorted = [...clientes].sort((a, b) => {
    const scoreA = (a.pedidos?.length || 0) * 2 + (a.cotizaciones?.length || 0);
    const scoreB = (b.pedidos?.length || 0) * 2 + (b.cotizaciones?.length || 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.id - b.id;
  });
  return sorted[0].id;
}

export function ClientesDuplicadosSection({ onFusionCompletada }) {
  const [currentTab, setCurrentTab] = useState('duplicados');

  // Estado para duplicados automáticos por correo
  const [isLoadingDuplicados, setIsLoadingDuplicados] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const [searchDuplicados, setSearchDuplicados] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPrincipalByGroup, setSelectedPrincipalByGroup] = useState({});

  // Estado para fusión manual
  const [manualSearch, setManualSearch] = useState('');
  const [debouncedManualSearch] = useDebounce(manualSearch, 400);
  const [isSearchingManual, setIsSearchingManual] = useState(false);
  const [manualResults, setManualResults] = useState([]);
  const [clientesManuales, setClientesManuales] = useState([]);
  const [manualPrincipalId, setManualPrincipalId] = useState(null);

  // Estado para diálogo de confirmación de fusión
  const [fusionDialogState, setFusionDialogState] = useState({
    open: false,
    clientes: [],
    defaultPrincipalId: null,
    origin: null,
  });

  const fetchDuplicados = useCallback(async () => {
    setIsLoadingDuplicados(true);
    const data = await getClientesDuplicados();
    const listaGrupos = data?.grupos || [];
    setGrupos(listaGrupos);

    const defaults = {};
    listaGrupos.forEach((grupo) => {
      defaults[grupo.correo] = getRecommendedPrincipalId(grupo.clientes);
    });
    setSelectedPrincipalByGroup((prev) => ({ ...defaults, ...prev }));
    setIsLoadingDuplicados(false);
  }, []);

  useEffect(() => {
    fetchDuplicados();
  }, [fetchDuplicados]);

  // Búsqueda de clientes para fusión manual
  useEffect(() => {
    let active = true;

    async function buscar() {
      if (!debouncedManualSearch || debouncedManualSearch.trim().length < 2) {
        setManualResults([]);
        return;
      }
      setIsSearchingManual(true);
      const res = await buscarClientesFusion(debouncedManualSearch.trim());
      if (active) {
        setManualResults(Array.isArray(res) ? res : []);
        setIsSearchingManual(false);
      }
    }

    buscar();

    return () => {
      active = false;
    };
  }, [debouncedManualSearch]);

  // Filtrado de grupos de duplicados por correo
  const gruposFiltrados = useMemo(() => {
    const query = searchDuplicados.trim().toLowerCase();
    if (!query) return grupos;

    return grupos.filter(
      (grupo) =>
        grupo.correo.toLowerCase().includes(query) ||
        grupo.clientes.some(
          (c) =>
            (c.nombre && c.nombre.toLowerCase().includes(query)) ||
            (c.telefono && c.telefono.toLowerCase().includes(query)) ||
            (c.celular && c.celular.toLowerCase().includes(query)) ||
            String(c.id).includes(query)
        )
    );
  }, [grupos, searchDuplicados]);

  const gruposPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    return gruposFiltrados.slice(start, start + rowsPerPage);
  }, [gruposFiltrados, page, rowsPerPage]);

  const handleSelectPrincipalInGroup = (correoGrupo, clienteId) => {
    setSelectedPrincipalByGroup((prev) => ({
      ...prev,
      [correoGrupo]: clienteId,
    }));
  };

  const handleOpenFusionGrupo = (grupo) => {
    const principalId =
      selectedPrincipalByGroup[grupo.correo] || getRecommendedPrincipalId(grupo.clientes);

    setFusionDialogState({
      open: true,
      clientes: grupo.clientes,
      defaultPrincipalId: principalId,
      origin: 'duplicados',
    });
  };

  // Funciones para fusión manual
  const handleAddClienteManual = (cliente) => {
    if (clientesManuales.some((c) => c.id === cliente.id)) {
      toast.info('Este cliente ya está en la lista de fusión manual');
      return;
    }

    const nuevaLista = [...clientesManuales, cliente];
    setClientesManuales(nuevaLista);

    if (!manualPrincipalId) {
      setManualPrincipalId(cliente.id);
    }
  };

  const handleRemoveClienteManual = (id) => {
    const nuevaLista = clientesManuales.filter((c) => c.id !== id);
    setClientesManuales(nuevaLista);

    if (manualPrincipalId === id) {
      setManualPrincipalId(nuevaLista.length > 0 ? getRecommendedPrincipalId(nuevaLista) : null);
    }
  };

  const handleOpenFusionManual = () => {
    if (clientesManuales.length < 2) {
      toast.error('Selecciona al menos 2 clientes para fusionar');
      return;
    }

    setFusionDialogState({
      open: true,
      clientes: clientesManuales,
      defaultPrincipalId: manualPrincipalId || getRecommendedPrincipalId(clientesManuales),
      origin: 'manual',
    });
  };

  const handleFusionSuccess = () => {
    fetchDuplicados();

    if (fusionDialogState.origin === 'manual') {
      setClientesManuales([]);
      setManualPrincipalId(null);
      if (debouncedManualSearch && debouncedManualSearch.trim().length >= 2) {
        buscarClientesFusion(debouncedManualSearch.trim()).then((res) => {
          setManualResults(Array.isArray(res) ? res : []);
        });
      }
    }

    if (onFusionCompletada) {
      onFusionCompletada();
    }
  };

  return (
    <>
      <ClientesFusionDialog
        open={fusionDialogState.open}
        onClose={() => setFusionDialogState((prev) => ({ ...prev, open: false }))}
        clientes={fusionDialogState.clientes}
        defaultPrincipalId={fusionDialogState.defaultPrincipalId}
        onSuccess={handleFusionSuccess}
      />

      <Card sx={{ mt: 3, p: 0 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
              <Typography variant="h6">Clientes duplicados y fusión</Typography>
              <Label variant="soft" color={grupos.length > 0 ? 'warning' : 'success'}>
                {grupos.length} {grupos.length === 1 ? 'correo duplicado' : 'correos duplicados'}
              </Label>
            </Stack>
          }
          subheader="Identifica clientes con el mismo correo o busca registros manualmente para transferir sus pedidos y cotizaciones a un único cliente y eliminar el registro vacío."
          action={
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="soft"
                color="inherit"
                startIcon={<Iconify icon="solar:restart-bold" />}
                onClick={fetchDuplicados}
                disabled={isLoadingDuplicados}
              >
                Actualizar
              </Button>
              <Button
                size="small"
                variant={currentTab === 'manual' ? 'contained' : 'soft'}
                color="primary"
                startIcon={<Iconify icon="solar:users-group-two-rounded-bold-duotone" />}
                onClick={() => setCurrentTab(currentTab === 'manual' ? 'duplicados' : 'manual')}
              >
                {currentTab === 'manual' ? 'Ver duplicados por correo' : 'Fusión manual'}
              </Button>
            </Stack>
          }
          sx={{ pb: 2, pt: 2.5 }}
        />

        <Divider />

        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.background.neutral}`,
          }}
        >
          <Tab
            value="duplicados"
            icon={<Iconify icon="solar:letter-unread-bold-duotone" width={20} />}
            iconPosition="start"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Duplicados por correo</span>
                <Label variant="soft" color={grupos.length > 0 ? 'warning' : 'success'}>
                  {grupos.length}
                </Label>
              </Stack>
            }
          />
          <Tab
            value="manual"
            icon={<Iconify icon="solar:user-check-rounded-bold-duotone" width={20} />}
            iconPosition="start"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Fusión manual de clientes</span>
                {clientesManuales.length > 0 && (
                  <Label variant="filled" color="primary">
                    {clientesManuales.length}
                  </Label>
                )}
              </Stack>
            }
          />
        </Tabs>

        {/* PESTAÑA 1: DUPLICADOS POR CORREO */}
        {currentTab === 'duplicados' && (
          <Box sx={{ p: 2.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2.5 }}
            >
              <TextField
                size="small"
                placeholder="Filtrar duplicados por correo, nombre, teléfono o ID..."
                value={searchDuplicados}
                onChange={(e) => {
                  setSearchDuplicados(e.target.value);
                  setPage(0);
                }}
                sx={{ minWidth: { xs: '100%', sm: 380 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="material-symbols:search" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="body2" color="text.secondary">
                Selecciona el radio del cliente que deseas <strong>conservar</strong> y haz clic en{' '}
                <strong>Fusionar registros</strong>.
              </Typography>
            </Stack>

            {isLoadingDuplicados ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }} spacing={1.5}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Buscando clientes con correos duplicados...
                </Typography>
              </Stack>
            ) : gruposFiltrados.length === 0 ? (
              <EmptyContent
                title={
                  searchDuplicados
                    ? 'No se encontraron duplicados con ese criterio'
                    : 'No hay clientes con correo duplicado'
                }
                description={
                  searchDuplicados
                    ? 'Intenta con otro término de búsqueda.'
                    : 'Todos los registros de clientes tienen correos únicos actualmente.'
                }
                sx={{ py: 4 }}
              />
            ) : (
              <>
                <Stack spacing={2.5}>
                  {gruposPaginados.map((grupo) => {
                    const principalId =
                      selectedPrincipalByGroup[grupo.correo] ||
                      getRecommendedPrincipalId(grupo.clientes);

                    return (
                      <Paper
                        key={grupo.correo}
                        variant="outlined"
                        sx={{ overflow: 'hidden', borderRadius: 1.5 }}
                      >
                        {/* Cabecera del grupo de correo duplicado */}
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          justifyContent="space-between"
                          spacing={1.5}
                          sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: 'background.neutral',
                            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            <Iconify
                              icon="solar:letter-bold-duotone"
                              width={20}
                              sx={{ color: 'warning.main' }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {grupo.correo}
                            </Typography>
                            <Label variant="soft" color="warning">
                              {grupo.cantidad} registros
                            </Label>
                            <Label variant="soft" color="success">
                              {grupo.totalCotizaciones} cotizaciones
                            </Label>
                            <Label variant="soft" color="info">
                              {grupo.totalPedidos} pedidos
                            </Label>
                          </Stack>

                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<Iconify icon="solar:users-group-two-rounded-bold" />}
                            onClick={() => handleOpenFusionGrupo(grupo)}
                          >
                            Fusionar registros
                          </Button>
                        </Stack>

                        {/* Tabla de clientes dentro del grupo */}
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width={60} align="center">
                                  Principal
                                </TableCell>
                                <TableCell width={100}>ID / Fecha</TableCell>
                                <TableCell>Nombre / Empresa</TableCell>
                                <TableCell>Contacto / Ubicación</TableCell>
                                <TableCell>Cotizaciones</TableCell>
                                <TableCell>Pedidos</TableCell>
                                <TableCell width={150} align="right">
                                  Acción en fusión
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {grupo.clientes.map((cliente) => {
                                const isPrincipal = cliente.id === principalId;

                                return (
                                  <TableRow
                                    key={cliente.id}
                                    hover
                                    selected={isPrincipal}
                                    onClick={() =>
                                      handleSelectPrincipalInGroup(grupo.correo, cliente.id)
                                    }
                                    sx={{ cursor: 'pointer' }}
                                  >
                                    <TableCell align="center">
                                      <ToolTip title="Seleccionar como cliente principal (se conserva)">
                                        <Radio
                                          size="small"
                                          color="success"
                                          checked={isPrincipal}
                                          onChange={() =>
                                            handleSelectPrincipalInGroup(grupo.correo, cliente.id)
                                          }
                                        />
                                      </ToolTip>
                                    </TableCell>

                                    <TableCell>
                                      <Stack spacing={0.25}>
                                        <Typography variant="subtitle2">#{cliente.id}</Typography>
                                        {cliente.fechaRegistro && (
                                          <Typography variant="caption" color="text.secondary">
                                            {cliente.fechaRegistro}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>

                                    <TableCell>
                                      <Stack spacing={0.25}>
                                        <Link
                                          href={paths.dashboard.clientes.edit(cliente.id)}
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ color: 'inherit', fontWeight: 600 }}
                                        >
                                          {cliente.nombre || 'Sin nombre'}
                                        </Link>
                                        {cliente.empresa && (
                                          <Typography variant="caption" color="text.secondary">
                                            Empresa: {cliente.empresa}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>

                                    <TableCell>
                                      <Stack spacing={0.25}>
                                        <Typography variant="body2">{cliente.correo}</Typography>
                                        {(cliente.telefono || cliente.celular) && (
                                          <Typography variant="caption" color="text.secondary">
                                            Tel:{' '}
                                            {[cliente.telefono, cliente.celular]
                                              .filter(Boolean)
                                              .join(' / ')}
                                          </Typography>
                                        )}
                                        {(cliente.ciudad || cliente.estado) && (
                                          <Typography variant="caption" color="text.secondary">
                                            {[cliente.ciudad, cliente.estado]
                                              .filter(Boolean)
                                              .join(', ')}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>

                                    <TableCell>
                                      <Stack
                                        direction="row"
                                        spacing={0.5}
                                        useFlexGap
                                        flexWrap="wrap"
                                        sx={{ py: 0.5 }}
                                      >
                                        {cliente.cotizaciones?.length > 0 ? (
                                          cliente.cotizaciones.map((cotizacionId) => (
                                            <Link
                                              key={cotizacionId}
                                              href={paths.dashboard.cotizaciones.edit(cotizacionId)}
                                              onClick={(e) => e.stopPropagation()}
                                              style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                              <Label
                                                variant="outlined"
                                                color="success"
                                                sx={{ cursor: 'pointer' }}
                                              >
                                                {cotizacionId}
                                              </Label>
                                            </Link>
                                          ))
                                        ) : (
                                          <Typography variant="caption" color="text.disabled">
                                            Sin cotizaciones
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>

                                    <TableCell>
                                      <Stack
                                        direction="row"
                                        spacing={0.5}
                                        useFlexGap
                                        flexWrap="wrap"
                                        sx={{ py: 0.5 }}
                                      >
                                        {cliente.pedidos?.length > 0 ? (
                                          cliente.pedidos.map((pedidoId) => (
                                            <Link
                                              key={pedidoId}
                                              href={paths.dashboard.pedidos.edit(pedidoId)}
                                              onClick={(e) => e.stopPropagation()}
                                              style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                              <Label
                                                variant="outlined"
                                                color="info"
                                                sx={{ cursor: 'pointer' }}
                                              >
                                                {pedidoId}
                                              </Label>
                                            </Link>
                                          ))
                                        ) : (
                                          <Typography variant="caption" color="text.disabled">
                                            Sin pedidos
                                          </Typography>
                                        )}
                                      </Stack>
                                    </TableCell>

                                    <TableCell align="right">
                                      {isPrincipal ? (
                                        <Label variant="soft" color="success">
                                          Se conserva
                                        </Label>
                                      ) : (
                                        <Label variant="soft" color="error">
                                          Se fusiona y borra
                                        </Label>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    );
                  })}
                </Stack>

                <TablePagination
                  component="div"
                  count={gruposFiltrados.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Grupos por página:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </Box>
        )}

        {/* PESTAÑA 2: FUSIÓN MANUAL */}
        {currentTab === 'manual' && (
          <Box sx={{ p: 2.5 }}>
            <Alert severity="info" sx={{ mb: 2.5 }}>
              Busca y selecciona <strong>dos o más clientes</strong> (aunque tengan distinto correo)
              para fusionarlos. Podrás elegir cuál registro se conserva como principal; los pedidos
              y cotizaciones de los demás se transferirán a este y los registros vacíos se
              eliminarán.
            </Alert>

            {/* Buscador de clientes para agregar a la fusión manual */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                1. Buscar clientes para agregar a la fusión
              </Typography>

              <TextField
                fullWidth
                size="small"
                placeholder="Escribe nombre, correo, teléfono, empresa o #ID del cliente..."
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="material-symbols:search" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: isSearchingManual ? (
                    <InputAdornment position="end">
                      <CircularProgress size={18} />
                    </InputAdornment>
                  ) : null,
                }}
              />

              {manualResults.length > 0 && (
                <TableContainer sx={{ mt: 2, maxHeight: 280 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell width={80}>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>Teléfono</TableCell>
                        <TableCell>Cotizaciones</TableCell>
                        <TableCell>Pedidos</TableCell>
                        <TableCell align="right" width={130}>
                          Acción
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {manualResults.map((cliente) => {
                        const yaSeleccionado = clientesManuales.some((c) => c.id === cliente.id);

                        return (
                          <TableRow key={cliente.id} hover>
                            <TableCell>#{cliente.id}</TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{cliente.nombre}</Typography>
                              {cliente.empresa && (
                                <Typography variant="caption" color="text.secondary">
                                  {cliente.empresa}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{cliente.correo || '—'}</TableCell>
                            <TableCell>
                              {[cliente.telefono, cliente.celular].filter(Boolean).join(' / ') ||
                                '—'}
                            </TableCell>
                            <TableCell>
                              <Label variant="soft" color="success">
                                {cliente.cotizaciones?.length || 0}
                              </Label>
                            </TableCell>
                            <TableCell>
                              <Label variant="soft" color="info">
                                {cliente.pedidos?.length || 0}
                              </Label>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant={yaSeleccionado ? 'outlined' : 'soft'}
                                color={yaSeleccionado ? 'success' : 'primary'}
                                disabled={yaSeleccionado}
                                startIcon={
                                  <Iconify
                                    icon={
                                      yaSeleccionado
                                        ? 'solar:check-circle-bold'
                                        : 'solar:add-circle-bold'
                                    }
                                  />
                                }
                                onClick={() => handleAddClienteManual(cliente)}
                              >
                                {yaSeleccionado ? 'Agregado' : 'Seleccionar'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {debouncedManualSearch.trim().length >= 2 &&
                !isSearchingManual &&
                manualResults.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No se encontraron clientes con &ldquo;{debouncedManualSearch}&rdquo;.
                  </Typography>
                )}
            </Paper>

            {/* Lista de clientes seleccionados para fusión manual */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    2. Clientes seleccionados para fusionar ({clientesManuales.length})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Marca con el botón de radio cuál cliente se conservará como registro principal.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {clientesManuales.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        setClientesManuales([]);
                        setManualPrincipalId(null);
                      }}
                    >
                      Limpiar selección
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={clientesManuales.length < 2}
                    startIcon={<Iconify icon="solar:users-group-two-rounded-bold" />}
                    onClick={handleOpenFusionManual}
                  >
                    Fusionar clientes seleccionados
                  </Button>
                </Stack>
              </Stack>

              {clientesManuales.length === 0 ? (
                <EmptyContent
                  title="Sin clientes seleccionados"
                  description="Usa el buscador de arriba para agregar al menos 2 clientes que desees fusionar manualmente."
                  sx={{ py: 3 }}
                />
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'background.neutral' }}>
                        <TableCell width={60} align="center">
                          Principal
                        </TableCell>
                        <TableCell width={90}>ID / Fecha</TableCell>
                        <TableCell>Nombre / Empresa</TableCell>
                        <TableCell>Correo / Teléfono</TableCell>
                        <TableCell>Cotizaciones</TableCell>
                        <TableCell>Pedidos</TableCell>
                        <TableCell width={140}>Estado en fusión</TableCell>
                        <TableCell width={60} align="center">
                          Quitar
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientesManuales.map((cliente) => {
                        const isPrincipal = cliente.id === manualPrincipalId;

                        return (
                          <TableRow
                            key={cliente.id}
                            hover
                            selected={isPrincipal}
                            onClick={() => setManualPrincipalId(cliente.id)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell align="center">
                              <Radio
                                size="small"
                                color="success"
                                checked={isPrincipal}
                                onChange={() => setManualPrincipalId(cliente.id)}
                              />
                            </TableCell>

                            <TableCell>
                              <Stack spacing={0.25}>
                                <Typography variant="subtitle2">#{cliente.id}</Typography>
                                {cliente.fechaRegistro && (
                                  <Typography variant="caption" color="text.secondary">
                                    {cliente.fechaRegistro}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={0.25}>
                                <Link
                                  href={paths.dashboard.clientes.edit(cliente.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ color: 'inherit', fontWeight: 600 }}
                                >
                                  {cliente.nombre || 'Sin nombre'}
                                </Link>
                                {cliente.empresa && (
                                  <Typography variant="caption" color="text.secondary">
                                    {cliente.empresa}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack spacing={0.25}>
                                <Typography variant="body2">{cliente.correo || '—'}</Typography>
                                {(cliente.telefono || cliente.celular) && (
                                  <Typography variant="caption" color="text.secondary">
                                    {[cliente.telefono, cliente.celular]
                                      .filter(Boolean)
                                      .join(' / ')}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                                {cliente.cotizaciones?.length > 0 ? (
                                  cliente.cotizaciones.map((cotId) => (
                                    <Link
                                      key={cotId}
                                      href={paths.dashboard.cotizaciones.edit(cotId)}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                      <Label
                                        variant="outlined"
                                        color="success"
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        {cotId}
                                      </Label>
                                    </Link>
                                  ))
                                ) : (
                                  <Typography variant="caption" color="text.disabled">
                                    Sin cotizaciones
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                                {cliente.pedidos?.length > 0 ? (
                                  cliente.pedidos.map((pedId) => (
                                    <Link
                                      key={pedId}
                                      href={paths.dashboard.pedidos.edit(pedId)}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                      <Label
                                        variant="outlined"
                                        color="info"
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        {pedId}
                                      </Label>
                                    </Link>
                                  ))
                                ) : (
                                  <Typography variant="caption" color="text.disabled">
                                    Sin pedidos
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            <TableCell>
                              {isPrincipal ? (
                                <Label variant="soft" color="success">
                                  Se conserva
                                </Label>
                              ) : (
                                <Label variant="soft" color="error">
                                  Se fusiona y borra
                                </Label>
                              )}
                            </TableCell>

                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveClienteManual(cliente.id);
                                }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}
      </Card>
    </>
  );
}

ClientesDuplicadosSection.propTypes = {
  onFusionCompletada: PropTypes.func,
};
