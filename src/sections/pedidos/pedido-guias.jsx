'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { FormGuia } from './pedido-form-guia';
import PedidoGuiasRow from './pedido-guias-row';

const Guias = ({ pedido, handleGetPedido }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ p: 2, pb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Guías:
        </Typography>

        <FormGuia pedido={pedido} handleGetPedido={handleGetPedido} />

        <Divider flexItem sx={{ borderStyle: 'dashed', my: 2 }} />

        {pedido?.guias?.length > 0 ? (
          <Stack
            divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
            spacing={{ xs: 2, md: 1 }}
          >
            {pedido?.guias.map((guia, index) => (
              <PedidoGuiasRow
                key={guia.id}
                guia={guia}
                handleGetPedido={handleGetPedido}
                setIsLoading={setIsLoading}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Sin guías registradas
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default Guias;
