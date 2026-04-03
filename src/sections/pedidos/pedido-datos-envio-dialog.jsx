import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  CardContent,
  CardActions,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { getDatosEnvioCliente } from 'src/actions/pedidos';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PedidoDatosEnvioDialog({ open, onClose, pedidoId, onSelect }) {
  const [datosEnvio, setDatosEnvio] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && pedidoId) {
      fetchDatosEnvio();
    }
  }, [open, pedidoId]);

  const fetchDatosEnvio = async () => {
    setLoading(true);
    try {
      const data = await getDatosEnvioCliente(pedidoId);
      setDatosEnvio(data || []);
    } catch (error) {
      console.error('Error al cargar datos de envío:', error);
      setDatosEnvio([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDatos = (datos) => {
    onSelect(datos);
    onClose();
  };

  const formatearDireccion = (datos) => {
    const partes = [datos.calle, datos.colonia, datos.ciudad, datos.estado].filter(Boolean);
    return partes.join(', ');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="material-symbols:history" width={24} />
          <Typography variant="h6">Datos de Envío Anteriores</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : datosEnvio.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No se encontraron datos de envío anteriores para este cliente.
          </Alert>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona los datos de envío que deseas copiar al formulario actual:
            </Typography>

            <Stack spacing={2}>
              {datosEnvio.map((datos, index) => (
                <Card key={index} variant="outlined" sx={{ transition: 'all 0.2s' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          {datos.recibe}
                        </Typography>
                        {datos.empresa && (
                          <Typography variant="body2" color="text.secondary">
                            {datos.empresa}
                          </Typography>
                        )}
                      </Box>

                      <Typography variant="body2">
                        <Iconify icon="mdi:map-marker" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        {formatearDireccion(datos)}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {datos.telefono && (
                          <Chip
                            size="small"
                            label={`Tel: ${datos.telefono}`}
                            icon={<Iconify icon="mdi:phone" width={16} />}
                            variant="outlined"
                          />
                        )}
                        {datos.cp && (
                          <Chip
                            size="small"
                            label={`CP: ${datos.cp}`}
                            icon={<Iconify icon="mdi:mailbox" width={16} />}
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      {(datos.instrucciones || datos.comentarios) && (
                        <Box>
                          {datos.instrucciones && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              <strong>Instrucciones:</strong> {datos.instrucciones}
                            </Typography>
                          )}
                          {datos.comentarios && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              <strong>Comentarios:</strong> {datos.comentarios}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Iconify icon="mdi:content-copy" />}
                      onClick={() => handleSelectDatos(datos)}
                    >
                      Usar estos datos
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PedidoDatosEnvioDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedidoId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
