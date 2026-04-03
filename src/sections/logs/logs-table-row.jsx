'use client';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LogsTableRow({ row, selected, onSelectRow, onViewDetail, getLevelColor }) {
  const handleViewDetail = useCallback(() => {
    onViewDetail();
  }, [onViewDetail]);

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };

  const truncateMessage = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  };

  return (
    <TableRow hover selected={selected} tabIndex={-1}>
      <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap>
          {formatTimestamp(row.timestamp)}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip label={row.level} size="small" color={getLevelColor(row.level)} variant="outlined" />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ maxWidth: 400 }}>
          {truncateMessage(row.message)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" noWrap>
          {row.environment}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Tooltip title="View Details">
          <IconButton onClick={handleViewDetail}>
            <Iconify icon="eva:eye-outline" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
