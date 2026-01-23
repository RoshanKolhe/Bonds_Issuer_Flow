import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// ----------------------------------

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string' && isNaN(Number(value))) {
    return value;
  }

  return new Intl.NumberFormat('en-IN').format(value);
}


function parsePrice(value) {
  if (!value) return '';
  return value.replace(/,/g, '').trim();
}


// ----------------------------------

export default function RHFPriceField({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const displayValue =
          field.value === '' || field.value === null
            ? ''
            : formatPrice(field.value);

        return (
          <TextField
            {...other}
            fullWidth
            value={displayValue}
           onChange={(event) => {
  const raw = parsePrice(event.target.value);

  // empty
  if (raw === '') {
    field.onChange('');
    return;
  }

  const typingRegex = /^[+-]?(\d+)?(\.)?(\d+)?$/;

  if (!typingRegex.test(raw)) {
    return; 
  }

  
  if (!isNaN(Number(raw)) && raw !== '+' && raw !== '-' && raw !== '.' && raw !== '+.' && raw !== '-.') {
    field.onChange(Number(raw));
  } else {
    
    field.onChange(raw);
  }
}}
            error={!!error}
            helperText={error?.message || helperText}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
        );
      }}
    />
  );
}

RHFPriceField.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.node,
};
