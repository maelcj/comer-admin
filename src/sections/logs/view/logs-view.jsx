'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LogsTableRow } from '../logs-table-row';
import { LogsTableHead } from '../logs-table-head';
import { useLogsData } from '../hooks/use-logs-data';
import { LogsTableToolbar } from '../logs-table-toolbar';

// ----------------------------------------------------------------------

export function LogsView() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('timestamp');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState('laravel.log');
  const [logDetailDialog, setLogDetailDialog] = useState({ open: false, entry: null });
  const [clearLogDialog, setClearLogDialog] = useState({ open: false, file: null });

  const {
    logFiles,
    logEntries,
    logStats,
    loading,
    error,
    fetchLogFiles,
    fetchLogEntries,
    fetchLogStats,
    clearLogFile,
    downloadLogFile,
  } = useLogsData();

  useEffect(() => {
    fetchLogFiles();
  }, [fetchLogFiles]);

  useEffect(() => {
    if (selectedFile) {
      fetchLogEntries({
        file: selectedFile,
        page: page + 1,
        per_page: rowsPerPage,
        level: filterLevel,
        search: filterSearch,
      });
      fetchLogStats({ file: selectedFile });
    }
  }, [selectedFile, page, rowsPerPage, filterLevel, filterSearch, fetchLogEntries, fetchLogStats]);

  const handleSort = useCallback(
    (event, id) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelecteds = logEntries.data?.map((n, index) => index) || [];
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    [logEntries.data]
  );

  const handleClick = useCallback(
    (event, index) => {
      const selectedIndex = selected.indexOf(index);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, index);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handleFilterLevel = useCallback((event) => {
    setPage(0);
    setFilterLevel(event.target.value);
  }, []);

  const handleFilterSearch = useCallback((searchValue) => {
    setPage(0);
    setFilterSearch(searchValue);
  }, []);

  const handleFileChange = useCallback((file) => {
    setPage(0);
    setSelectedFile(file);
    setSelected([]);
  }, []);

  const handleViewLogDetail = useCallback((entry) => {
    setLogDetailDialog({ open: true, entry });
  }, []);

  const handleCloseLogDetail = useCallback(() => {
    setLogDetailDialog({ open: false, entry: null });
  }, []);

  const handleOpenClearDialog = useCallback((file) => {
    setClearLogDialog({ open: true, file });
  }, []);

  const handleCloseClearDialog = useCallback(() => {
    setClearLogDialog({ open: false, file: null });
  }, []);

  const handleClearLog = useCallback(async () => {
    if (clearLogDialog.file) {
      await clearLogFile(clearLogDialog.file);
      handleCloseClearDialog();
      // Refresh data
      fetchLogEntries({
        file: selectedFile,
        page: 1,
        per_page: rowsPerPage,
        level: filterLevel,
        search: filterSearch,
      });
      fetchLogStats({ file: selectedFile });
    }
  }, [
    clearLogDialog.file,
    clearLogFile,
    fetchLogEntries,
    fetchLogStats,
    selectedFile,
    rowsPerPage,
    filterLevel,
    filterSearch,
  ]);

  const handleDownloadLog = useCallback(
    (file) => {
      downloadLogFile(file);
    },
    [downloadLogFile]
  );

  const handleRefresh = useCallback(() => {
    fetchLogFiles();
    if (selectedFile) {
      fetchLogEntries({
        file: selectedFile,
        page: page + 1,
        per_page: rowsPerPage,
        level: filterLevel,
        search: filterSearch,
      });
      fetchLogStats({ file: selectedFile });
    }
  }, [
    fetchLogFiles,
    fetchLogEntries,
    fetchLogStats,
    selectedFile,
    page,
    rowsPerPage,
    filterLevel,
    filterSearch,
  ]);

  const getLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
        return 'error';
      case 'WARNING':
      case 'WARN':
        return 'warning';
      case 'INFO':
        return 'info';
      case 'DEBUG':
        return 'default';
      case 'CRITICAL':
      case 'EMERGENCY':
      case 'ALERT':
        return 'error';
      default:
        return 'default';
    }
  };

  const denseHeight = 56;

  const canReset = !!filterLevel || !!filterSearch;

  const notFound = !logEntries.data?.length && canReset;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="System Logs"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Logs' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Log Statistics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Log Statistics
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : logStats ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Entries: {logStats.total_entries}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Recent Activity (24h): {logStats.recent_activity}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  By Level:
                </Typography>
                {Object.entries(logStats.by_level || {}).map(([level, count]) => (
                  <Box
                    key={level}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Chip
                      label={level}
                      size="small"
                      color={getLevelColor(level)}
                      variant="outlined"
                    />
                    <Typography variant="body2">{count}</Typography>
                  </Box>
                ))}
              </Box>
            ) : null}
          </Card>
        </Grid>

        {/* Log Files */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Log Files
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Scrollbar sx={{ maxHeight: 150 }}>
                {logFiles?.map((file) => (
                  <Box
                    key={file.name}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    border={selectedFile === file.name ? 2 : 1}
                    borderColor={selectedFile === file.name ? 'primary.main' : 'divider'}
                    borderRadius={1}
                    mb={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleFileChange(file.name)}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={selectedFile === file.name ? 'bold' : 'normal'}
                      >
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {file.size} • {file.last_modified_human}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadLog(file.name);
                          }}
                        >
                          <Iconify icon="eva:download-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clear Log">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenClearDialog(file.name);
                          }}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Scrollbar>
            )}
          </Card>
        </Grid>

        {/* Log Entries Table */}
        <Grid item xs={12}>
          <Card>
            <LogsTableToolbar
              numSelected={selected.length}
              filterLevel={filterLevel}
              onFilterLevel={handleFilterLevel}
              filterSearch={filterSearch}
              onFilterSearch={handleFilterSearch}
              onRefresh={handleRefresh}
              selectedFile={selectedFile}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 960, position: 'relative', overflow: 'unset' }}>
                {loading && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor="rgba(255,255,255,0.8)"
                    zIndex={1}
                  >
                    <CircularProgress />
                  </Box>
                )}

                <Table size="small" stickyHeader>
                  <LogsTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={logEntries.data?.length || 0}
                    numSelected={selected.length}
                    onSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'timestamp', label: 'Timestamp' },
                      { id: 'level', label: 'Level' },
                      { id: 'message', label: 'Message' },
                      { id: 'environment', label: 'Environment' },
                      { id: 'actions', label: 'Actions', align: 'center' },
                    ]}
                  />

                  <TableBody>
                    {logEntries.data?.map((row, index) => (
                      <LogsTableRow
                        key={`${row.timestamp}-${index}`}
                        row={row}
                        selected={selected.includes(index)}
                        onSelectRow={(event) => handleClick(event, index)}
                        onViewDetail={() => handleViewLogDetail(row)}
                        getLevelColor={getLevelColor}
                      />
                    ))}

                    {!loading && !logEntries.data?.length && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            {notFound
                              ? 'No logs found with current filters'
                              : 'No log entries found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Divider />

            <TablePagination
              page={page}
              component="div"
              count={logEntries.pagination?.total || 0}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[25, 50, 100]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Log Detail Dialog */}
      <Dialog open={logDetailDialog.open} onClose={handleCloseLogDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          Log Entry Detail
          {logDetailDialog.entry && (
            <Chip
              label={logDetailDialog.entry.level}
              size="small"
              color={getLevelColor(logDetailDialog.entry.level)}
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {logDetailDialog.entry && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Timestamp:
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                {logDetailDialog.entry.timestamp}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Environment:
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                {logDetailDialog.entry.environment}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Message:
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                {logDetailDialog.entry.message}
              </Typography>

              {logDetailDialog.entry.context && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Stack Trace / Context:
                  </Typography>
                  <Scrollbar sx={{ maxHeight: 300 }}>
                    <Box
                      component="pre"
                      sx={{
                        backgroundColor: 'grey.900',
                        p: 2,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {logDetailDialog.entry.context}
                    </Box>
                  </Scrollbar>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogDetail}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Clear Log Confirmation Dialog */}
      <Dialog open={clearLogDialog.open} onClose={handleCloseClearDialog}>
        <DialogTitle>Clear Log File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear the log file &ldquo;{clearLogDialog.file}&rdquo;? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearDialog}>Cancel</Button>
          <Button onClick={handleClearLog} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
