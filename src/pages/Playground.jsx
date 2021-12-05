import React, { useState } from 'react';

import { Container } from '@mui/material';

import { Node, ContextMenu } from '../components';

const playgroundStyles = {
  height: '100%',
  width: '100%',
  minWidth: '100vw',
  boxSizing: 'border-box',
  padding: '24px',
};

export const Playground = (props) => {
  const [nodes, setNodes] = useState([]);

  const addNode = () => {
    const newNode = {
      label: `S${nodes.length + 1}`,
      isAccepting: false,
      position: { x: 0, y: 0 },
    };

    setNodes((prevState) => [...prevState, newNode]);
  };

  const NodeGrid = () => {
    return nodes.map((node, index) => (
      <Node key={`${node.label}-${index}`} label={node.label} />
    ));
  };

  const contextMenuItems = [
    {
      text: 'Add State',
      handleClick: addNode,
    },
  ];

  return (
    <ContextMenu contextMenuItems={contextMenuItems}>
      <Container sx={playgroundStyles}>
        <NodeGrid />
      </Container>
    </ContextMenu>
  );
};
