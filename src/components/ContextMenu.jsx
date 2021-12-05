import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import { useContextMenu } from '../hooks';
import { Menu } from '@mui/material';
import { Box } from '@mui/system';

const contextMenuStyles = {
  cursor: 'context-menu',
  display: 'flex',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export const ContextMenu = (props) => {
  const [contextMenu, handleContextMenu, handleClose] = useContextMenu();

  return (
    <Box sx={contextMenuStyles} onContextMenu={handleContextMenu}>
      {props.children}

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference='anchorPosition'
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {props.contextMenuItems?.map((item, index) => (
          <MenuItem
            key={`menuItem-${index}`}
            onMouseDown={(e) => {
              item.handleClick(e);
              handleClose();
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
