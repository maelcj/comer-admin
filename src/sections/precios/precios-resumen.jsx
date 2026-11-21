'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { getResumenPrecios } from 'src/actions/precios';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PreciosResumen({
  filters,
  selectedComparativa = 'all',
  onSelectComparativa,
  refreshTrigger = 0,
}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_products: 0,
    total_comparable: 0,
    count_below: 0,
    count_above: 0,
    count_equal: 0,
    pct_below: 0,
    pct_above: 0,
    avg_pct_above: 0,
    avg_pct_below: 0,
  });

  const marca = filters?.marca;
  const type = filters?.type;
  const modelo = filters?.modelo;
  const soloConCompetidores = filters?.soloConCompetidores;

  useEffect(() => {
    let isMounted = true;
    const fetchResumen = async () => {
      setLoading(true);
      try {
        const res = await getResumenPrecios({
          marca,
          type,
          modelo,
          soloConCompetidores,
        });
        if (isMounted && res) {
          setData(res);
        }
      } catch (error) {
        console.error('Error fetching resumen precios:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResumen();

    return () => {
      isMounted = false;
    };
  }, [marca, type, modelo, soloConCompetidores, refreshTrigger]);

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* 1. Total Productos */}
      <Grid xs={12} sm={6} md={3}>
        <MetricCard
          title="Productos de la tienda"
          total={data.total_products}
          loading={loading}
          icon="solar:box-minimalistic-bold-duotone"
          color="primary"
          selected={selectedComparativa === 'all' || !selectedComparativa}
          onClick={onSelectComparativa ? () => onSelectComparativa('all') : undefined}
          subtitle={
            data.total_comparable > 0
              ? `${data.total_comparable.toLocaleString()} con precios de competencia`
              : 'Sin competidores con precio'
          }
        />
      </Grid>

      {/* 2. Precios por debajo de la competencia */}
      <Grid xs={12} sm={6} md={3}>
        <MetricCard
          title="Precios más bajos que competencia"
          total={data.count_below}
          loading={loading}
          icon="solar:arrow-down-bold-duotone"
          color="success"
          percentage={`${data.pct_below}%`}
          percentageLabel="de comparables"
          selected={selectedComparativa === 'below'}
          onClick={onSelectComparativa ? () => onSelectComparativa('below') : undefined}
          subtitle={
            data.count_below > 0
              ? `Promedio: ${data.avg_pct_below}% más barato`
              : 'Ninguno por debajo'
          }
        />
      </Grid>

      {/* 3. Precios por encima de la competencia */}
      <Grid xs={12} sm={6} md={3}>
        <MetricCard
          title="Precios más altos que competencia"
          total={data.count_above}
          loading={loading}
          icon="solar:arrow-up-bold-duotone"
          color="error"
          percentage={`${data.pct_above}%`}
          percentageLabel="de comparables"
          selected={selectedComparativa === 'above'}
          onClick={onSelectComparativa ? () => onSelectComparativa('above') : undefined}
          subtitle={
            data.count_above > 0
              ? `Promedio: +${data.avg_pct_above}% más caro`
              : 'Ninguno por encima'
          }
        />
      </Grid>

      {/* 4. Precios iguales a la competencia */}
      <Grid xs={12} sm={6} md={3}>
        <MetricCard
          title="Precios iguales a competencia"
          total={data.count_equal}
          loading={loading}
          icon="solar:scale-bold-duotone"
          color="info"
          selected={selectedComparativa === 'equal'}
          onClick={onSelectComparativa ? () => onSelectComparativa('equal') : undefined}
          subtitle={
            data.total_comparable > 0
              ? `${(
                  data.total_comparable > 0
                    ? ((data.count_equal / data.total_comparable) * 100).toFixed(1)
                    : 0
                )}% de comparables`
              : 'Sin datos'
          }
        />
      </Grid>
    </Grid>
  );
}

PreciosResumen.propTypes = {
  filters: PropTypes.shape({
    marca: PropTypes.string,
    type: PropTypes.string,
    modelo: PropTypes.string,
    soloConCompetidores: PropTypes.bool,
    comparativa: PropTypes.string,
  }),
  selectedComparativa: PropTypes.string,
  onSelectComparativa: PropTypes.func,
  refreshTrigger: PropTypes.number,
};

// ----------------------------------------------------------------------

function MetricCard({
  title,
  total,
  loading,
  icon,
  color = 'primary',
  percentage,
  percentageLabel,
  subtitle,
  selected = false,
  onClick,
}) {
  const theme = useTheme();
  const mainColor = theme.palette[color]?.main || theme.palette.primary.main;
  const lightColor = alpha(mainColor, 0.12);

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: (th) =>
          selected ? `0 0 0 2px ${mainColor}` : th.customShadows?.card || 1,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: (th) =>
          th.transitions.create(['box-shadow', 'transform', 'border-color', 'background-color'], {
            duration: th.transitions.duration.shorter,
          }),
        border: (th) =>
          selected ? `2px solid ${mainColor}` : `1px solid ${alpha(th.palette.grey[500], 0.2)}`,
        bgcolor: (th) =>
          selected ? alpha(mainColor, 0.05) : 'background.paper',
        '&:hover': {
          boxShadow: (th) =>
            selected
              ? `0 0 0 2px ${mainColor}, ${th.customShadows?.z8 || ''}`
              : th.customShadows?.z8 || 3,
          transform: onClick ? 'translateY(-2px)' : 'none',
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.85rem',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>

          {loading ? (
            <Skeleton variant="text" width={80} height={40} />
          ) : (
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: mainColor }}>
                {Number(total).toLocaleString()}
              </Typography>
              {percentage && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: mainColor,
                    fontWeight: 700,
                  }}
                >
                  ({percentage})
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            bgcolor: lightColor,
            color: mainColor,
            flexShrink: 0,
          }}
        >
          <Iconify icon={icon} width={28} />
        </Stack>
      </Stack>

      {/* Subtitle / Footer of card */}
      <Stack sx={{ mt: 1.5 }}>
        {loading ? (
          <Skeleton variant="text" width={140} height={20} />
        ) : (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

MetricCard.propTypes = {
  title: PropTypes.string,
  total: PropTypes.number,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  color: PropTypes.string,
  percentage: PropTypes.string,
  percentageLabel: PropTypes.string,
  subtitle: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};
