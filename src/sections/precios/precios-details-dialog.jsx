'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function PreciosDetailsDialog({ open, onClose, product }) {
  const router = useRouter();

  if (!product) return null;

  const handleEditProduct = () => {
    if (product.store_product_id) {
      router.push(paths.dashboard.productos.edit(product.store_product_id));
    }
  };

  const hasCompetitors = product.competidores && product.competidores.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:chart-square-bold-duotone" width={28} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Detalles de Monitoreo de Precios</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Cabecera del Producto */}
        <Card variant="outlined" sx={{ p: 2.5, mb: 3, bgcolor: 'background.neutral' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {product.brand} {product.type ? `• ${product.type}` : ''} - {product.model}
              </Typography>
              {product.mpn && (
                <Typography variant="body2" color="text.secondary">
                  MPN: <strong>{product.mpn}</strong>
                </Typography>
              )}
            </Stack>

            {product.store_product_id && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={handleEditProduct}
              >
                Editar producto
              </Button>
            )}
          </Stack>

          {/* Precios en Tienda Actual y Tiendas Hermanas */}
          <Box sx={{ mt: 2, pt: 2, borderTop: (th) => `1px dashed ${th.palette.divider}` }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Precios en tiendas:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {product.precios_tiendas && product.precios_tiendas.length > 0 ? (
                product.precios_tiendas.map((store) => (
                  <Paper
                    key={store.store_id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: store.is_current_store ? 'primary.lighter' : 'background.paper',
                      borderColor: store.is_current_store ? 'primary.main' : 'divider',
                      minWidth: 150,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                        {store.store_name}
                      </Typography>
                      {store.is_current_store && (
                        <Label variant="filled" color="primary" sx={{ height: 20, fontSize: 10 }}>
                          Actual
                        </Label>
                      )}
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: store.is_current_store ? 'primary.darker' : 'text.primary',
                        mt: 0.5,
                      }}
                    >
                      {store.current_price_formatted}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin precios registrados
                </Typography>
              )}
            </Stack>
          </Box>
        </Card>

        {/* Sección de Competidores */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
          Competidores Rastreados ({product.competidores ? product.competidores.length : 0})
        </Typography>

        {hasCompetitors ? (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.neutral' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Competidor / URL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Precio detectado
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Comparativa vs tienda
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Último rastreo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.competidores.map((comp) => {
                  let statusColor = 'default';
                  let statusText = 'Sin diferencia';

                  if (comp.diff_status === 'above') {
                    statusColor = 'error';
                    statusText = `+${comp.diff_percentage}% (+$${Math.abs(comp.diff_amount).toFixed(2)})`;
                  } else if (comp.diff_status === 'below') {
                    statusColor = 'success';
                    statusText = `${comp.diff_percentage}% (-$${Math.abs(comp.diff_amount).toFixed(2)})`;
                  } else if (comp.diff_status === 'equal') {
                    statusColor = 'info';
                    statusText = '0% ($0.00)';
                  }

                  return (
                    <TableRow key={comp.id} hover>
                      {/* Dominio y Link */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {comp.domain || 'Competidor'}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography
                              component="a"
                              href={comp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="caption"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                                maxWidth: { xs: 200, sm: 320 },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'inline-block',
                              }}
                            >
                              {comp.url}
                            </Typography>
                            <Iconify
                              icon="solar:arrow-right-up-linear"
                              width={14}
                              sx={{ color: 'primary.main', flexShrink: 0 }}
                            />
                          </Stack>
                          {comp.errors && (
                            <Typography variant="caption" sx={{ color: 'error.main', fontStyle: 'italic' }}>
                              ⚠️ {comp.errors}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Precio */}
                      <TableCell align="right">
                        {comp.price_formatted ? (
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {comp.price_formatted}
                          </Typography>
                        ) : (
                          <Label variant="soft" color="warning">
                            Sin precio
                          </Label>
                        )}
                      </TableCell>

                      {/* Diferencia */}
                      <TableCell align="center">
                        {comp.price !== null && comp.diff_amount !== null ? (
                          <Stack spacing={0.5} alignItems="center">
                            <Label variant="soft" color={statusColor}>
                              {statusText}
                            </Label>
                            <Typography variant="caption" color="text.disabled">
                              {comp.diff_status === 'above' && 'Tienda más cara'}
                              {comp.diff_status === 'below' && 'Tienda más barata'}
                              {comp.diff_status === 'equal' && 'Mismo precio'}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            N/A
                          </Typography>
                        )}
                      </TableCell>

                      {/* Checked at */}
                      <TableCell align="right">
                        <Typography variant="caption" color="text.secondary">
                          {comp.checked_at ? comp.checked_at : 'No rastreado'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyContent
            title="Sin URLs de competencia"
            description="Este producto no tiene competidores registrados para monitorear."
            sx={{ py: 3 }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PreciosDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number,
    store_product_id: PropTypes.number,
    brand: PropTypes.string,
    type: PropTypes.string,
    model: PropTypes.string,
    mpn: PropTypes.string,
    precios_tiendas: PropTypes.arrayOf(
      PropTypes.shape({
        store_id: PropTypes.number,
        store_name: PropTypes.string,
        is_current_store: PropTypes.bool,
        current_price_formatted: PropTypes.string,
      })
    ),
    competidores: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        url: PropTypes.string,
        domain: PropTypes.string,
        price: PropTypes.number,
        price_formatted: PropTypes.string,
        diff_amount: PropTypes.number,
        diff_percentage: PropTypes.number,
        diff_status: PropTypes.string,
        checked_at: PropTypes.string,
        errors: PropTypes.string,
      })
    ),
  }),
};
