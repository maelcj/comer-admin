'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { esES } from '@mui/x-data-grid/locales';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, FormControl } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import {
  getTiposProductos,
  updateTipoProducto,
  getGoogleProductCategories,
} from 'src/actions/google';

import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export function TiposProductosTable() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState(() => {
    const saved = localStorage.getItem('tiposProductosTablePagination');
    return saved ? JSON.parse(saved) : { page: 0, pageSize: 10 };
  });
  const [rowCount, setRowCount] = useState(0);
  const [filterModel, setFilterModel] = useState(() => {
    const saved = localStorage.getItem('tiposProductosTableFilter');
    return saved ? JSON.parse(saved) : { items: [] };
  });
  const [debounceFilterModel] = useDebounce(filterModel, 500);
  const [loading, setLoading] = useState(false);
  const [googleCategories, setGoogleCategories] = useState([]);

  const initialQuickFilterValue =
    filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
      ? filterModel.quickFilterValues
      : [];

  useEffect(() => {
    localStorage.setItem('tiposProductosTablePagination', JSON.stringify(paginationModel));
  }, [paginationModel]);

  useEffect(() => {
    localStorage.setItem('tiposProductosTableFilter', JSON.stringify(filterModel));
  }, [filterModel]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTiposProductos(paginationModel, debounceFilterModel);
      setRows(data.rows);
      setRowCount(data.rowCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, debounceFilterModel]);

  const fetchGoogleCategories = useCallback(async () => {
    try {
      const data = await getGoogleProductCategories(
        { page: 0, pageSize: 1000 },
        { quickFilterValues: [''] },
        []
      );
      setGoogleCategories(data.rows);
    } catch (error) {
      console.error('Error fetching Google categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchGoogleCategories();
  }, [fetchGoogleCategories]);

  const handleCategoryChange = async (id, newCategoryId) => {
    try {
      const result = await updateTipoProducto(id, newCategoryId);

      if (result.type === 'success') {
        // Actualizar el estado local
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  google_product_category_id: newCategoryId || null,
                  google_product_category_name: newCategoryId
                    ? googleCategories.find((cat) => cat.id === newCategoryId)?.name
                    : null,
                }
              : row
          )
        );
      }
    } catch (error) {
      console.error('Error updating tipo producto:', error);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 300,
      flex: 1,
    },
    {
      field: 'google_product_category_id',
      headerName: 'Categoría Google',
      width: 350,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <FormControl fullWidth size="small">
            <Select
              value={params.value || ''}
              onChange={(e) => handleCategoryChange(params.row.id, e.target.value)}
              label="Seleccionar categoría"
            >
              <MenuItem value="">
                <em>Sin categoría</em>
              </MenuItem>
              {googleCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6">Tipos de Productos</Typography>
        <Typography variant="body2" color="text.secondary">
          Asigna categorías de Google a los tipos de productos extraídos automáticamente.
        </Typography>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={setFilterModel}
        rowHeight={75}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
        }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: { paginationModel },
          density: 'compact',
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [initialQuickFilterValue],
            },
          },
        }}
        sx={{
          height: 400,
          '--DataGrid-overlayHeight': '220px',
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
        }}
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </Card>
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
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}
