'use client';

import { useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { getTablaTipoCambio, aplicarTipoDeCambio } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const ProductosTipoCambioTabla = forwardRef((props, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });

  useImperativeHandle(ref, () => ({
    fetchTableData: () => fetchTableData(),
  }));

  const handleAplicarTipoDeCambio = async (id) => {
    setIsLoading(true);

    const regular = document.getElementById(`tipoDeCambio${id}`).value;
    const oferta = document.getElementById(`tipoDeCambioOferta${id}`).value;

    const res = await aplicarTipoDeCambio(id, regular, oferta);

    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const columns = [
    {
      field: 'actions',
      headerName: '',
      align: 'left',
      headerAlign: 'right',
      width: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Aplicar" placement="top" arrow>
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              handleAplicarTipoDeCambio(params.row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="m173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001"
              />
            </svg>
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'marca',
      headerName: 'marca',
      minWidth: 50,
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'regular',
      headerName: 'regular',
      minWidth: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <TextField
          size="small"
          type="number"
          defaultValue={params.row.regular}
          id={`tipoDeCambio${params.row.id}`}
        />
      ),
    },
    {
      field: 'oferta',
      headerName: 'oferta',
      minWidth: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <TextField
          size="small"
          type="number"
          defaultValue={params.row.oferta}
          id={`tipoDeCambioOferta${params.row.id}`}
        />
      ),
    },
    {
      field: 'actualizado',
      headerName: 'actualizado',
      minWidth: 50,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaTipoCambio(paginationModel, filterModel);
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
      getRowHeight={() => 'auto'}
      disableRowSelectionOnClick
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
      }}
    />
  );
});

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

export default ProductosTipoCambioTabla;
