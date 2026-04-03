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

  return (
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
  );
}
