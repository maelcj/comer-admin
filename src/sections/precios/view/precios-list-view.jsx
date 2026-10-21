'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PreciosTable } from '../precios-table';
import { PreciosResumen } from '../precios-resumen';
import { PreciosFiltros } from '../precios-filtros';
import { PreciosDetailsDialog } from '../precios-details-dialog';
import { PreciosCompetidoresTable } from '../precios-competidores-table';
import { PreciosCompetidoresFiltros } from '../precios-competidores-filtros';

// ----------------------------------------------------------------------

export function PreciosListView() {
  const [currentTab, setCurrentTab] = useState('monitoreo');

  // Filtros para la pestaña de monitoreo
  const [filters, setFilters] = useState({
    marca: '',
    type: '',
    modelo: '',
    soloConCompetidores: false,
  });
  const [debounceFilters] = useDebounce(filters, 400);

  // Filtros para la pestaña de URLs de competencia
  const [competidoresFilters, setCompetidoresFilters] = useState({
    marca: '',
    type: '',
    modelo: '',
    soloSinCompetidores: false,
  });
  const [debounceCompetidoresFilters] = useDebounce(competidoresFilters, 400);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <PreciosDetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetails}
        product={selectedProduct}
      />

      <DashboardContent>
        <CustomBreadcrumbs
          heading="Monitoreo de Precios"
          links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'Precios' }]}
          sx={{ mb: 3 }}
        />

        {/* Pestañas de Navegación */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.background.neutral}`,
            }}
          >
            <Tab
              value="monitoreo"
              label="Monitoreo y Comparativa"
              icon={<Iconify icon="solar:chart-square-bold-duotone" width={22} />}
              iconPosition="start"
            />
            <Tab
              value="competidores"
              label="URLs de la Competencia"
              icon={<Iconify icon="solar:link-circle-bold-duotone" width={22} />}
              iconPosition="start"
            />
          </Tabs>
        </Card>

        {/* Pestaña 1: Monitoreo */}
        {currentTab === 'monitoreo' && (
          <>
            {/* 1. Resumen analítico */}
            <PreciosResumen filters={debounceFilters} />

            {/* 2. Filtros de monitoreo */}
            <PreciosFiltros filters={filters} onFiltersChange={setFilters} />

            {/* 3. Tabla de monitoreo */}
            <PreciosTable filters={debounceFilters} onOpenDetails={handleOpenDetails} />
          </>
        )}

        {/* Pestaña 2: Administrar URLs de la Competencia */}
        {currentTab === 'competidores' && (
          <>
            {/* Filtros específicos de administración de URLs */}
            <PreciosCompetidoresFiltros
              filters={competidoresFilters}
              onFiltersChange={setCompetidoresFilters}
            />

            {/* Tabla para administrar URLs de competencia */}
            <PreciosCompetidoresTable filters={debounceCompetidoresFilters} />
          </>
        )}
      </DashboardContent>
    </>
  );
}
