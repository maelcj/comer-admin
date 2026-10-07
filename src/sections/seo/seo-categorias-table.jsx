'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { useSetState } from 'src/hooks/use-set-state';

import { getCategoriasSeo } from 'src/actions/seo';

import { penIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import SeoCategoriasEditarDialog from './seo-categorias-editar-dialog';
import { SeoCategoriasTableToolbar } from './seo-categorias-table-toolbar';

export function SeoCategoriasTable() {
  const filters = useSetState({
    name: '',
    filter_no_title: false,
    filter_no_meta_title: false,
    filter_no_description: false,
    filter_no_meta_description: false,
    filter_no_image: false,
  });

  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('seoCategoriasTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem('seoCategoriasTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  const handleEditRow = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.row.arbol || params.row.name} placement="top">
          <Typography variant="body2" noWrap>
            {params.row.name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'title',
      headerName: 'Título',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          noWrap
          sx={{ color: params.row.title ? 'text.primary' : 'text.disabled' }}
        >
          {params.row.title || 'Sin definir'}
        </Typography>
      ),
    },
    {
      field: 'meta_title',
      headerName: 'Meta Título',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          noWrap
          sx={{ color: params.row.meta_title ? 'text.primary' : 'text.disabled' }}
        >
          {params.row.meta_title || 'Sin definir'}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          noWrap
          sx={{ color: params.row.description ? 'text.primary' : 'text.disabled' }}
        >
          {params.row.description || 'Sin definir'}
        </Typography>
      ),
    },
    {
      field: 'meta_description',
      headerName: 'Meta Descripción',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          noWrap
          sx={{ color: params.row.meta_description ? 'text.primary' : 'text.disabled' }}
        >
          {params.row.meta_description || 'Sin definir'}
        </Typography>
      ),
    },
    {
      field: 'image',
      headerName: 'Imagen',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.row.image ? (
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
        ) : (
          <Iconify icon="eva:close-circle-fill" sx={{ color: 'error.main' }} />
        ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Editar" placement="right">
          <IconButton color="warning" variant="soft" onClick={() => handleEditRow(params.row.id)}>
            {penIcon}
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const fetchTableData = useCallback(async () => {
    setisLoading(true);
    const data = await getCategoriasSeo(paginationModel, filters.state);
    setRows(data.rows || []);
    setRowsCount(data.totalRows || 0);
    setisLoading(false);
  }, [paginationModel, filters.state]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return (
    <>
      <Card>
        <CardHeader title="Categorías" sx={{ pb: 1, mb: 2 }} />
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: () => <EmptyContent />,
            noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
          }}
          slotProps={{
            toolbar: { filters },
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          loading={isLoading}
          filterMode="server"
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          initialState={{
            pagination: { paginationModel },
            density: 'standard',
          }}
          pageSizeOptions={[10, 25, 50]}
          rowCount={rowsCount}
          disableRowSelectionOnClick
          sx={{
            '--DataGrid-overlayHeight': '220px',
            [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
            height: '700px',
          }}
        />
      </Card>

      {dialogOpen && (
        <SeoCategoriasEditarDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          id={selectedId}
          fetchCategorias={fetchTableData}
        />
      )}
    </>
  );
}

function CustomToolbar({ filters }) {
  return (
    <GridToolbarContainer>
      <SeoCategoriasTableToolbar filters={filters} />
    </GridToolbarContainer>
  );
}
