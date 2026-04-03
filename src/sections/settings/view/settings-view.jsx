'use client';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { getSettings, updateSettings } from 'src/actions/settings';

import { toast } from 'src/components/snackbar';
import { checkIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// ----------------------------------------------------------------------

export function SettingsView() {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetSettings = async () => {
    setIsLoading(true);
    const res = await getSettings();
    if (res.type === 'error') return toast.error(res.message);
    setIsLoading(false);
    return setSettings(res);
  };

  const updateSetting = (id, key, value) => {
    const newSettings = settings.map((setting) => {
      if (setting.id === id) {
        return { ...setting, [key]: value };
      }
      return setting;
    });
    setSettings(newSettings);
  };

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    const res = await updateSettings(settings);
    setIsLoading(false);

    if (res.type === 'error') return toast.error(res.message);

    handleGetSettings();

    return toast.success(res.message);
  };

  useEffect(() => {
    handleGetSettings();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Settings"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Settings' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 2 }}>
        <Backdrop
          open={isLoading}
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: 'absolute',
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container spacing={2}>
          {settings.map((setting) => (
            <Grid xs={12} md={12} key={setting.id}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  typography: 'body2',
                  borderStyle: 'dashed',
                }}
              >
                {setting.name}
                <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }} spacing={2}>
                  <TextField
                    size="small"
                    label="Local"
                    onChange={(event) => {
                      updateSetting(setting.id, 'local', event.target.value);
                    }}
                    value={setting.local}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Production"
                    onChange={(event) => {
                      updateSetting(setting.id, 'production', event.target.value);
                    }}
                    value={setting.production}
                    fullWidth
                  />
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Button
            size="small"
            color="primary"
            variant="outlined"
            startIcon={checkIcon}
            onClick={() => {
              handleUpdateSettings();
            }}
          >
            Actualizar
          </Button>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
