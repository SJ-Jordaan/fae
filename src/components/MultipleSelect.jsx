import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

export const MultipleSelect = (props) => {
  const theme = useTheme();
  const [value, setValue] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    props.onChange?.(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id='demo-multiple-name-label'>{props.title}</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          id='demo-multiple-name'
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={props.title} />}
          MenuProps={MenuProps}
        >
          {props.values.map((v) => (
            <MenuItem key={v} value={v} style={getStyles(v, value, theme)}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
