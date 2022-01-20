import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AbcIcon from '@mui/icons-material/Abc';
import LensIcon from '@mui/icons-material/Lens';

export const SideBar = (props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: `calc(100% - ${props.drawerWidth}px)`,
          mr: `${props.drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component='main' sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {props.children}
      </Box>
      <Drawer
        sx={{
          width: props.drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: props.drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='permanent'
        anchor='right'
      >
        <Toolbar>
          <Typography variant='h6' noWrap component='div'>
            Details
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem key={'Alphabet'}>
            <ListItemIcon>
              <AbcIcon />
            </ListItemIcon>
            <ListItemText primary={props.alphabet} />
          </ListItem>
          <ListItem key={'Type'}>
            <ListItemIcon>
              <LensIcon />
            </ListItemIcon>
            <ListItemText primary={props.type} />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
};
