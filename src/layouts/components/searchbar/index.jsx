'use client';

import * as NProgress from 'nprogress';
import { useDebounce } from 'use-debounce';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Backdrop from '@mui/material/Backdrop';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useEventListener } from 'src/hooks/use-event-listener';

import { varAlpha } from 'src/theme/styles';
import { buscarPedidos, buscarClientes, buscarCotizaciones } from 'src/actions/omnisearch';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ResultItem } from './result-item';

// ----------------------------------------------------------------------

export function Searchbar({ data: navItems = [], sx, ...other }) {
  const theme = useTheme();
  const router = useRouter();
  const search = useBoolean(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [includeCotizaciones, setIncludeCotizaciones] = useState(true);
  const [includePedidos, setIncludePedidos] = useState(true);
  const [includeClientes, setIncludeClientes] = useState(true);

  const handleSearch = async () => {
    // check if the search query has a length of 3 or more
    if (debouncedSearch.length < 3) {
      return;
    }
    setIsLoading(true);
    await handleSearchCotizaciones();
    await handleSearchPedidos();
    await handleSearchClientes();

    setIsLoading(false);
  };

  const handleSearchCotizaciones = async () => {
    if (!includeCotizaciones) {
      return true;
    }

    setCotizaciones([]);
    const res = await buscarCotizaciones(debouncedSearch);
    if (res.type === 'error') {
      return toast.error(res.message);
    }
    setCotizaciones(res);

    return null;
  };

  const handleSearchPedidos = async () => {
    if (!includePedidos) {
      return true;
    }

    setPedidos([]);
    const res = await buscarPedidos(debouncedSearch);
    if (res.type === 'error') {
      return toast.error(res.message);
    }
    setPedidos(res);

    return null;
  };

  const handleSearchClientes = async () => {
    if (!includeClientes) {
      return true;
    }

    setClientes([]);
    const res = await buscarClientes(debouncedSearch);
    if (res.type === 'error') {
      return toast.error(res.message);
    }
    setClientes(res);

    return null;
  };

  useEffect(() => {
    setIncludeCotizaciones(includeCotizaciones);
    if (includeCotizaciones) {
      handleSearch();
    } else {
      setCotizaciones([]);
    }
  }, [includeCotizaciones]);

  useEffect(() => {
    setIncludePedidos(includePedidos);
    if (includePedidos) {
      handleSearch();
    } else {
      setPedidos([]);
    }
  }, [includePedidos]);

  useEffect(() => {
    setIncludeClientes(includeClientes);
    if (includeClientes) {
      handleSearch();
    } else {
      setClientes([]);
    }
  }, [includeClientes]);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    }
  }, [debouncedSearch]);

  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery('');
    setCotizaciones([]);
    setPedidos([]);
    setClientes([]);
  }, [search]);

  const handleKeyDown = (event) => {
    if (event.key === 'k' && event.metaKey) {
      search.onToggle();
      setSearchQuery('');
    }
  };

  useEventListener('keydown', handleKeyDown);

  const handleClick = useCallback(
    (path) => {
      // check if the path is the same as the current path
      if (pathname !== `${path}/`) {
        NProgress.start();
        router.push(path);
      }
      handleClose();
    },
    [handleClose, router, pathname]
  );

  const renderItems = () => (
    <Stack direction="column" gap={3}>
      {cotizaciones.length > 0 && (
        <Box>
          <Typography variant="title">Cotizaciones:</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {cotizaciones.map((cotizacion) => (
              <Grid xs={6} key={cotizacion.id}>
                <ResultItem
                  search={debouncedSearch}
                  element={cotizacion}
                  onClickItem={() => handleClick(paths.dashboard.cotizaciones.edit(cotizacion.id))}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {pedidos.length > 0 && (
        <Box>
          <Typography variant="title">Pedidos:</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {pedidos.map((cotizacion) => (
              <Grid xs={6} key={cotizacion.id}>
                <ResultItem
                  search={debouncedSearch}
                  element={cotizacion}
                  onClickItem={() => handleClick(paths.dashboard.pedidos.edit(cotizacion.id))}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {clientes.length > 0 && (
        <Box>
          <Typography variant="title">Clientes:</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {clientes.map((cliente) => (
              <Grid xs={6} key={cliente.id}>
                <ResultItem
                  search={debouncedSearch}
                  element={cliente}
                  onClickItem={() => handleClick(paths.dashboard.clientes.edit(cliente.id))}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );

  const renderButton = (
    <Box
      display="flex"
      alignItems="center"
      onClick={search.onTrue}
      sx={{
        flexGrow: 1,
        pr: { xs: 1 },
        borderRadius: { xs: 1.5 },
        cursor: { sm: 'pointer' },
        bgcolor: { xs: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
        ...sx,
      }}
      {...other}
    >
      <IconButton disableRipple>
        {/* https://icon-sets.iconify.design/eva/search-fill/ */}
        <SvgIcon sx={{ width: 20, height: 20 }}>
          <path
            fill="currentColor"
            d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
          />
        </SvgIcon>
      </IconButton>

      <Label
        sx={{
          fontSize: 12,
          color: 'grey.800',
          bgcolor: 'common.white',
          boxShadow: theme.customShadows.z1,
          display: { xs: 'inline-flex', sm: 'inline-flex' },
          cursor: 'pointer',
          ml: 'auto',
        }}
      >
        ⌘K
      </Label>
    </Box>
  );

  return (
    <>
      {renderButton}
      <Dialog
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' } }}
      >
        <Backdrop
          open={isLoading}
          sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, position: 'absolute' }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.vars.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
            inputProps={{ sx: { typography: 'h6' } }}
          />
        </Box>

        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap', px: 3, mt: 2 }}>
          <FormControlLabel
            label="Cotizaciones"
            control={
              <Checkbox
                size="medium"
                checked={includeCotizaciones}
                onChange={(event) => setIncludeCotizaciones(event.target.checked)}
                sx={{ py: 0 }}
              />
            }
          />
          <FormControlLabel
            label="Pedidos"
            control={
              <Checkbox
                size="medium"
                checked={includePedidos}
                onChange={(event) => setIncludePedidos(event.target.checked)}
                sx={{ py: 0 }}
              />
            }
          />
          <FormControlLabel
            label="Clientes"
            control={
              <Checkbox
                size="medium"
                checked={includeClientes}
                onChange={(event) => setIncludeClientes(event.target.checked)}
                sx={{ py: 0 }}
              />
            }
          />
        </Stack>

        <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 400 }}>{renderItems()}</Scrollbar>
      </Dialog>
    </>
  );
}
