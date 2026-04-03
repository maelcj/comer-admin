import Link from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellProducto({ params }) {
  return (
    <Stack direction="column" alignItems="center" spacing={1} sx={{ py: 1 }}>
      <Link
        href={paths.dashboard.productos.edit(params.row.id)}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Stack direction="row" alignItems="center" sx={{ width: 1, cursor: 'pointer' }}>
          {params.row.imagenPrincipal.url ? (
            <Avatar
              alt={params.row.name}
              src={`${CONFIG.site.serverUrl}/${params.row.imagenPrincipal.url}`}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />
          ) : (
            <Avatar
              alt={params.row.name}
              src="/assets/images/product-icon.jpg"
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />
          )}

          <ListItemText
            disableTypography
            primary={params.row.nombre_final}
            sx={{ display: 'flex', flexDirection: 'column' }}
          />
        </Stack>
      </Link>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {params.row.categoriasNivel3.length === 0 && (
          <Label variant="soft" color="error">
            Sin categoría
          </Label>
        )}
        {params.row.visible === 'no' && (
          <Label variant="soft" color="error">
            No visible
          </Label>
        )}
        {params.row.disponible !== 'in stock' && (
          <Label variant="soft" color="error">
            Sin stock
          </Label>
        )}
      </Box>
    </Stack>
  );
}
