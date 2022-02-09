import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Backdrop, Typography } from '@mui/material';
import { MultipleSelect } from '.';

export const TransitionModal = (props) => {
  const [input, setInput] = useState([]);

  const handleSubmit = () => {
    props.onSubmit?.(props.transition, {
      ...props.transition,
      value: input,
      labels: <Typography bgcolor={'white'}>{input?.join(',')}</Typography>,
    });
    setInput([]);
  };

  const handleClose = () => {
    props.onClose?.(props.transition);
    setInput([]);
  };

  return (
    <Backdrop open={props.showModal}>
      <Dialog open={props.showModal} onClose={handleClose}>
        <DialogTitle>Transition Value</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the value for the transition from {props.transition?.start} to{' '}
            {props.transition?.end}.
          </DialogContentText>
          <MultipleSelect
            values={props.alphabet}
            onChange={(values) => setInput(values)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};
