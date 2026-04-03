import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Stack,
  Button,
  Dialog,
  Typography,
  CardActions,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { getDatosFacturacionCliente } from 'src/actions/pedidos';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Mapeo de valores para mostrar etiquetas legibles
const REGIMEN_FISCAL_MAP = {
  601: 'General de Ley Personas Morales',
  603: 'Personas Morales con Fines no Lucrativos',
  605: 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
  606: 'Arrendamiento',
  607: 'Régimen de Enajenación o Adquisición de Bienes',
  608: 'Demás ingresos',
  609: 'Consolidación',
  610: 'Residentes en el Extranjero sin Establecimiento Permanente en México',
  611: 'Ingresos por Dividendos (socios y accionistas)',
  612: 'Personas Físicas con Actividades Empresariales y Profesionales',
  614: 'Ingresos por intereses',
  615: 'Régimen de los ingresos por obtención de premios',
  616: 'Sin obligaciones fiscales',
  620: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
  621: 'Incorporación Fiscal',
  622: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
  623: 'Opcional para Grupos de Sociedades',
  624: 'Coordinados',
  625: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
  626: 'Régimen Simplificado de Confianza',
};

const METODO_PAGO_MAP = {
  pue: 'PUE - Pago en una sola exhibición',
  pip: 'PIP - Pago inicial y parcialidades',
  ppd: 'PPD - Pago en parcialidades o diferido',
};

const FORMA_PAGO_MAP = {
  '01': '01 - Efectivo',
  '02': '02 - Cheque nominativo',
  '03': '03 - Transferencia electrónica de fondos',
  '04': '04 - Tarjeta de crédito',
  '05': '05 - Monedero electrónico',
  '06': '06 - Dinero electrónico',
  '08': '08 - Vales de despensa',
  12: '12 - Dación en pago',
  13: '13 - Pago por subrogación',
  14: '14 - Pago por consignación',
  15: '15 - Condonación',
  17: '17 - Compensación',
  23: '23 - Novación',
  24: '24 - Confusión',
  25: '25 - Remisión de deuda',
  26: '26 - Prescripción o caducidad',
  27: '27 - A satisfacción del acreedor',
  28: '28 - Tarjeta de débito',
  29: '29 - Tarjeta de servicios',
  30: '30 - Aplicación de anticipos',
  99: '99 - Por definir',
};

const TIPO_PERSONA_MAP = {
  general: 'Público en general',
  moral: 'Persona moral',
  fisica: 'Persona física',
};

export function PedidoDatosFacturacionDialog({ open, onClose, pedidoId, onSelect }) {
  const [datosFacturacion, setDatosFacturacion] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && pedidoId) {
      fetchDatosFacturacion();
    }
  }, [open, pedidoId]);

  const fetchDatosFacturacion = async () => {
    setLoading(true);
    try {
      const data = await getDatosFacturacionCliente(pedidoId);
      setDatosFacturacion(data || []);
    } catch (error) {
      console.error('Error al cargar datos de facturación:', error);
      setDatosFacturacion([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDatos = (datos) => {
    onSelect(datos);
    onClose();
  };

  const getRegimenLabel = (regimen) => REGIMEN_FISCAL_MAP[regimen] || regimen;
  const getMetodoPagoLabel = (metodo) => METODO_PAGO_MAP[metodo] || metodo;
  const getFormaPagoLabel = (forma) => FORMA_PAGO_MAP[forma] || forma;
  const getTipoPersonaLabel = (tipo) => TIPO_PERSONA_MAP[tipo] || tipo;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="material-symbols:history" width={24} />
          <Typography variant="h6">Datos de Facturación Anteriores</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : datosFacturacion.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No se encontraron datos de facturación anteriores para este cliente.
          </Alert>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona los datos de facturación que deseas copiar al formulario actual:
            </Typography>

            <Stack spacing={2}>
              {datosFacturacion.map((datos, index) => (
                <Card key={index} variant="outlined" sx={{ transition: 'all 0.2s' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          {datos.razon || 'Sin razón social'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getTipoPersonaLabel(datos.persona)}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {datos.rfc && (
                          <Chip
                            size="small"
                            label={`RFC: ${datos.rfc}`}
                            icon={<Iconify icon="mdi:card-account-details" width={16} />}
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

                      {datos.regimen && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          <strong>Régimen fiscal:</strong> {getRegimenLabel(datos.regimen)}
                        </Typography>
                      )}

                      {(datos.metodo_pago || datos.forma_pago) && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {datos.metodo_pago && (
                            <Chip
                              size="small"
                              label={getMetodoPagoLabel(datos.metodo_pago)}
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                          {datos.forma_pago && (
                            <Chip
                              size="small"
                              label={getFormaPagoLabel(datos.forma_pago)}
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Stack>
                      )}

                      {datos.uso_cfdi && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          <strong>Uso CFDI:</strong> {datos.uso_cfdi}
                        </Typography>
                      )}

                      {datos.correo && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          <Iconify icon="mdi:email" sx={{ mr: 0.5 }} />
                          {datos.correo}
                        </Typography>
                      )}

                      {datos.comentarios && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          <strong>Comentarios:</strong> {datos.comentarios}
                        </Typography>
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

PedidoDatosFacturacionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedidoId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
