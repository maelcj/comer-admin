import { useState, Fragment, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';

import { getSubcategorias } from 'src/actions/categorias';
import { agregarCategoriaProducto, eliminarCategoriaProducto } from 'src/actions/productos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { trashIcon, arrowRightIcon } from 'src/components/icons';

const ProductoCategorias = ({ producto, categoriasProducto, cargarCategoriasProducto }) => {
  // Array de arrays de opciones, ej: [ [raíces], [hijos de N1], [hijos de N2] ]
  const [categoryLevels, setCategoryLevels] = useState([]);
  // Array de IDs seleccionados en cada nivel
  const [selectedPath, setSelectedPath] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Cargar raíces al inicio
  const cargarRaices = useCallback(async () => {
    const res = await getSubcategorias(null);
    if (res && !res.type) {
      setCategoryLevels([res]);
    }
  }, []);

  useEffect(() => {
    cargarRaices();
  }, [cargarRaices]);

  // Manejar el cambio en un nivel específico
  const handleChangeLevel = async (levelIndex, categoryId) => {
    // Cortar los paths seleccionados hasta este nivel
    const newSelectedPath = selectedPath.slice(0, levelIndex);
    newSelectedPath[levelIndex] = categoryId;
    setSelectedPath(newSelectedPath);

    // Cortar las opciones de subniveles (borrar los de más abajo)
    const newCategoryLevels = categoryLevels.slice(0, levelIndex + 1);
    setCategoryLevels(newCategoryLevels);

    if (categoryId) {
      setIsLoading(true);
      // Obtener hijos
      const hijos = await getSubcategorias(categoryId);
      setIsLoading(false);

      if (hijos && !hijos.type && hijos.length > 0) {
        // Añadir el nuevo nivel de opciones
        setCategoryLevels([...newCategoryLevels, hijos]);
      }
    }
  };

  const handleAgregar = async () => {
    // Validar que al menos haya un nivel seleccionado
    if (selectedPath.length === 0) return;

    // Obtener la categoría del nivel más profundo seleccionado
    const selectedCategoriaId = selectedPath[selectedPath.length - 1];

    if (!selectedCategoriaId) return;

    setIsLoading(true);
    const res = await agregarCategoriaProducto(producto.id, selectedCategoriaId);
    setIsLoading(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);

    // Resetear selección
    setSelectedPath([]);
    setCategoryLevels([categoryLevels[0]]); // dejar solo las raíces
    await cargarCategoriasProducto();
  };

  const handleEliminar = async (categoryId) => {
    setIsLoading(true);
    const res = await eliminarCategoriaProducto(producto.id, categoryId);
    setIsLoading(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    await cargarCategoriasProducto();
  };

  // Renderizar breadcrumb basado en ancestros para un registro de categoría de producto
  const renderBreadcrumb = (categoria) => {
    // En la nueva estructura, el backend devuelve category_product con el modelo Category y la relación ancestors
    // Asumimos que `categoria` es un modelo Category devuelto por getCategoriasProducto, que incluye sus ancestros.
    const path = [];
    if (categoria.ancestors && categoria.ancestors.length > 0) {
      // Los ancestros vienen del más alto (raíz) al más cercano (padre), si se ordenaron bien, o puede que necesite reversarse.
      // Laravel Adjacency List por defecto devuelve ancestors de padre hacia raíz. Invertimos para el breadcrumb.
      const reversedAncestors = [...categoria.ancestors].reverse();
      reversedAncestors.forEach((anc) => {
        path.push(anc.name);
      });
    }
    path.push(categoria.name);

    return (
      <Label variant="soft" color="info" sx={{ flex: 1, justifyContent: 'flex-start' }}>
        {path.map((name, index) => (
          <Fragment key={index}>
            {name}
            {index < path.length - 1 && <>&nbsp;{arrowRightIcon}&nbsp;</>}
          </Fragment>
        ))}
      </Label>
    );
  };

  return (
    <Card>
      <CardHeader title="Categorías" sx={{ mb: 3 }} />
      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Selects dinámicos basados en la profundidad */}
        <Stack direction="column" spacing={2}>
          {categoryLevels.map((options, index) => (
            <FormControl key={`level-${index}`} size="small" fullWidth>
              <InputLabel>Nivel {index + 1}</InputLabel>
              <Select
                value={selectedPath[index] || ''}
                label={`Nivel ${index + 1}`}
                onChange={(e) => handleChangeLevel(index, e.target.value)}
              >
                {options.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>

        <LoadingButton
          variant="contained"
          color="primary"
          size="small"
          disabled={selectedPath.length === 0}
          loading={isLoading}
          onClick={handleAgregar}
          sx={{ alignSelf: 'flex-start' }}
        >
          Agregar categoría
        </LoadingButton>

        {/* Lista de categorías asignadas manualmente */}
        {categoriasProducto?.length > 0 && (
          <>
            <Divider />
            <Typography variant="subtitle2">Categorías asignadas</Typography>
            <Stack spacing={1}>
              {categoriasProducto.map((categoria) => (
                <Stack key={categoria.id} direction="row" alignItems="center" spacing={1}>
                  {renderBreadcrumb(categoria)}
                  <LoadingButton
                    variant="soft"
                    color="error"
                    size="small"
                    loading={isLoading}
                    onClick={() => handleEliminar(categoria.id)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    {trashIcon}
                  </LoadingButton>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default ProductoCategorias;
