import latinize from 'latinize';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const Highlight = ({ children, highlightIndex }) => (
  <Box
    sx={{
      display: 'inline-block',
      backgroundColor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.4),
      color: 'white',
    }}
  >
    {children}
  </Box>
);

export function ResultItem({ search, element, onClickItem }) {
  const theme = useTheme();

  const [isOpen, setOpen] = useState(false);
  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <Box
        sx={{
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 1,
          borderColor: theme.vars.palette.primary.main,
          p: 0.5,
          px: 1,
          cursor: 'pointer',
        }}
      >
        <Box className={`${element.items.length > 5 && 'accordion'} ${isOpen && 'open'}`}>
          <Box onClick={onClickItem}>
            {element.items.map((item) => (
              <Typography
                variant="subtitle2"
                key={item.id}
                sx={{
                  color: item.color,
                  display: item.display,
                  ml: parseInt(item.ml, 10),
                }}
              >
                <Highlighter
                  highlightTag={Highlight}
                  searchWords={[search]}
                  autoEscape
                  sanitize={latinize}
                  textToHighlight={item.text}
                />
              </Typography>
            ))}
          </Box>

          {element.items.length > 5 && (
            <Box
              className="overflow"
              sx={{
                background: `linear-gradient(rgba(255, 255, 255, 0) 0%, ${theme.vars.palette.background.paper} 90%, ${theme.vars.palette.background.paper} 100%)`,
              }}
            >
              <Box
                className="btn"
                onClick={() => setOpen(!isOpen)}
                sx={{
                  width: '100%',
                  height: 20,
                  position: 'absolute',
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 0.5,
                  '&:hover': {
                    background: varAlpha(theme.vars.palette.primary.mainChannel, 0.1),
                  },
                }}
              >
                <Iconify icon="fa-solid:chevron-down" />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
}
