import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useSetState } from 'src/hooks/use-set-state';

// ----------------------------------------------------------------------

export function ProductosTableToolbar({ filters, options }) {
  const local = useSetState({
    status: filters.state.status,
    importacion: filters.state.importacion,
    categorias: filters.state.categorias,
  });

  const handleChangeStatus = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      const newValue = value === '' ? [] : [value];
      local.setState({ status: newValue });
      filters.setState({ status: newValue });
    },
    [local, filters]
  );

  const handleChangeImportacion = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      const newValue = value === '' ? [] : [value];
      local.setState({ importacion: newValue });
      filters.setState({ importacion: newValue });
    },
    [local, filters]
  );

  const handleChangeCategorias = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      const newValue = value === '' ? [] : [value];
      local.setState({ categorias: newValue });
      filters.setState({ categorias: newValue });
    },
    [local, filters]
  );

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="producto-filter-status-select-label">Estado</InputLabel>

        <Select
          value={local.state.status[0] || ''}
          onChange={handleChangeStatus}
          input={<OutlinedInput label="Estado" />}
          inputProps={{ id: 'producto-filter-status-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {options.status.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="producto-filter-categorias-select-label">categorias</InputLabel>

        <Select
          value={local.state.categorias[0] || ''}
          onChange={handleChangeCategorias}
          input={<OutlinedInput label="categorias" />}
          inputProps={{ id: 'producto-filter-categorias-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">
            <em>todos</em>
          </MenuItem>
          {options.categorias.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="producto-filter-importacion-select-label">Importación</InputLabel>

        <Select
          value={local.state.importacion[0] || ''}
          onChange={handleChangeImportacion}
          input={<OutlinedInput label="Importación" />}
          inputProps={{ id: 'producto-filter-importacion-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {options.importacion.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
