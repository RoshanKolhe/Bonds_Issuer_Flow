import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function InstructionModal({
  open,
  onClose,
  title,
  instructions,
  actionLabel = 'Got it',
  ...other
}) {
  const hasInstructions = Array.isArray(instructions) && instructions.length > 0;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {hasInstructions ? (
          <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
            {instructions.map((item, index) => (
              <Typography
                key={`${item}-${index}`}
                component="li"
                variant="body2"
                sx={{ mb: 1.25, '&:last-child': { mb: 0 } }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">{instructions}</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

InstructionModal.propTypes = {
  actionLabel: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
