import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  return new Intl.NumberFormat('en-IN').format(value);
}

function parsePrice(value) {
  if (!value) return '';
  return value.replace(/,/g, '');
}

// ----------------------------------------------------------------------

export default function RHFPriceField({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...other}
          fullWidth
          value={formatPrice(field.value)}
          onChange={(event) => {
            const rawValue = parsePrice(event.target.value);

            // allow only digits
            if (/^\d*$/.test(rawValue)) {
              field.onChange(rawValue === '' ? '' : Number(rawValue));
            }
          }}
          error={!!error}
          helperText={error?.message || helperText}
          inputProps={{
            inputMode: 'numeric',
          }}
        />
      )}
    />
  );
}

RHFPriceField.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.node,
};
