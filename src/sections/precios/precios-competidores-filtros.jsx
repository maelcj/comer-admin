'use client';

import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PreciosCompetidoresFiltros({ filters, onFiltersChange }) {
  const hasActiveFilters =
    Boolean(filters.marca) ||
    Boolean(filters.type) ||
    Boolean(filters.modelo) ||
    Boolean(filters.soloSinCompetidores);

  const handleMarcaChange = (event) => {
    onFiltersChange({
      ...filters,
      marca: event.target.value,
    });
  };

  const handleTypeChange = (event) => {
    onFiltersChange({
      ...filters,
      type: event.target.value,
    });
  };

  const handleModeloChange = (event) => {
    onFiltersChange({
      ...filters,
      modelo: event.target.value,
    });
  };

  const handleSinCompetidoresSwitch = (event) => {
    onFiltersChange({
      ...filters,
      soloSinCompetidores: event.target.checked,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      marca: '',
      type: '',
      modelo: '',
      soloSinCompetidores: false,
    });
  };

  return (
    <Card sx={{ p: 2, mb: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          flex={1}
        >
          {/* Filtro Marca */}
          <TextField
            size="small"
            placeholder="Filtrar por marca..."
            value={filters.marca || ''}
            onChange={handleMarcaChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:tag-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { sm: 180 } }}
          />

          {/* Filtro Tipo */}
          <TextField
            size="small"
            placeholder="Filtrar por tipo..."
            value={filters.type || ''}
            onChange={handleTypeChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:folder-with-files-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { sm: 180 } }}
          />

          {/* Filtro Modelo */}
          <TextField
            size="small"
            placeholder="Filtrar por modelo..."
            value={filters.modelo || ''}
            onChange={handleModeloChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:box-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { sm: 180 } }}
          />

          {/* Switch Solo sin URLs de competencia */}
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(filters.soloSinCompetidores)}
                onChange={handleSinCompetidoresSwitch}
                color="warning"
              />
            }
            label="Solo sin URLs de competencia"
            sx={{
              userSelect: 'none',
              typography: 'body2',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          />
        </Stack>

        {/* Botón Limpiar filtros */}
        {hasActiveFilters && (
          <Button
            size="small"
            color="error"
            variant="soft"
            onClick={handleReset}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            sx={{ flexShrink: 0 }}
          >
            Limpiar filtros
          </Button>
        )}
      </Stack>
    </Card>
  );
}

PreciosCompetidoresFiltros.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
    soloSinCompetidores: PropTypes.bool,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};
