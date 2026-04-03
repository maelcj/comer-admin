'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LogsTableToolbar({
  numSelected,
  filterLevel,
  onFilterLevel,
  filterSearch,
  onFilterSearch,
  onRefresh,
  selectedFile,
}) {
  const handleFilterSearch = useCallback(
    (event) => {
      onFilterSearch(event.target.value);
    },
    [onFilterSearch]
  );

  const LOG_LEVELS = [
    { value: '', label: 'All Levels' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'alert', label: 'Alert' },
    { value: 'critical', label: 'Critical' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'notice', label: 'Notice' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' },
  ];

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1" sx={{ flex: '1 1 100%' }}>
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Typography component="div" variant="h6" sx={{ minWidth: 120 }}>
            {selectedFile}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select value={filterLevel} label="Level" onChange={onFilterLevel}>
                {LOG_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <OutlinedInput
              size="small"
              value={filterSearch}
              onChange={handleFilterSearch}
              placeholder="Search logs..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ width: 240 }}
            />

            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <Iconify icon="eva:refresh-fill" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Toolbar>
  );
}
