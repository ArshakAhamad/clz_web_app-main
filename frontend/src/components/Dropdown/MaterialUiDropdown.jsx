import React, { useState } from 'react';
import {
  Checkbox,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';

const MaterialUiDropdown = ({ options, value, onChange, placeholder = "Select items..." }) => {
  const [selectedValues, setSelectedValues] = useState(value);

  const handleSelect = (event) => {
    const selected = event.target.value;

    if (selected.includes('all')) {
      if (selectedValues.length === options.length) {
        setSelectedValues([]);
        onChange([]);
      } else {
        setSelectedValues(options.map((option) => option.value));
        onChange(options.map((option) => option.value));
      }
    } else {
      setSelectedValues(selected);
      onChange(selected);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="multi-select-label">{}</InputLabel>
      <Select
        labelId="multi-select-label"
        multiple
        value={selectedValues}
        onChange={handleSelect}
        renderValue={(selected) => 
          selected.length > 0 ? selected.join(', ') : placeholder
        }
        displayEmpty
      >
        <MenuItem value="all">
          <ListItemIcon>
            <Checkbox checked={selectedValues.length === options.length} />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>
              <Checkbox checked={selectedValues.includes(option.value)} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MaterialUiDropdown;
