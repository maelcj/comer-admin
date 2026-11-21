'use client';

import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import Chip from '@mui/material/Chip';
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

import { actualizarComentarioProducto } from 'src/actions/precios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MAX_COMMENT_LENGTH = 5000;

export function PreciosCompetidorCommentDialog({ open, onClose, product, onSuccess }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (open && product) {
      setCommentText(product.comments || '');

      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const len = inputRef.current.value?.length || 0;
          inputRef.current.setSelectionRange?.(len, len);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, product]);

  const handleClear = () => {
    setCommentText('');
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const res = await actualizarComentarioProducto(product.id, commentText);

      if (res.success) {
        toast.success(res.message || 'Comentario guardado correctamente');
        onSuccess?.(res.comments ?? '');
        onClose();
      } else {
        toast.error(res.message || 'Error al guardar el comentario');
      }
    } catch (error) {
      console.error('Error guardando comentario del producto:', error);
      toast.error('Ocurrió un error inesperado al guardar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const hadComment = Boolean((product.comments || '').trim());
  const isClearing = hadComment && !commentText.trim();

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEntered: () => {
          inputRef.current?.focus();
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify
              icon="solar:chat-round-dots-bold-duotone"
              width={26}
              sx={{ color: 'primary.main' }}
            />
            <Typography variant="h6">
              {hadComment ? 'Editar comentario del producto' : 'Agregar comentario al producto'}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2.5 }}>
          <Stack spacing={2.5}>
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
              </Stack>
            </Stack>

            {/* Campo de comentario */}
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Comentario
                </Typography>

                {Boolean(commentText) && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={15} />}
                    sx={{ typography: 'caption', px: 1, py: 0.25 }}
                  >
                    Limpiar
                  </Button>
                )}
              </Stack>

              <TextField
                inputRef={inputRef}
                autoFocus
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                placeholder="Escribe observaciones sobre este producto (ej. motivo de exclusión, detalles de búsqueda en competencia, notas internas...)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                inputProps={{ maxLength: MAX_COMMENT_LENGTH }}
                helperText={`${commentText.length} / ${MAX_COMMENT_LENGTH} caracteres. Deja el campo vacío y guarda para eliminar el comentario.`}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            color={isClearing ? 'error' : 'primary'}
            loading={isSubmitting}
            startIcon={
              <Iconify icon={isClearing ? 'solar:trash-bin-trash-bold' : 'solar:diskette-bold'} />
            }
          >
            {isClearing ? 'Eliminar comentario' : 'Guardar comentario'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

PreciosCompetidorCommentDialog.propTypes = {
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
  }),
  onSuccess: PropTypes.func,
};
