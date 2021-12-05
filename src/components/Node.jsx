import React, { useRef } from 'react';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Draggable from 'react-draggable';

import { ContextMenu } from './ContextMenu';

const boxStyles = {
  display: 'flex',
  borderRadius: '50%',
  borderColor: 'grey.500',
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: '3em',
  boxSizing: 'border-box',
  height: '3em',
};

const contextMenuItems = [
  {
    text: 'Duplicate',
    handleClick: () => console.log('Duplicated'),
  },
  {
    text: 'Link',
    handleClick: () => console.log('Linked'),
  },
  {
    text: 'Delete',
    handleClick: () => console.log('Deleted'),
  },
];

export const Node = (props) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <Box ref={nodeRef} sx={boxStyles}>
        <ContextMenu contextMenuItems={contextMenuItems}>
          <Typography>{props.label}</Typography>
        </ContextMenu>
      </Box>
    </Draggable>
  );
};
