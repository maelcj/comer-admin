'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { actualizarExcluidoProducto } from 'src/actions/precios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MAX_COMMENT_LENGTH = 5000;

export function PreciosCompetidorExcludeDialog({ open, onClose, product, onSuccess }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && product) {
      setCommentText(product.comments || '');
    }
  }, [open, product]);

  const handleConfirm = async (e) => {
    e?.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const res = await actualizarExcluidoProducto(product.id, true, commentText);

      if (res.success) {
        toast.success(res.message || 'Producto marcado como excluido');
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || 'Error al excluir el producto');
      }
    } catch (error) {
      console.error('Error excluyendo producto:', error);
      toast.error('Ocurrió un error inesperado al excluir el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleConfirm}>
        <DialogTitle
          sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon="solar:forbidden-circle-bold-duotone"
              width={26}
              sx={{ color: 'warning.main' }}
            />
            <Typography variant="h6">Excluir producto</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2.5 }}>
          <Stack spacing={2.5}>
            <Alert severity="warning" variant="outlined">
              Este producto dejará de mostrarse en la tabla principal de URLs de competencia y
              pasará a la sección de <strong>Productos Excluidos</strong>. Las URLs registradas se
              conservarán y podrás restaurarlo en cualquier momento.
            </Alert>

            {/* Información del producto */}
            <Stack
              spacing={0.75}
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                border: (th) => `1px solid ${th.palette.divider}`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {product.full_name || product.name || `${product.brand} ${product.model}`}
                </Typography>
                {product.brand && (
                  <Chip
                    label={product.brand}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                )}
              </Stack>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={2}
                sx={{ color: 'text.secondary', typography: 'caption' }}
              >
                {product.model && (
                  <span>
                    Modelo: <strong>{product.model}</strong>
                  </span>
                )}
                {product.mpn && (
                  <span>
                    MPN: <strong>{product.mpn}</strong>
                  </span>
                )}
                {typeof product.competitor_urls_count === 'number' && (
                  <span>
                    URLs registradas: <strong>{product.competitor_urls_count}</strong>
                  </span>
                )}
              </Stack>
            </Stack>

            {/* Comentario opcional */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              label="Comentario / motivo de exclusión (opcional)"
              placeholder="Ej. Producto exclusivo, sin equivalente en competencia, descontinuado..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              inputProps={{ maxLength: MAX_COMMENT_LENGTH }}
              helperText="Puedes dejar o actualizar un comentario para recordar por qué se excluyó este producto."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            color="warning"
            loading={isSubmitting}
            startIcon={<Iconify icon="solar:forbidden-circle-bold" />}
          >
            Excluir producto
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

PreciosCompetidorExcludeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number,
    brand: PropTypes.string,
    model: PropTypes.string,
    mpn: PropTypes.string,
    full_name: PropTypes.string,
    name: PropTypes.string,
    comments: PropTypes.string,
    competitor_urls_count: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
};
