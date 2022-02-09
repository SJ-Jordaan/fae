import React, { useRef } from 'react';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Draggable from 'react-draggable';
import { useXarrow } from 'react-xarrows';

import { ContextMenu } from './ContextMenu';
import {
  entryNodeStyles,
  acceptingNodeStyles,
  regularNodeStyles,
} from '../constants';

const invisibleNodeStyles = {
  display: 'flex',
  margin: '0 24px 0 0',
};

const selfNode = {
  margin: '0 0 48px 48px',
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 0 48px',
            }}
          >
            <Box sx={selfNode} id={`self-${props.node?.label}`} />
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 0 48px',
            }}
          >
            <Box sx={selfNode} id={`self-${props.node?.label}`} />
            <ContextMenu contextMenuItems={props.contextMenuItems}>
              <Typography>{props.node.label}</Typography>
            </ContextMenu>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};
