import React, { useEffect, useState } from 'react';

import { Container } from '@mui/material';
import Xarrow, { Xwrapper } from 'react-xarrows';

import { Node, ContextMenu } from '../components';

const playgroundStyles = {
  height: '100%',
  width: '100%',
  minWidth: '100vw',
  boxSizing: 'border-box',
  padding: '24px',
};

const arrowStyles = {
  color: 'black',
  strokeWidth: 2,
};

export const Playground = (props) => {
  const [nodes, setNodes] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [newTransition, setNewTransition] = useState(null);

  const addFirstNode = (e) => {
    const newNode = {
      label: 'S0',
      isStarting: true,
      isAccepting: false,
      position: { x: 0, y: 0 },
    };

    const newTransition = {
      start: 'entryNode',
      end: 'S0',
    };

    setNodes([newNode]);
    setTransitions([newTransition]);
  };

  const addNode = (e) => {
    // const nodeX = e.clientX - e.target.offsetLeft;
    // const nodeY = e.clientY - e.target.offsetTop;

    if (nodes.length === 0) {
      addFirstNode(e);
      return;
    }

    const newNode = {
      label: `S${nodes.length}`,
      isAccepting: false,
      position: { x: 0, y: 0 },
    };

    setNodes((prevState) => [...prevState, newNode]);
  };

  const updateNode = (index, node) => {
    const newNodes = [...nodes];
    newNodes[index] = node;
    setNodes(newNodes);
  };

  const deleteNode = (oldNode) => {
    const newNodes = nodes.filter((node) => node.label !== oldNode.label);
    setNodes(newNodes);
  };

  const handleNodeClick = (node) => {
    if (!newTransition) {
      return;
    }

    setNewTransition((prevState) => ({ ...prevState, end: node.label }));
  };

  const startAddingTransition = (node) => {
    setNewTransition({
      start: node.label,
      end: null,
      value: 0,
    });
  };

  const Grid = () => {
    const nodeGrid = nodes.map((node, index) => {
      const typeContextMenuItem = node.isAccepting
        ? {
            text: 'Make Non-accepting State',
            handleClick: () =>
              updateNode(index, { ...node, isAccepting: false }),
          }
        : {
            text: 'Make Accepting State',
            handleClick: () =>
              updateNode(index, { ...node, isAccepting: true }),
          };

      const nodeContextMenuItems = [
        typeContextMenuItem,
        {
          text: 'Add Transition',
          handleClick: () => startAddingTransition(node),
        },
        {
          text: 'Delete',
          handleClick: () => deleteNode(node),
        },
      ];

      return (
        <Node
          key={`${node.label}-${index}`}
          updateNode={updateNode}
          onClick={() => handleNodeClick(node)}
          contextMenuItems={nodeContextMenuItems}
          index={index}
          node={node}
        />
      );
    });

    const transitionGrid = transitions.map((transition, index) => (
      <Xarrow
        key={`${transition.start}-${transition.end}-${index}`}
        {...transition}
        {...arrowStyles}
      />
    ));

    return [...nodeGrid, ...transitionGrid];
  };

  const contextMenuItems = [
    {
      text: 'Add State',
      handleClick: (e) => addNode(e),
    },
  ];

  return (
    <ContextMenu contextMenuItems={contextMenuItems}>
      <Container sx={playgroundStyles}>
        <Xwrapper>
          <Grid />
        </Xwrapper>
      </Container>
    </ContextMenu>
  );
};
