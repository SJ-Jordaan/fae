import React from 'react';
import Switch from '@mui/material/Switch';
import { Stack, Typography } from '@mui/material';

export const ControlledSwitch = (props) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.onChange?.(event.target.checked);
  };

  return (
    <Stack direction={'row'} spacing={1} alignItems={'center'}>
      {props.leftText && <Typography>{props.leftText}</Typography>}
      <Switch checked={checked} onChange={handleChange} />
      {props.rightText && <Typography>{props.rightText}</Typography>}
    </Stack>
  );
};
