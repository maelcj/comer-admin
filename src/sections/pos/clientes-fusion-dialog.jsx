'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';

import { fusionarClientes } from 'src/actions/clientes';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientesFusionDialog({
  open,
  onClose,
  clientes = [],
  defaultPrincipalId = null,
  onSuccess,
}) {
  const [principalId, setPrincipalId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && clientes.length > 0) {
      const allIds = clientes.map((c) => c.id);
      setSelectedIds(allIds);

      if (defaultPrincipalId && allIds.includes(defaultPrincipalId)) {
        setPrincipalId(defaultPrincipalId);
      } else {
        const sorted = [...clientes].sort((a, b) => {
          const scoreA = (a.pedidos?.length || 0) * 2 + (a.cotizaciones?.length || 0);
          const scoreB = (b.pedidos?.length || 0) * 2 + (b.cotizaciones?.length || 0);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return a.id - b.id;
        });
        setPrincipalId(sorted[0].id);
      }
    }
  }, [open, clientes, defaultPrincipalId]);

  const handleToggleInclude = (id) => {
    if (id === principalId) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectPrincipal = (id) => {
    setPrincipalId(id);
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clientePrincipal = useMemo(
    () => clientes.find((c) => c.id === principalId) || null,
    [clientes, principalId]
  );

  const clientesSecundarios = useMemo(
    () => clientes.filter((c) => selectedIds.includes(c.id) && c.id !== principalId),
    [clientes, selectedIds, principalId]
  );

  const resumen = useMemo(() => {
    if (!clientePrincipal) {
      return { pedidos: [], cotizaciones: [] };
    }
    const pedidosSet = new Set(clientePrincipal.pedidos || []);
    const cotizacionesSet = new Set(clientePrincipal.cotizaciones || []);

    clientesSecundarios.forEach((sec) => {
      (sec.pedidos || []).forEach((p) => pedidosSet.add(p));
      (sec.cotizaciones || []).forEach((cot) => cotizacionesSet.add(cot));
    });

    return {
      pedidos: Array.from(pedidosSet),
      cotizaciones: Array.from(cotizacionesSet),
    };
  }, [clientePrincipal, clientesSecundarios]);

  const handleConfirmFusion = async () => {
    if (!principalId || clientesSecundarios.length === 0) {
      toast.error('Selecciona el cliente principal y al menos un cliente a fusionar');
      return;
    }

    setIsSubmitting(true);
    const idsSecundarios = clientesSecundarios.map((c) => c.id);
    const res = await fusionarClientes(principalId, idsSecundarios);
    setIsSubmitting(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success('Clientes fusionados correctamente');
    if (onSuccess) {
      onSuccess(res.data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon="solar:users-group-two-rounded-bold-duotone"
            width={26}
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="h6">Fusionar registros de cliente</Typography>
        </Stack>
        <IconButton onClick={onClose} disabled={isSubmitting} size="small">
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Alert severity="info" sx={{ mb: 2.5 }}>
          Selecciona el <strong>registro principal</strong> que deseas conservar. Todos los{' '}
          <strong>pedidos y cotizaciones</strong> de los demás registros seleccionados se asignarán
          al cliente principal, y los registros secundarios que queden vacíos serán eliminados.
        </Alert>

        <Stack spacing={1.5}>
          {clientes.map((cliente) => {
            const isPrincipal = cliente.id === principalId;
            const isIncluded = selectedIds.includes(cliente.id);

            return (
              <Card
                key={cliente.id}
                variant="outlined"
                onClick={() => handleSelectPrincipal(cliente.id)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  borderColor: isPrincipal
                    ? 'success.main'
                    : isIncluded
                      ? 'error.light'
                      : 'divider',
                  bgcolor: isPrincipal
                    ? 'rgba(34, 197, 94, 0.06)'
                    : isIncluded
                      ? 'background.paper'
                      : 'background.neutral',
                  opacity: isIncluded ? 1 : 0.6,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Radio
                      checked={isPrincipal}
                      onChange={() => handleSelectPrincipal(cliente.id)}
                      color="success"
                      sx={{ mt: -0.5 }}
                    />

                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Label variant="soft" color="default">
                          #{cliente.id}
                        </Label>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {cliente.nombre || 'Sin nombre'}
                        </Typography>
                        {isPrincipal ? (
                          <Label variant="filled" color="success">
                            Se conservará (Principal)
                          </Label>
                        ) : isIncluded ? (
                          <Label variant="soft" color="error">
                            Se fusionará y eliminará
                          </Label>
                        ) : (
                          <Label variant="soft" color="default">
                            Omitido de la fusión
                          </Label>
                        )}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        sx={{ mt: 0.75, color: 'text.secondary' }}
                      >
                        <Typography variant="body2">
                          <strong>Correo:</strong> {cliente.correo || '—'}
                        </Typography>
                        {(cliente.telefono || cliente.celular) && (
                          <Typography variant="body2">
                            <strong>Tel:</strong>{' '}
                            {[cliente.telefono, cliente.celular].filter(Boolean).join(' / ')}
                          </Typography>
                        )}
                        {cliente.empresa && (
                          <Typography variant="body2">
                            <strong>Empresa:</strong> {cliente.empresa}
                          </Typography>
                        )}
                        {(cliente.ciudad || cliente.estado) && (
                          <Typography variant="body2">
                            <strong>Ubicación:</strong>{' '}
                            {[cliente.ciudad, cliente.estado].filter(Boolean).join(', ')}
                          </Typography>
                        )}
                        {cliente.fechaRegistro && (
                          <Typography variant="body2">
                            <strong>Registro:</strong> {cliente.fechaRegistro}
                          </Typography>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                          <Typography variant="caption" color="text.secondary">
                            Cotizaciones ({cliente.cotizaciones?.length || 0}):
                          </Typography>
                          {cliente.cotizaciones?.length > 0 ? (
                            cliente.cotizaciones.map((cotId) => (
                              <Link
                                key={cotId}
                                href={paths.dashboard.cotizaciones.edit(cotId)}
                                onClick={(e) => e.stopPropagation()}
                                style={{ textDecoration: 'none' }}
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
                              Ninguna
                            </Typography>
                          )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                          <Typography variant="caption" color="text.secondary">
                            Pedidos ({cliente.pedidos?.length || 0}):
                          </Typography>
                          {cliente.pedidos?.length > 0 ? (
                            cliente.pedidos.map((pedId) => (
                              <Link
                                key={pedId}
                                href={paths.dashboard.pedidos.edit(pedId)}
                                onClick={(e) => e.stopPropagation()}
                                style={{ textDecoration: 'none' }}
                              >
                                <Label variant="outlined" color="info" sx={{ cursor: 'pointer' }}>
                                  {pedId}
                                </Label>
                              </Link>
                            ))
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              Ninguno
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>

                  {clientes.length > 2 && !isPrincipal && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleInclude(cliente.id);
                      }}
                    >
                      <Checkbox checked={isIncluded} size="small" color="primary" />
                      <Typography variant="caption" color="text.secondary">
                        Incluir
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Stack>

        {clientePrincipal && (
          <>
            <Divider sx={{ my: 2.5 }} />

            <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Resumen tras la fusión
              </Typography>

              <Stack spacing={0.75}>
                <Typography variant="body2">
                  • <strong>Cliente que se conservará:</strong> #{clientePrincipal.id} -{' '}
                  {clientePrincipal.nombre} ({clientePrincipal.correo || 'Sin correo'})
                </Typography>
                <Typography variant="body2">
                  • <strong>Registros que se eliminarán ({clientesSecundarios.length}):</strong>{' '}
                  {clientesSecundarios.length > 0
                    ? clientesSecundarios.map((c) => `#${c.id} (${c.nombre})`).join(', ')
                    : 'Ninguno seleccionado'}
                </Typography>
                <Typography variant="body2">
                  • <strong>Total de cotizaciones concentradas:</strong>{' '}
                  {resumen.cotizaciones.length}{' '}
                  {resumen.cotizaciones.length > 0 && `(#${resumen.cotizaciones.join(', #')})`}
                </Typography>
                <Typography variant="body2">
                  • <strong>Total de pedidos concentrados:</strong> {resumen.pedidos.length}{' '}
                  {resumen.pedidos.length > 0 && `(#${resumen.pedidos.join(', #')})`}
                </Typography>
              </Stack>
            </Card>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={isSubmitting}>
          Cancelar
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!clientePrincipal || clientesSecundarios.length === 0}
          startIcon={<Iconify icon="solar:check-circle-bold" />}
          onClick={handleConfirmFusion}
        >
          Confirmar fusión ({clientesSecundarios.length + 1} registros en 1)
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

ClientesFusionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      correo: PropTypes.string,
      telefono: PropTypes.string,
      celular: PropTypes.string,
      empresa: PropTypes.string,
      ciudad: PropTypes.string,
      estado: PropTypes.string,
      fechaRegistro: PropTypes.string,
      cotizaciones: PropTypes.arrayOf(PropTypes.number),
      pedidos: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  defaultPrincipalId: PropTypes.number,
  onSuccess: PropTypes.func,
};
