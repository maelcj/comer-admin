'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { assignRole, getAllRoles, getUserRole } from 'src/actions/roles';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function AssignRolesDialog({ open, onClose, user, onSuccess }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!open || !user?.id) return;

    setLoading(true);
    try {
      // Cargar todos los roles disponibles
      const rolesResponse = await getAllRoles();
      if (rolesResponse?.roles) {
        setRoles(rolesResponse.roles);
      }

      // Cargar rol actual del usuario
      const userRoleResponse = await getUserRole(user.id);
      if (userRoleResponse?.role) {
        setSelectedRole(userRoleResponse.role.id.toString());
      } else {
        setSelectedRole('');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [open, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Por favor selecciona un rol');
      return;
    }

    setSubmitting(true);
    try {
      await assignRole(user.id, selectedRole);
      toast.success('Rol asignado exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al asignar rol');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar rol a {user?.name}</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona el rol que deseas asignar al usuario:
            </Typography>

            <RadioGroup value={selectedRole} onChange={handleRoleChange}>
              <FormControlLabel
                value=""
                control={<Radio />}
                label="Sin rol"
                disabled={submitting}
              />
              {roles.map((role) => (
                <FormControlLabel
                  key={role.id}
                  value={role.id.toString()}
                  control={<Radio />}
                  disabled={submitting}
                  label={
                    <Box>
                      <Typography variant="body1" component="span">
                        {role.name}
                      </Typography>
                      {role.description && (
                        <Typography variant="body2" color="text.secondary" component="div">
                          {role.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
