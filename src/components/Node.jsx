import React, { useRef } from 'react';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

import { ContextMenu } from './ContextMenu';

const regularNodeStyles = {
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

const acceptingNodeStyles = {
  border: '4px double black',
};

const entryNodeStyles = {
  display: 'flex',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100px',
  alignItems: 'center',
};

const invisibleNodeStyles = {
  display: 'flex',
  margin: '0 24px 0 0',
};

export const Node = (props) => {
  const nodeRef = useRef(null);
  const updateXarrow = useXarrow();

  const handleDrag = (e) => {
    updateXarrow(e);
  };

  const handleStop = (e, data) => {
    updateXarrow(e);
    props.updateNode(props.index, {
      ...props.node,
      position: { x: data.x, y: data.y },
    });
  };

  const handleClick = () => {
    props.onClick();
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds={'parent'}
      position={props.node.position}
      onStop={handleStop}
      onDrag={handleDrag}
      onMouseDown={handleClick}
    >
      {props.node.isStarting ? (
        <Box ref={nodeRef} sx={entryNodeStyles}>
          <Box sx={invisibleNodeStyles} id={'entryNode'} />
          <Box
            sx={
              props.node.isAccepting
                ? { ...regularNodeStyles, ...acceptingNodeStyles }
                : regularNodeStyles
            }
            id={props.node.label}
          >
            <ContextMenu contextMenuItems={props.contextMenuItems}>
              <Typography>{props.node.label}</Typography>
            </ContextMenu>
          </Box>
        </Box>
      ) : (
        <Box
          ref={nodeRef}
          id={props.node.label}
          sx={
            props.node.isAccepting
              ? { ...regularNodeStyles, ...acceptingNodeStyles }
              : regularNodeStyles
          }
        >
          <ContextMenu contextMenuItems={props.contextMenuItems}>
            <Typography>{props.node.label}</Typography>
          </ContextMenu>
        </Box>
      )}
    </Draggable>
  );
};
