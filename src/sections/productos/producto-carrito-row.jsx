import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

const ProductoCarrito = ({ producto, productosCarrito, setProductosCarrito }) => {
  const [cantidad, setCantidad] = useState(producto.cantidad);

  useEffect(() => {
    const newProductosCarrito = productosCarrito
      .map((item) => {
        if (item.id === producto.id) {
          return { ...item, cantidad };
        }
        return item;
      })
      .filter((item) => item.cantidad > 0);
    setProductosCarrito(newProductosCarrito);
  }, [cantidad]);

  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ lineHeight: 1.1 }}>
          {producto.nombre}
        </Typography>
      </Box>

      <TextField
        size="small"
        type="number"
        placeholder="0.00"
        value={cantidad}
        onChange={(e) => {
          setCantidad(e.target.value);
        }}
        sx={{ maxWidth: 70 }}
      />
    </Stack>
  );
};

export default ProductoCarrito;
