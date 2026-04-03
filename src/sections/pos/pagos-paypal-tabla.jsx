'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import IconButton from '@mui/material/IconButton';
import { DataGrid, gridClasses, GridToolbarContainer } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import { voidPayPalPayment, getTablaPagosPayPal, capturePayPalPayment } from 'src/actions/pedidos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';
import { checkIcon, cancelIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function PagosPayPalTabla({ setOpen }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 60,
      flex: 1,
      renderCell: (params) => {
        if (params.row.captured === 0 && params.row.void === 0) {
          return (
            <>
              <Tooltip title="Aceptar" placement="top" arrow>
                <IconButton
                  color="success"
                  onClick={() => {
                    handleCapturePayPalPayment(params.row.id);
                  }}
                >
                  {checkIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Rechazar" placement="top" arrow>
                <IconButton
                  color="error"
                  onClick={() => {
                    handleVoidPayPalPayment(params.row.id);
                  }}
                >
                  {cancelIcon}
                </IconButton>
              </Tooltip>
            </>
          );
        }
        if (params.row.captured === 1 && params.row.void === 0) {
          return (
            <Label variant="soft" color="success" sx={{ cursor: 'pointer' }}>
              Aprobado
            </Label>
          );
        }

        if (params.row.captured === 0 && params.row.void === 1) {
          return (
            <Label variant="soft" color="error" sx={{ cursor: 'pointer' }}>
              Cancelado
            </Label>
          );
        }
        return null;
      },
    },
    {
      field: 'pedido',
      headerName: 'pedido',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 50,
    },
    {
      field: 'total',
      headerName: 'total',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'fecha',
      headerName: 'fecha',
      hideable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      minWidth: 90,
      flex: 1,
    },
  ];

  const handleCapturePayPalPayment = async (id) => {
    setIsLoading(true);
    const res = await capturePayPalPayment(id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    fetchTableData();

    return toast.success(res.message);
  };

  const handleVoidPayPalPayment = async (id) => {
    setIsLoading(true);
    const res = await voidPayPalPayment(id);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    fetchTableData();

    return toast.success(res.message);
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTablaPagosPayPal(paginationModel, debounceFilterModel);
    setRows(data.rows);
    setRowsCount(data.totalRows);
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData, paginationModel, debounceFilterModel]);

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
      sx={{
        '--DataGrid-overlayHeight': '220px',
        [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '5px' },
      }}
    />
  );
}

function CustomToolbar() {
  return <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }} />;
}
