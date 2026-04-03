import { useState } from 'react';

import {
  Grid,
  Button,
  Dialog,
  Checkbox,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { crearComentario } from 'src/actions/comentarios';

import { toast } from 'src/components/snackbar';

import ProductSelectionDialog from './product-selection-dialog';

const CreateComentarioDialog = ({ open, onClose, onComentarioCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    comentario: '',
    respuesta: '',
    calificacion: 5,
    review: false,
    producto_id: null,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      producto_id: product.id,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.correo || !formData.comentario || !formData.producto_id) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const res = await crearComentario(formData);
      if (res.type === 'error') {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      onComentarioCreated();
      handleClose();
    } catch (error) {
      toast.error('Error al crear el comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      comentario: '',
      respuesta: '',
      calificacion: 5,
      review: false,
      producto_id: null,
    });
    setSelectedProduct(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Comentario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Nombre *"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Correo *"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Calificación"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={formData.calificacion}
                onChange={(e) =>
                  handleInputChange('calificacion', parseInt(e.target.value, 10) || 1)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={() => setProductDialogOpen(true)} sx={{ mb: 1 }}>
                {selectedProduct
                  ? `Producto: ${selectedProduct.nombreCompleto}`
                  : 'Seleccionar Producto *'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comentario *"
                value={formData.comentario}
                onChange={(e) => handleInputChange('comentario', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Respuesta"
                value={formData.respuesta}
                onChange={(e) => handleInputChange('respuesta', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.review}
                    onChange={(e) => handleInputChange('review', e.target.checked)}
                  />
                }
                label="Review"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading ||
              !formData.nombre ||
              !formData.correo ||
              !formData.comentario ||
              !formData.producto_id
            }
          >
            {loading ? 'Creando...' : 'Crear Comentario'}
          </Button>
        </DialogActions>
      </Dialog>

      <ProductSelectionDialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        onSelectProduct={handleProductSelect}
      />
    </>
  );
};

export default CreateComentarioDialog;
