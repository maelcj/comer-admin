import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

export function SeoCategoriasTableToolbar({ filters }) {
  const handleChangeFilter = useCallback(
    (name, event) => {
      filters.setState({ [name]: event.target.checked });
    },
    [filters]
  );

  const handleFilterName = useCallback(
    (event) => {
      filters.setState({ name: event.target.value });
    },
    [filters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <TextField
        value={filters.state.name}
        onChange={handleFilterName}
        placeholder="Buscar..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: 1, md: 260 } }}
      />
      <Typography variant="subtitle2" sx={{ mr: 2, ml: { md: 2 } }}>
        Mostrar solo categorías que no tengan:
      </Typography>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.state.filter_no_title}
              onChange={(e) => handleChangeFilter('filter_no_title', e)}
            />
          }
          label="Title"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.state.filter_no_meta_title}
              onChange={(e) => handleChangeFilter('filter_no_meta_title', e)}
            />
          }
          label="Meta Title"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.state.filter_no_description}
              onChange={(e) => handleChangeFilter('filter_no_description', e)}
            />
          }
          label="Description"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.state.filter_no_meta_description}
              onChange={(e) => handleChangeFilter('filter_no_meta_description', e)}
            />
          }
          label="Meta Description"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!filters.state.filter_no_image}
              onChange={(e) => handleChangeFilter('filter_no_image', e)}
            />
          }
          label="Imagen"
        />
      </FormGroup>
    </Stack>
  );
}

SeoCategoriasTableToolbar.propTypes = {
  filters: PropTypes.shape({
    setState: PropTypes.func,
    state: PropTypes.shape({
      filter_no_description: PropTypes.bool,
      filter_no_image: PropTypes.bool,
      filter_no_meta_description: PropTypes.bool,
      filter_no_meta_title: PropTypes.bool,
      filter_no_title: PropTypes.bool,
      name: PropTypes.string,
    }),
  }),
};
