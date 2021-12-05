import React, { useState } from 'react';

import { Container } from '@mui/material';
import Xarrow, { Xwrapper } from 'react-xarrows';

import { Node, ContextMenu, TrackingBox, TransitionModal } from '../components';
import { StorageProvider } from '../providers';
import { CACHE_KEYS } from '../constants';

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
  const [nodes, setNodes] = useState(
    StorageProvider.getItem(CACHE_KEYS.NODES) || [],
  );
  const [transitions, setTransitions] = useState(
    StorageProvider.getItem(CACHE_KEYS.TRANSITIONS) || [],
  );
  const [newTransition, setNewTransition] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

    if (oldNode.isStarting && nodes.length !== 1) {
      newNodes[0].isStarting = true;
      const newTransitions = [...transitions];
      newTransitions[0].end = newNodes[0].label;
      setTransitions(newTransitions);
    }

    const newTransitions = transitions.filter(
      (t) => t.start !== oldNode.label && t.end !== oldNode.label,
    );

    setNodes(newNodes);
    setTransitions(newTransitions);
  };

  const deleteTransition = (transition) => {
    const originalTransitions = transitions.filter((t) => t !== transition);

    setTransitions(originalTransitions);
  };

  const updateTransition = (oldTransition, newTransition) => {
    const originalTransitions = transitions.filter((t) => t !== oldTransition);

    setTransitions([...originalTransitions, newTransition]);
  };

  const handleNodeClick = (node) => {
    if (!newTransition) {
      return;
    }

    const originalTransitions = transitions.filter(
      (t) => t.end !== 'mouseTracker',
    );

    const updatedTransition = transitions[transitions.length - 1];
    updatedTransition.end = node.label;

    setNewTransition(null);
    setShowModal(true);
    setTransitions([...originalTransitions, updatedTransition]);
  };

  const startAddingTransition = (node) => {
    const tempTransition = {
      start: node.label,
      end: 'mouseTracker',
      value: 0,
    };

    setNewTransition(tempTransition);

    setTransitions((prevState) => [...prevState, tempTransition]);
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

  const saveProgress = () => {
    StorageProvider.setItem(CACHE_KEYS.NODES, nodes, true);
    StorageProvider.setItem(CACHE_KEYS.TRANSITIONS, transitions, true);
  };

  const clearCanvas = () => {
    setTransitions([]);
    setNodes([]);
  };

  const contextMenuItems = [
    {
      text: 'Add State',
      handleClick: (e) => addNode(e),
    },
    {
      text: 'Save Progress',
      handleClick: saveProgress,
    },
    {
      text: 'Clear Canvas',
      handleClick: clearCanvas,
    },
  ];

  return (
    <ContextMenu contextMenuItems={contextMenuItems}>
      <Container sx={playgroundStyles}>
        <Xwrapper>
          {newTransition && <TrackingBox />}
          <Grid />
          <TransitionModal
            showModal={showModal}
            transition={transitions[transitions.length - 1]}
            onSubmit={(oldT, newT) => {
              updateTransition(oldT, newT);
              setShowModal(false);
              setNewTransition(null);
            }}
            onClose={(t) => {
              setShowModal(false);
              deleteTransition(t);
              setNewTransition(null);
            }}
          />
        </Xwrapper>
      </Container>
    </ContextMenu>
  );
};
