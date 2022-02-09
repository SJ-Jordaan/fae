import React, { useState } from 'react';

import { Container, Typography } from '@mui/material';
import Xarrow, { Xwrapper } from 'react-xarrows';

import {
  Node,
  ContextMenu,
  TrackingBox,
  TransitionModal,
  SideBar,
  AutomatonModal,
} from '../components';
import { StorageProvider } from '../providers';
import { CACHE_KEYS } from '../constants';
import { generateDFA, parseAutomatonSchematic } from '../helpers/automaton';
import { GraphVisualisation } from './Graphviz';

const drawerWidth = 240;

const playgroundStyles = {
  height: '100%',
  width: '100%',
  minWidth: `calc(100vw - ${drawerWidth}px)`,
  boxSizing: 'border-box',
  padding: '24px',
};

const arrowStyles = {
  color: 'black',
  strokeWidth: 2,
  path: 'straight',
};

export const Playground = (props) => {
  const [nodes, setNodes] = useState(
    StorageProvider.getItem(CACHE_KEYS.NODES) || [],
  );
  const [transitions, setTransitions] = useState(
    StorageProvider.getItem(CACHE_KEYS.TRANSITIONS) || [],
  );
  const [newTransition, setNewTransition] = useState(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [automaton, setAutomaton] = useState(null);
  const [showAutomatonModal, setShowAutomatonModal] = useState(
    automaton === null,
  );
  const [prettify, setPrettify] = useState(false);

  const defineAutomaton = (
    mode,
    alphabet,
    type,
    nodeCount,
    transitionCount,
    finalCount = 1,
  ) => {
    const automatonDetails = {
      mode,
      alphabet,
      type,
      nodeCount,
      transitionCount,
      finalCount,
    };

    setAutomaton(automatonDetails);

    if (mode === 1) {
      generateAutomaton(automatonDetails);
      setShowAutomatonModal(false);
      return;
    }

    addFirstNode();
    setShowAutomatonModal(false);
  };

  const generateAutomaton = (automatonDetails) => {
    if (automatonDetails.type === 'DFA') {
      const schematic = generateDFA(
        automatonDetails.nodeCount,
        automatonDetails.alphabet,
        automatonDetails.finalCount,
      );

      const { nodes, transitions } = parseAutomatonSchematic(schematic);
      setNodes(nodes);
      setTransitions(transitions);

      return;
    }
  };

  const addFirstNode = () => {
    const newNode = {
      label: `S0`,
      isStarting: true,
      isAccepting: false,
      position: { x: 0, y: 0 },
    };

    const newTransition = {
      start: 'entryNode',
      end: `S0`,
    };

    setNodes([newNode]);
    setTransitions([newTransition]);
  };

  const addNodeManually = (e) => {
    if (nodes.length === 0) {
      addFirstNode();
      return;
    }
    let searching = true;
    let newLabel = 0;

    do {
      let i;
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].label === `S${newLabel}`) {
          newLabel++;
          break;
        }
      }

      if (i === nodes.length) {
        searching = false;
      }
    } while (searching);

    const newNode = {
      label: `S${newLabel}`,
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

    let duplicate = false;
    const updatedTransitions = originalTransitions.flatMap((t) => {
      if (t.start === newTransition.start && t.end === newTransition.end) {
        duplicate = true;

        return {
          ...t,
          value: [t.value, newTransition.value],
          labels: (
            <Typography
              bgcolor={'white'}
            >{`${t.value},${newTransition.value}`}</Typography>
          ),
        };
      }

      return t;
    });

    if (duplicate) {
      setTransitions(updatedTransitions);
      return;
    }

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
    setShowTransitionModal(true);
    setTransitions([...originalTransitions, updatedTransition]);
  };

  const startAddingTransition = (node) => {
    const tempTransition = {
      start: node.label,
      end: 'mouseTracker',
      value: [0],
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

    const transitionGrid = transitions.map((transition, index) => {
      if (transition.start === transition.end) {
        return (
          <>
            <Xarrow
              key={`${transition.start}-self-${index}`}
              start={`self-${transition.start}`}
              end={transition.end}
              curveness={0}
              endAnchor='top'
              startAnchor='top'
              {...arrowStyles}
            />
            <Xarrow
              key={`${transition.start}-${transition.end}-${index}`}
              start={transition.start}
              labels={transition.labels}
              curveness={0.3}
              end={`self-${transition.end}`}
              startAnchor='right'
              showHead={false}
              endAnchor='top'
              {...arrowStyles}
            />
          </>
        );
      }

      return (
        <Xarrow
          key={`${transition.start}-${transition.end}-${index}`}
          {...transition}
          {...arrowStyles}
        />
      );
    });

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
      handleClick: (e) => addNodeManually(e),
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
    <SideBar
      drawerWidth={drawerWidth}
      title={'Finite Automata Editor'}
      alphabet={automaton?.alphabet?.join(',')}
      type={automaton?.type}
      handlePrettify={() => setPrettify(!prettify)}
    >
      {prettify ? (
        <GraphVisualisation nodes={nodes} transitions={transitions} />
      ) : (
        <>
          <ContextMenu contextMenuItems={contextMenuItems}>
            <Container sx={playgroundStyles}>
              <Xwrapper>
                {newTransition && <TrackingBox />}
                <Grid />
              </Xwrapper>
            </Container>
          </ContextMenu>
          <TransitionModal
            showModal={showTransitionModal}
            alphabet={automaton?.alphabet}
            transition={transitions[transitions.length - 1]}
            onSubmit={(oldT, newT) => {
              updateTransition(oldT, newT);
              setShowTransitionModal(false);
              setNewTransition(null);
            }}
            onClose={(t) => {
              setShowTransitionModal(false);
              deleteTransition(t);
              setNewTransition(null);
            }}
          />
          <AutomatonModal
            showModal={showAutomatonModal}
            onSubmit={defineAutomaton}
          />
        </>
      )}
    </SideBar>
  );
};
