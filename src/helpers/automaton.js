import { Typography } from '@mui/material';

const generateAutomatonSchematic = (nodes, alphabet) => {
  return nodes.map((n) => {
    const state = {
      label: n,
      isAccepting: false,
      isStarting: false,
    };

    for (const a of alphabet) {
      state[a] = null;
    }

    return state;
  });
};

export const generateDFA = (nodeCount = 1, alphabet = [], finalCount = 1) => {
  let unusedNodes = [...Array(nodeCount)?.keys()];
  const schematic = generateAutomatonSchematic(unusedNodes, alphabet);
  schematic[0].isStarting = true;

  const startingNode = unusedNodes.shift();
  let currentNode = startingNode;

  while (unusedNodes.length > 0) {
    // Generate a random state and symbol
    const randomStateIndex = Math.floor(Math.random() * unusedNodes.length);
    const randomSymbolIndex = Math.floor(Math.random() * alphabet.length);
    const endState = unusedNodes.splice(randomStateIndex, 1)[0];
    const transitionSymbol = alphabet[randomSymbolIndex];
    // Retrieve the state and update its transition
    const currentStateIndex = schematic.findIndex(
      (s) => s.label === currentNode,
    );
    schematic[currentStateIndex][transitionSymbol] = endState;

    // Update the current node
    currentNode = endState;
  }

  // Now every state has a path to it
  // Now randomly assign transitions to the remaining symbols for each state
  const allNodes = [...Array(nodeCount)?.keys()];

  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      const symbol = alphabet[j];

      if (schematic[i][symbol] === null) {
        const randomStateIndex = Math.floor(Math.random() * allNodes.length);
        schematic[i][symbol] = allNodes[randomStateIndex];
      }
    }
  }

  // Now all states are fully accounted for, define the final states
  for (let i = 0; i < finalCount; i++) {
    const randomStateIndex = Math.floor(Math.random() * allNodes.length);
    schematic[randomStateIndex].isAccepting = true;
  }

  return schematic;
};

export const parseAutomatonSchematic = (schematic) => {
  const nodes = [];
  let transitions = [
    {
      start: 'entryNode',
      end: 'S0',
    },
  ];
  const excludedKeys = ['label', 'isAccepting', 'isStarting'];

  for (let i = 0; i < schematic.length; i++) {
    const node = schematic[i];

    nodes.push({
      label: `S${node.label}`,
      isAccepting: node.isAccepting,
      isStarting: node.isStarting,
      position: { x: 0, y: 0 },
    });

    for (const key in node) {
      if (
        Object.hasOwnProperty.call(node, key) &&
        !excludedKeys.includes(key)
      ) {
        const element = node[key];
        const start = `S${node.label}`;
        const end = `S${element}`;

        let isDuplicate = false;

        const updatedTransitions = transitions.flatMap((t) => {
          if (t.start === start && t.end === end) {
            isDuplicate = true;

            return {
              ...t,
              value: [t.value, key],
              labels: (
                <Typography bgcolor={'white'}>{`${t.value},${key}`}</Typography>
              ),
            };
          }

          return t;
        });

        if (isDuplicate) {
          transitions = updatedTransitions;
          continue;
        }

        transitions.push({
          start,
          end,
          value: key,
          labels: <Typography bgcolor={'white'}>{key}</Typography>,
        });
      }
    }
  }

  return { nodes, transitions };
};
