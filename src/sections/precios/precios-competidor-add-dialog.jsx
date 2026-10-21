'use client';

import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useEffect } from 'react';

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

import { agregarCompetidorUrl } from 'src/actions/precios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function validateUrlFormat(urlString) {
  let toTest = (urlString || '').trim();
  if (!toTest) return false;
  if (!/^https?:\/\//i.test(toTest)) {
    toTest = `https://${toTest}`;
  }
  try {
    const parsed = new URL(toTest);
    return Boolean(parsed.hostname && parsed.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function PreciosCompetidorAddDialog({ open, onClose, product, onSuccess }) {
  const [urlsText, setUrlsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUrlsText('');
      setUrlError('');

      // Autofocus asegurado al abrir el diálogo
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  // Parsear líneas del textarea en tiempo real
  const parsedLines = useMemo(() => {
    const rawLines = urlsText.split('\n');
    const seen = new Set();

    return rawLines
      .map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        const isValid = validateUrlFormat(trimmed);
        const normalized = trimmed
          .toLowerCase()
          .replace(/[?#].*$/, '')
          .replace(/\/+$/, '');
        const isDuplicate = seen.has(normalized);
        seen.add(normalized);

        return {
          lineIndex: idx + 1,
          raw: trimmed,
          isValid,
          isDuplicate,
        };
      })
      .filter(Boolean);
  }, [urlsText]);

  const validUrls = useMemo(
    () => parsedLines.filter((item) => item.isValid).map((item) => item.raw),
    [parsedLines]
  );

  const duplicateCount = useMemo(
    () => parsedLines.filter((item) => item.isDuplicate).length,
    [parsedLines]
  );

  const invalidCount = useMemo(
    () => parsedLines.filter((item) => !item.isValid).length,
    [parsedLines]
  );

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText)) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlsText((prev) => (prev ? `${prev.trim()}\n${text.trim()}` : text.trim()));
          if (urlError) setUrlError('');
        }
      }
    } catch {
      // Ignorar si el navegador bloquea el acceso al portapapeles
    }
  };

  const handleClear = () => {
    setUrlsText('');
    setUrlError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (parsedLines.length === 0) {
      setUrlError('Debes ingresar al menos una URL.');
      return;
    }

    const invalidItems = parsedLines.filter((item) => !item.isValid);
    if (invalidItems.length > 0) {
      const linesList = invalidItems.map((i) => `Línea ${i.lineIndex}`).join(', ');
      setUrlError(`Formato no válido en: ${linesList}. Asegúrate de ingresar URLs válidas.`);
      return;
    }

    setIsSubmitting(true);
    setUrlError('');

    try {
      // El backend se encarga siempre de verificar duplicados en la base de datos
      const res = await agregarCompetidorUrl(product.id, validUrls);

      if (res.success) {
        toast.success(res.message || 'URLs registradas con éxito');
        onSuccess?.();
        onClose();
      } else {
        setUrlError(res.message || 'Error al registrar las URLs');
        toast.error(res.message || 'Error al registrar las URLs');
      }
    } catch (error) {
      console.error('Error registrando URLs de competidor:', error);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              icon="solar:link-circle-bold-duotone"
              width={26}
              sx={{ color: 'primary.main' }}
            />
            <Typography variant="h6">Agregar URLs de Competencia</Typography>
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
                {typeof product.competitor_urls_count === 'number' && (
                  <span>
                    URLs registradas: <strong>{product.competitor_urls_count}</strong>
                  </span>
                )}
              </Stack>
            </Stack>

            {/* Input de URLs (Textarea) */}
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  URLs de productos competidores
                </Typography>

                <Stack direction="row" spacing={0.5}>
                  {typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText) && (
                    <Button
                      size="small"
                      color="inherit"
                      onClick={handlePasteClipboard}
                      disabled={isSubmitting}
                      startIcon={<Iconify icon="solar:clipboard-text-bold" width={15} />}
                      sx={{ typography: 'caption', px: 1, py: 0.25 }}
                    >
                      Pegar
                    </Button>
                  )}
                  {Boolean(urlsText) && (
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
              </Stack>

              <TextField
                inputRef={inputRef}
                autoFocus
                fullWidth
                multiline
                minRows={5}
                maxRows={10}
                placeholder={`https://tienda-competidor1.com/producto/123\nhttps://tienda-competidor2.com/item/456\nhttps://mercadolibre.com.mx/MLA-789`}
                value={urlsText}
                onChange={(e) => {
                  setUrlsText(e.target.value);
                  if (urlError) setUrlError('');
                }}
                error={Boolean(urlError)}
                helperText={urlError || 'Pega o escribe una URL por línea.'}
                disabled={isSubmitting}
                inputProps={{
                  style: {
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                  },
                }}
              />

              {/* Resumen en tiempo real de URLs detectadas */}
              {parsedLines.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
                  <Chip
                    size="small"
                    color={invalidCount > 0 ? 'default' : 'primary'}
                    variant={invalidCount > 0 ? 'outlined' : 'soft'}
                    icon={<Iconify icon="solar:link-bold" width={16} />}
                    label={`${validUrls.length} ${validUrls.length === 1 ? 'URL detectada' : 'URLs detectadas'}`}
                  />

                  {duplicateCount > 0 && (
                    <Chip
                      size="small"
                      color="warning"
                      variant="soft"
                      icon={<Iconify icon="solar:danger-triangle-bold" width={16} />}
                      label={`${duplicateCount} duplicada(s) en el texto`}
                    />
                  )}

                  {invalidCount > 0 && (
                    <Chip
                      size="small"
                      color="error"
                      variant="soft"
                      icon={<Iconify icon="solar:danger-triangle-bold" width={16} />}
                      label={`${invalidCount} con formato inválido`}
                    />
                  )}
                </Stack>
              )}
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
            color="primary"
            loading={isSubmitting}
            disabled={parsedLines.length === 0}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {validUrls.length > 1
              ? `Registrar ${validUrls.length} URLs`
              : validUrls.length === 1
                ? 'Registrar 1 URL'
                : 'Registrar URLs'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

PreciosCompetidorAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number,
    brand: PropTypes.string,
    model: PropTypes.string,
    mpn: PropTypes.string,
    full_name: PropTypes.string,
    name: PropTypes.string,
    competitor_urls_count: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
};
