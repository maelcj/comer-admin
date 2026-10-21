'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { importarMatches } from 'src/actions/precios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SAMPLE_JSON = `{
  "matches": [
    {
      "product_id": 491,
      "competitor_name": "Tienda Competidora",
      "url": "https://competidor.com.mx/producto/ejemplo",
      "confidence": "high",
      "evidence": [
        "Marca coincidente",
        "Modelo coincidente"
      ],
      "status": "pending_review"
    }
  ]
}`;

export function PreciosImportDialog({ open, onClose, onSuccess }) {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      setJsonText('');
      setErrorMsg('');
      setResult(null);
    }
  }, [open]);

  const handlePasteSample = () => {
    setJsonText(SAMPLE_JSON);
    setErrorMsg('');
    setResult(null);
  };

  const handleImport = async () => {
    setErrorMsg('');
    setResult(null);

    const trimmed = jsonText.trim();
    if (!trimmed) {
      setErrorMsg('Por favor ingresa o pega el JSON con los matches a importar.');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (e) {
      setErrorMsg(`JSON inválido: ${e.message}`);
      return;
    }

    const matches = parsed?.matches;
    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      setErrorMsg('El JSON debe contener un arreglo "matches" con al menos un elemento.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await importarMatches(matches);

      if (res.success) {
        setResult(res);
        toast.success(res.message || 'Importación completada con éxito');
        onSuccess?.();
      } else {
        setErrorMsg(res.message || 'Error durante la importación');
        toast.error(res.message || 'Error durante la importación');
      }
    } catch (error) {
      console.error('Error importando matches:', error);
      setErrorMsg('Ocurrió un error inesperado al procesar la importación.');
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:upload-track-bold-duotone" width={26} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Importar URLs de Competencia (JSON)</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Pega a continuación el JSON con el formato <code>matches</code>. Las URLs duplicadas se omitirán automáticamente.
            </Typography>

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={handlePasteSample}
              startIcon={<Iconify icon="solar:copy-bold" />}
              sx={{ flexShrink: 0, mt: { xs: 1, sm: 0 } }}
            >
              Formato de ejemplo
            </Button>
          </Stack>

          {/* Textarea para JSON */}
          <TextField
            multiline
            rows={12}
            fullWidth
            placeholder={SAMPLE_JSON}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={isSubmitting}
            InputProps={{
              sx: {
                fontFamily: 'monospace',
                fontSize: 13,
                bgcolor: 'background.neutral',
              },
            }}
          />

          {/* Alerta de Error de validación */}
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          {/* Resultado de la importación */}
          {result && (
            <Alert severity={result.created > 0 ? 'success' : 'info'}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {result.message}
              </Typography>
              <Typography variant="caption" display="block">
                Total procesados: {result.total_processed} | Nuevas registradas: {result.created} | Omitidas (duplicadas): {result.skipped}
              </Typography>
              {result.errors && result.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                    Advertencias ({result.errors.length}):
                  </Typography>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {result.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>
                        <Typography variant="caption">{err}</Typography>
                      </li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>
                        <Typography variant="caption">...y {result.errors.length - 5} más</Typography>
                      </li>
                    )}
                  </ul>
                </Box>
              )}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          {result ? 'Cerrar' : 'Cancelar'}
        </Button>

        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleImport}
          loading={isSubmitting}
          startIcon={<Iconify icon="solar:import-bold" />}
        >
          Procesar Importación
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

PreciosImportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};
