'use client';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { eliminarPlantilla, getTablaPlantillas } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const ProductosPlantillasTabla = ({ setIsOpenDialog, setIdPlantilla }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });

  const handleEliminarPlantilla = async (id) => {
    setIsLoading(true);

    const res = await eliminarPlantilla(id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    fetchTableData();

    return toast.success(res.message);
  };

  const columns = [
    {
      field: 'actions',
      headerName: '',
      align: 'left',
      headerAlign: 'right',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center">
          <Tooltip title="Editar" placement="top" arrow>
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                setIdPlantilla(params.row.id);
                setIsOpenDialog(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m11.4 18.161l7.396-7.396a10.289 10.289 0 0 1-3.326-2.234a10.29 10.29 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.556 6.556 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56c.43-.205.836-.456 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.754 8.754 0 0 0 2.092 3.32a8.754 8.754 0 0 0 3.431 2.13z"
                />
              </svg>
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" placement="top" arrow>
            <IconButton
              size="medium"
              color="error"
              onClick={() => {
                handleEliminarPlantilla(params.row.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"
                />
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.043.713-.43.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.043-.713-.43-.672-.864l.5-5.263c.04-.434.409-.75.82-.707"
                  clipRule="evenodd"
                />
              </svg>
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'nombre',
      headerName: 'nombre',
      minWidth: 250,
      maxWidht: 500,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaPlantillas(paginationModel, filterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [filterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, filterModel]);

  return (
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
      onPaginationModelChange={setPaginationModel}
      onFilterModelChange={setFilterModel}
      initialState={{
        pagination: { paginationModel },
        density: 'compact',
      }}
      pageSizeOptions={[5, 10, 25]}
      rowCount={rowsCount}
      disableRowSelectionOnClick
      getRowHeight={() => 'auto'}
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
      }}
    />
  );
};

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
    </GridToolbarContainer>
  );
}

export default ProductosPlantillasTabla;
