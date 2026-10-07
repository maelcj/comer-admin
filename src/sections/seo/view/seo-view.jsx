'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SeoCategoriasTable } from '../seo-categorias-table';

export default function SeoView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="SEO"
        links={[{ name: 'Inicio', href: paths.dashboard.root }, { name: 'SEO' }]}
        sx={{ mb: 3 }}
      />

      <SeoCategoriasTable />
    </DashboardContent>
  );
}
