'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { esES } from '@mui/x-data-grid/locales';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  gridClasses,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { eliminarOfertaTemporal, getTodasLasOfertasTemporales } from 'src/actions/productos';

import { toast } from 'src/components/snackbar';
import { penIcon, trashIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

import { DialogEditar } from './ofertas-temporales/dialog-editar';

// ----------------------------------------------------------------------

dayjs.locale('es-mx');

export function OfertasTemporalesTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState(null);

  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('ofertasTemporalesTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
  });

  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('ofertasTemporalesTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });

  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem('ofertasTemporalesTableSort');
    return saved ? JSON.parse(saved) : [];
  });

  const [debounceFilterModel] = useDebounce(filterModel, 500);

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useEffect(() => {
    localStorage.setItem('ofertasTemporalesTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('ofertasTemporalesTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  useEffect(() => {
    localStorage.setItem('ofertasTemporalesTableSort', JSON.stringify(sortModel));
  }, [sortModel]);

  const handleEditOferta = (oferta) => {
    setSelectedOferta(oferta);
    setOpenEditDialog(true);
  };

  const handleDeleteOferta = async (oferta) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la oferta temporal del producto "${oferta.producto_nombre}"?`
    );

    if (!confirmed) return;

    setIsLoading(true);
    const response = await eliminarOfertaTemporal(oferta.id);

    if (response.type === 'success') {
      toast.success(response.message || 'Oferta temporal eliminada correctamente');
      await fetchTableData();
    } else {
      toast.error(response.message || 'Error al eliminar la oferta temporal');
    }
    setIsLoading(false);
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    const data = await getTodasLasOfertasTemporales(
      paginationModel,
      debounceFilterModel,
      sortModel
    );
    setRows(data.rows || []);
    setRowsCount(data.totalRows || 0);
    setIsLoading(false);
  }, [debounceFilterModel, paginationModel, sortModel]);

  useEffect(() => {
    if (!openEditDialog) {
      fetchTableData();
    }
  }, [fetchTableData, paginationModel, debounceFilterModel, sortModel, openEditDialog]);

  const renderEstadoChip = (params) => {
    const { activa, fecha_inicio, fecha_fin } = params.row;
    const now = dayjs();
    const inicio = dayjs(fecha_inicio);
    const fin = dayjs(fecha_fin);

    if (!activa) {
      return <Chip label="Inactiva" color="default" size="small" />;
    }

    if (now.isBefore(inicio)) {
      return <Chip label="Programada" color="info" size="small" />;
    }

    if (now.isAfter(fin)) {
      return <Chip label="Expirada" color="error" size="small" />;
    }

    return <Chip label="Activa" color="success" size="small" />;
  };

  const renderPrecio = (valor, moneda = 'MXN') => {
    if (!valor || valor === 0) return '-';
    return fCurrency(valor);
  };

  const columns = [
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar oferta" placement="top">
            <IconButton
              color="warning"
              variant="soft"
              size="small"
              onClick={() => handleEditOferta(params.row)}
            >
              {penIcon}
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar oferta" placement="top">
            <IconButton
              color="error"
              variant="soft"
              size="small"
              onClick={() => handleDeleteOferta(params.row)}
            >
              {trashIcon}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'producto_nombre',
      headerName: 'Producto',
      flex: 1,
      minWidth: 200,
      hideable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Link
          href={paths.dashboard.productos.edit(params.row.producto_id)}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {params.row.producto_nombre}
        </Link>
      ),
    },
    {
      field: 'precios',
      headerName: 'Precios',
      minWidth: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const { precio_original, precio_final } = params.row;
        const precioOriginalFormatted = renderPrecio(precio_original);
        const precioFinalFormatted = renderPrecio(precio_final);

        return (
          <Stack direction="column" spacing={0}>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              Original: {precioOriginalFormatted}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1976d2' }}>
              Final: {precioFinalFormatted}
            </div>
          </Stack>
        );
      },
    },
    {
      field: 'tipo_descuento',
      headerName: 'Tipo',
      minWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const tipos = {
          porcentaje: 'Porcentaje',
          cantidad: 'Cantidad fija',
          precio_final: 'Precio final',
        };
        return tipos[params.value] || params.value;
      },
    },
    {
      field: 'cantidad_descuento',
      headerName: 'Descuento',
      minWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const { tipo_descuento, cantidad_descuento } = params.row;
        if (!cantidad_descuento) return '-';

        if (tipo_descuento === 'porcentaje') {
          return `${cantidad_descuento}%`;
        }
        return fCurrency(cantidad_descuento);
      },
    },
    {
      field: 'fechas',
      headerName: 'Período',
      minWidth: 200,
      filterable: false,
      sortable: true,
      renderCell: (params) => {
        const { fecha_inicio, fecha_fin } = params.row;
        const fechaInicioFormatted = fecha_inicio
          ? dayjs(fecha_inicio).format('DD/MMM/YYYY HH:mm')
          : '-';
        const fechaFinFormatted = fecha_fin ? dayjs(fecha_fin).format('DD/MMM/YYYY HH:mm') : '-';

        return (
          <Stack direction="column" spacing={0}>
            <div style={{ fontSize: '0.875rem' }}>Inicio: {fechaInicioFormatted}</div>
            <div style={{ fontSize: '0.875rem' }}>Fin: {fechaFinFormatted}</div>
          </Stack>
        );
      },
    },
    {
      field: 'estado',
      headerName: 'Estado',
      minWidth: 100,
      filterable: false,
      sortable: true,
      renderCell: renderEstadoChip,
    },
  ];

  return (
    <>
      <DialogEditar
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        oferta={selectedOferta}
        handleGetOfertas={fetchTableData}
        handleGetProducto={null}
      />

      <Card>
        <CardHeader title="Ofertas temporales" sx={{ pb: 1 }} />
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: () => <EmptyContent title="No hay ofertas temporales" />,
            noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          loading={isLoading}
          filterMode="server"
          sortingMode="server"
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          onFilterModelChange={setFilterModel}
          onSortModelChange={setSortModel}
          initialState={{
            pagination: { paginationModel },
            density: 'compact',
            filter: {
              filterModel: {
                items: [],
                quickFilterValues: [initialQuickFilterValue],
              },
            },
            sorting: {
              sortModel,
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={rowsCount}
          getRowHeight={() => 'auto'}
          disableRowSelectionOnClick
          sx={{
            '--DataGrid-overlayHeight': '220px',
            [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
            height: '600px',
          }}
        />
      </Card>
    </>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ '.MuiInputBase-input': { py: '0.5rem !important' } }}>
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
        quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
      />
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        {/* Aquí se pueden agregar más herramientas si es necesario */}
      </Stack>
    </GridToolbarContainer>
  );
}
