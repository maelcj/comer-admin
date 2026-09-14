import { memo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

function IndexAnalyticsPages({ pages }) {
  const theme = useTheme();

  if (!pages || pages.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Páginas más vistas" />
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: 200, color: 'text.secondary' }}
        >
          <Typography variant="body2">Sin datos de páginas</Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Páginas visitadas" sx={{ pb: 1, flexShrink: 0 }} />

      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: { xs: 376, md: 0 } }}>
        <Scrollbar sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Stack sx={{ px: 3, pb: 2 }} spacing={0}>
            {pages.map((page, idx) => (
              <Stack
                key={page.pageTitle}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  py: 1.25,
                  borderBottom:
                    idx < pages.length - 1 ? `1px dashed ${theme.palette.divider}` : 'none',
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon="mdi:file-document-outline" width={16} />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    wordBreak: 'break-word',
                    py: 0.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {page.pageTitle}
                </Typography>

                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.75,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {page.views}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Scrollbar>
      </Box>
    </Card>
  );
}

export default memo(IndexAnalyticsPages);
