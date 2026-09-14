import dynamic from 'next/dynamic';
import { memo, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// Carga dinámica para evitar SSR (react-simple-maps usa APIs del navegador)
const ComposableMap = dynamic(() => import('react-simple-maps').then((mod) => mod.ComposableMap), {
  ssr: false,
});
const ZoomableGroup = dynamic(() => import('react-simple-maps').then((mod) => mod.ZoomableGroup), {
  ssr: false,
});
const Geographies = dynamic(() => import('react-simple-maps').then((mod) => mod.Geographies), {
  ssr: false,
});
const Geography = dynamic(() => import('react-simple-maps').then((mod) => mod.Geography), {
  ssr: false,
});
const Marker = dynamic(() => import('react-simple-maps').then((mod) => mod.Marker), { ssr: false });

// URL pública de TopoJSON del mundo
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Coordenadas de ciudades mexicanas y centroides de países comunes
const CITY_COORDS = {
  // México — Ciudad de México
  'Mexico|Ciudad de Mexico': [-99.1332, 19.4326],
  'Mexico|Mexico City': [-99.1332, 19.4326],

  // México — Morelos
  'Mexico|Cuernavaca': [-99.2216, 18.9242],
  'Mexico|Jiutepec': [-99.1817, 18.8836],
  'Mexico|Cuautla': [-98.9547, 18.8126],
  'Mexico|Yautepec': [-99.0667, 18.8833],
  'Mexico|Temixco': [-99.2256, 18.8528],
  'Mexico|Jojutla': [-99.1811, 18.6147],
  'Mexico|Tepoztlan': [-99.1013, 18.9847],

  // México — Jalisco
  'Mexico|Guadalajara': [-103.3496, 20.6597],
  'Mexico|Zapopan': [-103.3918, 20.7169],
  'Mexico|Tlaquepaque': [-103.3078, 20.6401],
  'Mexico|Tonalá': [-103.2346, 20.624],
  'Mexico|Puerto Vallarta': [-105.2253, 20.6534],
  'Mexico|Lagos de Moreno': [-101.9296, 21.3569],
  'Mexico|Tepatitlan': [-102.7637, 20.8139],
  'Mexico|Ocotlan': [-102.7687, 20.3507],
  'Mexico|Ciudad Guzman': [-103.4617, 19.705],

  // México — Nuevo León
  'Mexico|Monterrey': [-100.3161, 25.6866],
  'Mexico|San Nicolas de los Garza': [-100.3031, 25.747],
  'Mexico|Guadalupe': [-100.2524, 25.6775],
  'Mexico|Apodaca': [-100.187, 25.781],
  'Mexico|Santa Catarina': [-100.4582, 25.6732],
  'Mexico|San Pedro Garza Garcia': [-100.4024, 25.6572],
  'Mexico|Linares': [-99.5678, 24.8578],

  // México — Puebla
  'Mexico|Puebla': [-98.2063, 19.0414],
  'Mexico|Tehuacan': [-97.3919, 18.4614],
  'Mexico|Atlixco': [-98.4294, 18.9082],
  'Mexico|San Martin Texmelucan': [-98.4353, 19.2847],
  'Mexico|Cholula': [-98.302, 19.0647],
  'Mexico|Huauchinango': [-98.0528, 20.1733],

  // México — Estado de México
  'Mexico|Toluca': [-99.6557, 19.2826],
  'Mexico|Ecatepec': [-99.0606, 19.6049],
  'Mexico|Naucalpan': [-99.2381, 19.4785],
  'Mexico|Tlalnepantla': [-99.195, 19.5401],
  'Mexico|Nezahualcoyotl': [-99.0333, 19.4],
  'Mexico|Chimalhuacan': [-98.9547, 19.4219],
  'Mexico|Texcoco': [-98.8819, 19.5119],
  'Mexico|Metepec': [-99.5939, 19.2593],
  'Mexico|Atlacomulco': [-99.8761, 19.7983],
  'Mexico|Valle de Bravo': [-100.1328, 19.1925],

  // México — Guanajuato
  'Mexico|Leon': [-101.6821, 21.1221],
  'Mexico|Celaya': [-100.8116, 20.5236],
  'Mexico|Irapuato': [-101.3502, 20.6768],
  'Mexico|Guanajuato': [-101.2574, 21.019],
  'Mexico|Salamanca': [-101.1911, 20.5719],
  'Mexico|San Miguel de Allende': [-100.7467, 20.9144],
  'Mexico|Silao': [-101.427, 20.9431],
  'Mexico|Dolores Hidalgo': [-100.9375, 21.1561],

  // México — Querétaro
  'Mexico|Queretaro': [-100.3899, 20.5888],
  'Mexico|San Juan del Rio': [-99.9969, 20.3889],
  'Mexico|Corregidora': [-100.4397, 20.5486],
  'Mexico|El Marques': [-100.3286, 20.6258],

  // México — Michoacán
  'Mexico|Morelia': [-101.1847, 19.7006],
  'Mexico|Uruapan': [-102.0627, 19.4112],
  'Mexico|Zamora': [-102.2839, 19.9855],
  'Mexico|Lazaro Cardenas': [-102.1933, 17.9583],
  'Mexico|Patzcuaro': [-101.6097, 19.5133],

  // México — Veracruz
  'Mexico|Veracruz': [-96.1342, 19.1738],
  'Mexico|Xalapa': [-96.9102, 19.5438],
  'Mexico|Coatzacoalcos': [-94.4165, 18.1457],
  'Mexico|Minatitlan': [-94.5544, 17.9939],
  'Mexico|Poza Rica': [-97.4606, 20.5331],
  'Mexico|Cordoba': [-96.9277, 18.8942],
  'Mexico|Orizaba': [-97.0994, 18.8497],
  'Mexico|Boca del Rio': [-96.1036, 19.1031],

  // México — Oaxaca
  'Mexico|Oaxaca': [-96.7266, 17.0732],
  'Mexico|Salina Cruz': [-95.1997, 16.167],
  'Mexico|Juchitan': [-95.0197, 16.433],
  'Mexico|Tuxtepec': [-96.1244, 18.0883],
  'Mexico|Puerto Escondido': [-97.0719, 15.8719],
  'Mexico|Huatulco': [-96.3217, 15.7833],

  // México — Yucatán
  'Mexico|Merida': [-89.5926, 20.9674],
  'Mexico|Valladolid': [-88.2033, 20.6897],
  'Mexico|Progreso': [-89.6636, 21.2833],
  'Mexico|Tizimin': [-88.15, 21.1422],

  // México — Quintana Roo
  'Mexico|Cancun': [-86.8515, 21.1619],
  'Mexico|Playa del Carmen': [-87.0739, 20.6296],
  'Mexico|Chetumal': [-88.2961, 18.5],
  'Mexico|Cozumel': [-86.9458, 20.5083],
  'Mexico|Tulum': [-87.4658, 20.2119],

  // México — Tabasco
  'Mexico|Villahermosa': [-92.9475, 17.9869],
  'Mexico|Cardenas': [-93.3744, 17.9889],
  'Mexico|Comalcalco': [-93.2231, 18.2631],

  // México — Chiapas
  'Mexico|Tuxtla Gutierrez': [-93.1151, 16.7528],
  'Mexico|Tapachula': [-92.2608, 14.9039],
  'Mexico|San Cristobal de las Casas': [-92.6376, 16.737],

  // México — Sinaloa
  'Mexico|Culiacan': [-107.394, 24.7994],
  'Mexico|Mazatlan': [-106.4169, 23.2494],
  'Mexico|Los Mochis': [-108.9858, 25.7903],
  'Mexico|Guasave': [-108.465, 25.5672],

  // México — Sonora
  'Mexico|Hermosillo': [-110.9559, 29.0729],
  'Mexico|Ciudad Obregon': [-109.9304, 27.4864],
  'Mexico|Nogales': [-110.9422, 31.3086],
  'Mexico|San Luis Rio Colorado': [-114.7767, 32.4561],
  'Mexico|Navojoa': [-109.4437, 27.0742],

  // México — Baja California
  'Mexico|Tijuana': [-117.0382, 32.5149],
  'Mexico|Mexicali': [-115.4523, 32.6245],
  'Mexico|Ensenada': [-116.5964, 31.8667],
  'Mexico|Tecate': [-116.6281, 32.5667],

  // México — Baja California Sur
  'Mexico|La Paz': [-110.3128, 24.1426],
  'Mexico|Los Cabos': [-109.9167, 22.9],
  'Mexico|Cabo San Lucas': [-109.9167, 22.8905],

  // México — Chihuahua
  'Mexico|Chihuahua': [-106.089, 28.6353],
  'Mexico|Ciudad Juarez': [-106.4245, 31.6904],
  'Mexico|Delicias': [-105.4703, 28.1892],
  'Mexico|Cuauhtemoc': [-106.8656, 28.4089],

  // México — Coahuila
  'Mexico|Saltillo': [-100.9994, 25.4232],
  'Mexico|Torreon': [-103.4068, 25.5428],
  'Mexico|Monclova': [-101.4206, 26.9064],
  'Mexico|Piedras Negras': [-100.5235, 28.7001],
  'Mexico|Ciudad Acuna': [-100.9325, 29.3232],

  // México — Tamaulipas
  'Mexico|Tampico': [-97.8611, 22.2331],
  'Mexico|Ciudad Victoria': [-99.1411, 23.7369],
  'Mexico|Reynosa': [-98.2761, 26.0922],
  'Mexico|Matamoros': [-97.5046, 25.8693],
  'Mexico|Nuevo Laredo': [-99.5166, 27.4761],

  // México — San Luis Potosí
  'Mexico|San Luis Potosi': [-100.9855, 22.1565],
  'Mexico|Ciudad Valles': [-99.0189, 21.9833],
  'Mexico|Matehuala': [-100.6444, 23.6489],

  // México — Hidalgo
  'Mexico|Pachuca': [-98.7624, 20.1011],
  'Mexico|Tulancingo': [-98.365, 20.0833],
  'Mexico|Tula': [-99.3436, 20.0511],

  // México — Guerrero
  'Mexico|Acapulco': [-99.8237, 16.8531],
  'Mexico|Chilpancingo': [-99.5007, 17.5506],
  'Mexico|Iguala': [-99.5397, 18.3447],
  'Mexico|Zihuatanejo': [-101.5511, 17.6433],

  // México — Colima
  'Mexico|Colima': [-103.7241, 19.2433],
  'Mexico|Manzanillo': [-104.3158, 19.1167],
  'Mexico|Tecoman': [-103.8769, 18.9114],

  // México — Nayarit
  'Mexico|Tepic': [-104.8946, 21.5042],
  'Mexico|Bahia de Banderas': [-105.2508, 20.7583],
  'Mexico|Compostela': [-104.9017, 21.2378],

  // México — Zacatecas
  'Mexico|Zacatecas': [-102.5528, 22.7709],
  'Mexico|Fresnillo': [-102.8711, 23.1747],
  'Mexico|Jerez': [-102.9908, 22.65],

  // México — Durango
  'Mexico|Durango': [-104.6532, 24.0277],
  'Mexico|Gomez Palacio': [-103.4967, 25.5611],
  'Mexico|Lerdo': [-103.5281, 25.5439],

  // México — Aguascalientes
  'Mexico|Aguascalientes': [-102.2916, 21.8818],
  'Mexico|Calvillo': [-102.7186, 21.8456],

  // México — Campeche
  'Mexico|Campeche': [-90.5349, 19.8301],
  'Mexico|Ciudad del Carmen': [-91.8297, 18.6456],

  // México — Tlaxcala
  'Mexico|Tlaxcala': [-98.2377, 19.3182],
  'Mexico|Apizaco': [-98.1436, 19.4153],

  // México — Quintana Roo / turismo
  'Mexico|Isla Mujeres': [-86.7311, 21.2328],

  // México — ciudades adicionales
  'Mexico|Tepatitlan de Morelos': [-102.7637, 20.8139],
  'Mexico|Autlan de Navarro': [-104.3667, 19.7667],
};

// Centroides de países (fallback cuando city está vacío)
const COUNTRY_COORDS = {
  Mexico: [-102.5528, 23.6345],
  'United States': [-98.5795, 39.8283],
  Canada: [-106.3468, 56.1304],
  Colombia: [-74.2973, 4.5709],
  Argentina: [-63.6167, -38.4161],
  Brazil: [-51.9253, -14.235],
  Spain: [-3.7038, 40.4168],
  Chile: [-71.543, -35.6751],
  Peru: [-75.0152, -9.19],
  Guatemala: [-90.2308, 15.7835],
  Ecuador: [-78.1834, -1.8312],
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

function getCoordinates(country, city) {
  if (city) {
    const key = `${country}|${city}`;
    if (CITY_COORDS[key]) return CITY_COORDS[key];
  }
  if (COUNTRY_COORDS[country]) return COUNTRY_COORDS[country];
  return [-102.5528, 23.6345];
}

function getLocationLabel(country, city) {
  if (city) return `${city}, ${country}`;
  return country;
}

// ----------------------------------------------------------------------

function IndexAnalyticsMap({ locations }) {
  const theme = useTheme();
  const [position, setPosition] = useState({ coordinates: [-100, 24], zoom: 1 });

  const markers = useMemo(
    () =>
      (locations || [])
        .filter((loc) => loc.city && loc.city.trim() !== '' && loc.city !== '(not set)')
        .map((loc, idx) => ({
          id: `${loc.country}-${loc.city}-${idx}`,
          coordinates: getCoordinates(loc.country, loc.city),
          label: getLocationLabel(loc.country, loc.city),
          activeUsers: loc.activeUsers,
        })),
    [locations]
  );

  const maxUsers = useMemo(() => Math.max(...markers.map((m) => m.activeUsers), 1), [markers]);

  const handleZoomIn = () => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * 1.5, MAX_ZOOM),
    }));
  };

  const handleZoomOut = () => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / 1.5, MIN_ZOOM),
    }));
  };

  const handleMoveEnd = (pos) => {
    setPosition(pos);
  };

  // Colores del gradiente del océano según el tema
  const isDark = theme.palette.mode === 'dark';
  const oceanColor = isDark ? '#0d1b2a' : '#e8f4f8';
  const landFill = isDark ? alpha(theme.palette.primary.light, 0.35) : '#b2d8d8';
  const landStroke = isDark
    ? alpha(theme.palette.primary.light, 0.45)
    : alpha(theme.palette.primary.main, 0.4);
  const landHover = isDark ? alpha(theme.palette.primary.light, 0.5) : '#8ec4c4';

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardHeader
        title="Ubicaciones"
        sx={{ pb: 0 }}
      />



      <Box sx={{ px: 0.5, pb: 0.5, pt: 0 }}>
        {markers.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: 360, color: 'text.secondary' }}
          >
            <Iconify icon="mdi:map-marker-off-outline" width={40} sx={{ mb: 1, opacity: 0.4 }} />
            <Typography variant="body2">Sin datos de ubicación</Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: oceanColor,
              transition: 'background-color 0.3s',
            }}
          >
            <ComposableMap
              projectionConfig={{ rotate: [100, 0, 0], scale: 600, center: [0, 24] }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={landFill}
                        stroke={landStroke}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.2s ease' },
                          hover: { outline: 'none', fill: landHover, cursor: 'grab' },
                          pressed: { outline: 'none', cursor: 'grabbing' },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {markers.map((marker) => {
                  const baseRadius = Math.max(5, (marker.activeUsers / maxUsers) * 16);
                  // Escalar el radio inversamente al zoom para que se vea consistente
                  const radius = baseRadius / Math.sqrt(position.zoom);
                  const pingRadius = radius * 2.5;

                  return (
                    <Marker key={marker.id} coordinates={marker.coordinates}>
                      <Tooltip
                        title={
                          <Stack spacing={0.25} sx={{ py: 0.25 }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem' }}>
                              {marker.label}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.85 }}>
                              {marker.activeUsers} usuario{marker.activeUsers !== 1 ? 's' : ''}{' '}
                              activo{marker.activeUsers !== 1 ? 's' : ''}
                            </Typography>
                          </Stack>
                        }
                        arrow
                        placement="top"
                      >
                        <g style={{ cursor: 'pointer' }}>
                          {/* Anillo de ping animado (CSS) */}
                          <circle
                            cx={0}
                            cy={0}
                            r={pingRadius}
                            fill={theme.palette.primary.main}
                            style={{
                              animation: 'mapPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                              transformOrigin: '0px 0px',
                            }}
                          />
                          {/* Punto exterior para separar */}
                          <circle r={radius + 1.5 / Math.sqrt(position.zoom)} fill={oceanColor} />
                          {/* Punto principal del marcador */}
                          <circle r={radius} fill={theme.palette.primary.main} />
                          {/* Punto central interno para detalle visual */}
                          <circle
                            r={radius * 0.4}
                            fill={theme.palette.common.white}
                            opacity={0.8}
                          />
                        </g>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Keyframes para la animación ping */}
            <style>{`
              @keyframes mapPing {
                0% {
                  transform: scale(0.3);
                  opacity: 0.8;
                }
                80% {
                  transform: scale(1);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 0;
                }
              }
            `}</style>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default memo(IndexAnalyticsMap);
