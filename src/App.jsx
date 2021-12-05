import { Box } from '@mui/system';
import React from 'react';
import { Playground } from './pages';

const appStyles = {
  display: 'flex',
  height: '100%',
};

export const App = () => {
  return (
    <Box sx={appStyles}>
      <Playground />
    </Box>
  );
};
