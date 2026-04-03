import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getTipos,
  getMarcas,
  eliminarOfertasMarca,
  modificarOfertasMarca,
  eliminarOfertasMarcaCotizacion,
  modificarOfertasMarcaCotizacion,
} from 'src/actions/productos';

import { toast } from 'src/components/snackbar';

const ProductosOfertas = () => {
  const hasPageBeenRendered = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState('');
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [porcentaje, setPorcentaje] = useState(5);

  const handleGetMarcas = async () => {
    setIsLoading(true);
    const res = await getMarcas();
    setMarcas(res);
    setIsLoading(false);
  };

  const handleGetTipos = async () => {
    setIsLoading(true);
    const res = await getTipos(marca);
    setTipo(''); // Reset tipo
    setTipos(res);
    setIsLoading(false);
  };

  const handleModificarOfertasMarca = async () => {
    if (!marca || !tipo) {
      return toast.error('Selecciona una marca y un tipo');
    }
    setIsLoading(true);
    const res = await modificarOfertasMarca(marca, tipo, porcentaje);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleModificarOfertasMarcaCotizacion = async () => {
    if (!marca || !tipo) {
      return toast.error('Selecciona una marca y un tipo');
    }
    setIsLoading(true);
    const res = await modificarOfertasMarcaCotizacion(marca, tipo, porcentaje);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleEliminarOfertasMarca = async () => {
    if (!marca || !tipo) {
      return toast.error('Selecciona una marca y un tipo');
    }
    setIsLoading(true);
    const res = await eliminarOfertasMarca(marca, tipo);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  const handleEliminarOfertasMarcaCotizacion = async () => {
    if (!marca || !tipo) {
      return toast.error('Selecciona una marca y un tipo');
    }
    setIsLoading(true);
    const res = await eliminarOfertasMarcaCotizacion(marca, tipo);
    setIsLoading(false);
    if (res.type === 'error') return toast.error(res.message);

    return toast.success(res.message);
  };

  useEffect(() => {
    handleGetMarcas();
  }, []);

  useEffect(() => {
    if (hasPageBeenRendered.current && marca) {
      handleGetTipos();
    } else {
      hasPageBeenRendered.current = true;
    }
  }, [marca]);

  return (
    <Card>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Ofertas por marca
        </Typography>

        <Box>
          <TextField
            select
            variant="outlined"
            size="small"
            label="Marca"
            defaultValue=""
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            {marcas.map((marcaAux) => (
              <MenuItem key={marcaAux} value={marcaAux}>
                {marcaAux}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            select
            variant="outlined"
            size="small"
            label="Tipo"
            defaultValue=""
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            {tipos?.map((tipoAux) => (
              <MenuItem key={tipoAux} value={tipoAux}>
                {tipoAux}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="descuento"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                </InputAdornment>
              ),
            }}
            size="small"
            type="number"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
          <Typography>Oferta normal:</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              handleModificarOfertasMarca();
            }}
          >
            Aplicar ofertas
          </Button>
          <Button
            color="error"
            onClick={() => {
              handleEliminarOfertasMarca();
            }}
          >
            Remover ofertas
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Typography>Oferta cotización:</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              handleModificarOfertasMarcaCotizacion();
            }}
          >
            Aplicar ofertas
          </Button>
          <Button
            color="error"
            onClick={() => {
              handleEliminarOfertasMarcaCotizacion();
            }}
          >
            Remover ofertas
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default ProductosOfertas;
