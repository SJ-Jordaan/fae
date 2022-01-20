import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Backdrop, Stack, Tab, Tabs } from '@mui/material';
import { ControlledSwitch } from '.';

export const AutomatonModal = (props) => {
  const [mode, setMode] = React.useState(0);
  const [alphabet, setAlphabet] = useState('a,b');
  const [nodeCount, setNodeCount] = useState(4);
  const [transitionCount, setTransitionCount] = useState(0);
  const [type, setType] = useState('DFA');

  const handleModeChange = (event, newValue) => {
    setMode(newValue);
  };

  const handleSubmit = () => {
    props.onSubmit?.(
      mode,
      alphabet?.split(','),
      type,
      nodeCount,
      transitionCount,
    );
  };

  const handleTypeChange = (checked) => {
    setType(checked ? 'NFA' : 'DFA');
  };

  const DesignMode = ({ index }) => {
    return (
      <>
        {mode === index && (
          <>
            <TextField
              margin='dense'
              id='alphabet'
              label='Alphabet'
              helperText='Use comma separated values 0,1 or a,b etc'
              type='text'
              value={alphabet}
              onInput={(e) => setAlphabet(e.target.value)}
              variant='standard'
            />
            <ControlledSwitch
              leftText={'DFA'}
              rightText={'NFA'}
              onChange={handleTypeChange}
            />
          </>
        )}
      </>
    );
  };

  const GenerateMode = ({ index }) => {
    return (
      <>
        {mode === index && (
          <Stack direction={'column'} spacing={1}>
            <TextField
              margin='dense'
              id='alphabet'
              label='Alphabet'
              helperText='Use comma separated values 0,1 or a,b etc'
              type='text'
              value={alphabet}
              onInput={(e) => setAlphabet(e.target.value)}
              variant='standard'
            />
            <ControlledSwitch
              leftText={'DFA'}
              rightText={'NFA'}
              onChange={handleTypeChange}
            />
            <TextField
              margin='dense'
              id='node count'
              label='Number of states'
              type='number'
              value={nodeCount}
              onInput={(e) => setNodeCount(e.target.value)}
              variant='standard'
            />
            <TextField
              margin='dense'
              id='transition count'
              label='Number of transitions'
              type='number'
              value={transitionCount}
              onInput={(e) => setTransitionCount(e.target.value)}
              variant='standard'
            />
          </Stack>
        )}
      </>
    );
  };

  return (
    <Backdrop open={props.showModal}>
      <Dialog open={props.showModal}>
        <DialogContent>
          <Tabs value={mode} onChange={handleModeChange}>
            <Tab label='Design' />
            <Tab label='Generate' />
          </Tabs>
          <DesignMode index={0} />
          <GenerateMode index={1} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};
