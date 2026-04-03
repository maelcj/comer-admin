import { useState, useEffect } from 'react';

import {
  Box,
  Paper,
  Table,
  Button,
  Dialog,
  Skeleton,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Pagination,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { getProductos } from 'src/actions/comentarios';

import { toast } from 'src/components/snackbar';

const ProductSelectionDialog = ({ open, onClose, onSelectProduct }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleGetProductos = async (searchTerm = '', page = 1) => {
    setLoading(true);
    try {
      const res = await getProductos(searchTerm, page);
      if (res.type === 'error') {
        toast.error(res.message);
        return;
      }
      setProductos(res.data || []);
      setTotalPages(res.last_page || 0);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    handleGetProductos(search, 1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    handleGetProductos(search, value);
  };

  const handleSelectProduct = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct);
      onClose();
      setSelectedProduct(null);
      setSearch('');
      setCurrentPage(1);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedProduct(null);
    setSearch('');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (open) {
      handleGetProductos();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Producto</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar producto (MPN, Tipo, Marca, Modelo)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
            Buscar
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Seleccionar</TableCell>
                <TableCell>MPN</TableCell>
                <TableCell>Producto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="circular" width={20} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : productos.length > 0 ? (
                productos.map((producto) => (
                  <TableRow
                    key={producto.id}
                    hover
                    selected={selectedProduct?.id === producto.id}
                    onClick={() => setSelectedProduct(producto)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <input
                        type="radio"
                        checked={selectedProduct?.id === producto.id}
                        onChange={() => setSelectedProduct(producto)}
                      />
                    </TableCell>
                    <TableCell>{producto.mpn}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{producto.nombreCompleto}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No se encontraron productos
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSelectProduct} variant="contained" disabled={!selectedProduct}>
          Seleccionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSelectionDialog;
