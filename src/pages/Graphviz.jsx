import React from 'react';

import { Graphviz } from 'graphviz-react';

export const GraphVisualisation = (props) => {
  const generateTransitionString = (transition) => {
    if (transition.start === 'entryNode') {
      return '';
    }

    return `${transition.start} -> ${transition.end} [label = "${transition.value}"];`;
  };

  const generateDotString = () => {
    let acceptingStates = '';

    for (let node of props.nodes) {
      if (node.isAccepting) {
        acceptingStates += ` ${node.label}`;
      }
    }

    let dotString = `digraph fsm {
      rankdir=LR;
      size="8,5"
      node [shape = doublecircle];${acceptingStates};
      node [shape = circle];
    `;

    for (let transition of props.transitions) {
      dotString += generateTransitionString(transition);
    }

    dotString += '}';

    console.log(dotString);

    return dotString;
  };
  return <Graphviz dot={generateDotString()} />;
};
