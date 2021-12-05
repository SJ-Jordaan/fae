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
  backgroundColor: 'white',
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

  const handleStop = (e, data) => {
    props.updateNode(props.index, {
      ...props.node,
      position: { x: data.x, y: data.y },
    });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      // onDrag={handleDrag}
      onStop={handleStop}
      bounds={'parent'}
      position={props.node.position}
    >
      <Box ref={nodeRef} sx={boxStyles}>
        <ContextMenu contextMenuItems={contextMenuItems}>
          <Typography>{props.node.label}</Typography>
        </ContextMenu>
      </Box>
    </Draggable>
  );
};
