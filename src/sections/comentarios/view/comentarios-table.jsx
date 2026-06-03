'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
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

import { fDate } from 'src/utils/format-time';

import { getComentarios } from 'src/actions/comentarios';

import { penIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

import Comentario from '../comentario';

// ----------------------------------------------------------------------

export function ComentariosTable({ searchInitialValue }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [sortModel, setSortModel] = useState([{ field: 'created_at', sort: 'desc' }]);
  const [filterModel, setFilterModel] = useState({
    items: [],
    quickFilterValues: searchInitialValue ? [searchInitialValue] : [],
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedComentario, setSelectedComentario] = useState(null);

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getComentarios(paginationModel, debounceFilterModel, sortModel);
    if (data?.rows) {
      setRows(data.rows);
      setRowsCount(data.totalRows);
    }
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel, sortModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel, sortModel]);

  useEffect(() => {
    if (searchInitialValue) {
      setFilterModel({
        items: [],
        quickFilterValues: [searchInitialValue],
      });
    }
  }, [searchInitialValue]);

  const handleEdit = (comentario) => {
    setSelectedComentario(comentario);
    setEditDialogOpen(true);
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
      field: 'created_at',
      headerName: 'fecha',
      minWidth: 150,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => fDate(params.row.created_at),
    },
    {
      field: 'respuesta',
      headerName: 'respondido',
      minWidth: 120,
      flex: 1,
      hideable: false,
      filterable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (params.row.respuesta ? 'Sí' : 'No'),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'editar',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Editar comentario" placement="right">
          <IconButton
            color="warning"
            variant="soft"
            onClick={() => {
              handleEdit(params.row);
            }}
          >
            {penIcon}
          </IconButton>
        </Tooltip>
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
        onSortModelChange={setSortModel}
        initialState={{
          pagination: { paginationModel },
          density: 'compact',
          sorting: {
            sortModel: [{ field: 'created_at', sort: 'desc' }],
          },
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

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Comentario</DialogTitle>
        <DialogContent>
          {selectedComentario && (
            <Comentario
              comentario={selectedComentario}
              handleGetComentarios={() => {
                fetchTableData();
                setEditDialogOpen(false);
              }}
            />
          )}
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
