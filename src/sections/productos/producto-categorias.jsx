import { useState, useEffect, useCallback } from 'react';

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

import { getCategoriasArbol } from 'src/actions/categorias';
import {
  getCategoriasProducto,
  agregarCategoriaNivel3,
  eliminarCategoriaNivel3Manual,
} from 'src/actions/productos';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { trashIcon, arrowRightIcon } from 'src/components/icons';

const ProductoCategorias = ({ producto }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriasProducto, setCategoriasProducto] = useState([]);
  const [selectedNivel1, setSelectedNivel1] = useState('');
  const [selectedNivel2, setSelectedNivel2] = useState('');
  const [selectedNivel3, setSelectedNivel3] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cargarCategorias = useCallback(async () => {
    const res = await getCategoriasArbol();
    if (res && !res.type) {
      setCategorias(res);
    }
  }, []);

  const cargarCategoriasProducto = useCallback(async () => {
    if (!producto?.id) return;
    const res = await getCategoriasProducto(producto.id);
    if (res && !res.type) {
      setCategoriasProducto(res);
    }
  }, [producto?.id]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  useEffect(() => {
    cargarCategoriasProducto();
  }, [cargarCategoriasProducto]);

  // Obtener opciones de nivel 2 basado en selección de nivel 1
  const opcionesNivel2 =
    categorias.find((c) => c.idCategoriasNivel1 === selectedNivel1)?.categorias_nivel2 || [];

  // Obtener opciones de nivel 3 basado en selección de nivel 2
  const opcionesNivel3 =
    opcionesNivel2.find((c) => c.idCategoriasNivel2 === selectedNivel2)?.categorias_nivel3 || [];

  const handleChangeNivel1 = (e) => {
    setSelectedNivel1(e.target.value);
    setSelectedNivel2('');
    setSelectedNivel3('');
  };

  const handleChangeNivel2 = (e) => {
    setSelectedNivel2(e.target.value);
    setSelectedNivel3('');
  };

  const handleChangeNivel3 = (e) => {
    setSelectedNivel3(e.target.value);
  };

  const handleAgregar = async () => {
    if (!selectedNivel3) return;

    setIsLoading(true);
    const res = await agregarCategoriaNivel3(producto.id, selectedNivel3);
    setIsLoading(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setSelectedNivel1('');
    setSelectedNivel2('');
    setSelectedNivel3('');
    await cargarCategoriasProducto();
  };

  const handleEliminar = async (id) => {
    setIsLoading(true);
    const res = await eliminarCategoriaNivel3Manual(id);
    setIsLoading(false);

    if (res.type === 'error') {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    await cargarCategoriasProducto();
  };

  return (
    <Card>
      <CardHeader title="Categorías" sx={{ mb: 3 }} />
      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Selects en cascada */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Nivel 1</InputLabel>
            <Select value={selectedNivel1} label="Nivel 1" onChange={handleChangeNivel1}>
              {categorias.map((cat) => (
                <MenuItem key={cat.idCategoriasNivel1} value={cat.idCategoriasNivel1}>
                  {cat.nombreCategoriaNivel1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!selectedNivel1}>
            <InputLabel>Nivel 2</InputLabel>
            <Select value={selectedNivel2} label="Nivel 2" onChange={handleChangeNivel2}>
              {opcionesNivel2.map((cat) => (
                <MenuItem key={cat.idCategoriasNivel2} value={cat.idCategoriasNivel2}>
                  {cat.nombreCategoriaNivel2}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!selectedNivel2}>
            <InputLabel>Nivel 3</InputLabel>
            <Select value={selectedNivel3} label="Nivel 3" onChange={handleChangeNivel3}>
              {opcionesNivel3.map((cat) => (
                <MenuItem key={cat.idCategoriasNivel3} value={cat.idCategoriasNivel3}>
                  {cat.nombreCategoriaNivel3}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <LoadingButton
          variant="contained"
          color="primary"
          size="small"
          disabled={!selectedNivel3}
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
              {categoriasProducto.map((registro) => (
                <Stack key={registro.id} direction="row" alignItems="center" spacing={1}>
                  <Label variant="soft" color="info" sx={{ flex: 1, justifyContent: 'flex-start' }}>
                    {registro.categoria_nivel3?.categoria_nivel2?.categoria_nivel1
                      ?.nombreCategoriaNivel1 || '—'}
                    &nbsp;{arrowRightIcon}&nbsp;
                    {registro.categoria_nivel3?.categoria_nivel2?.nombreCategoriaNivel2 || '—'}
                    &nbsp;{arrowRightIcon}&nbsp;
                    {registro.categoria_nivel3?.nombreCategoriaNivel3 || '—'}
                  </Label>
                  <LoadingButton
                    variant="soft"
                    color="error"
                    size="small"
                    loading={isLoading}
                    onClick={() => handleEliminar(registro.id)}
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
