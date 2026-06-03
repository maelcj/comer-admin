'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { getProductos } from 'src/actions/comentarios';

import { plusIcon, searchIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

import { ComentariosTable } from './comentarios-table';
import CreateComentarioDialog from '../create-comentario-dialog';

// ----------------------------------------------------------------------

export function ProductosComentariosTable({ onSearchMpn }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [filterModel, setFilterModel] = useState({ items: [], quickFilterValues: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMpn, setSelectedMpn] = useState('');

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getProductos(paginationModel, debounceFilterModel);
    if (data?.rows) {
      setRows(data.rows);
      setRowsCount(data.totalRows);
    }
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel]);

  const handleCreateComentario = (productoId) => {
    setSelectedProductId(productoId);
    setCreateDialogOpen(true);
  };

  const handleViewComentarios = (mpn) => {
    setSelectedMpn(mpn);
    setViewDialogOpen(true);
  };

  const columns = [
    {
      field: 'mpn',
      headerName: 'mpn',
      minWidth: 130,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'tipo',
      headerName: 'tipo',
      minWidth: 150,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'marca',
      headerName: 'marca',
      minWidth: 110,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'comentarios_count',
      headerName: 'cantidad de comentarios',
      minWidth: 180,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'acciones',
      align: 'right',
      headerAlign: 'right',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Ver comentarios del producto" placement="top">
            <IconButton
              color="info"
              variant="soft"
              onClick={() => {
                handleViewComentarios(params.row.mpn);
              }}
            >
              {searchIcon}
            </IconButton>
          </Tooltip>
          <Tooltip title="Registrar un comentario al producto" placement="top">
            <IconButton
              color="primary"
              variant="soft"
              onClick={() => {
                handleCreateComentario(params.row.id);
              }}
            >
              {plusIcon}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
        }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        loading={isLoading}
        filterMode="server"
        paginationMode="server"
        sortingMode="server"
        onPaginationModelChange={setPaginationModel}
        onFilterModelChange={setFilterModel}
        initialState={{
          pagination: { paginationModel },
          density: 'compact',
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: filterModel.quickFilterValues,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        rowCount={rowsCount}
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        sx={{
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
          height: '400px',
        }}
      />

      {createDialogOpen && (
        <CreateComentarioDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onComentarioCreated={fetchTableData}
          productoId={selectedProductId}
        />
      )}

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Comentarios del Producto: {selectedMpn}</DialogTitle>
        <DialogContent sx={{ pt: 2, minHeight: 400 }}>
          <ComentariosTable searchInitialValue={selectedMpn} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
    </GridToolbarContainer>
  );
}
