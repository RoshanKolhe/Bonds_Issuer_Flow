import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function DebentureTrusteeTableRow({
  row,
  onView,
  onSendRequest,
}) {
  const { legalEntityName, experience, regulatory, fees, responseTime } = row;

  return (
    <TableRow hover>
      {/* Avatar + Name */}
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }}>
          {legalEntityName.charAt(0)}
        </Avatar>
        <Typography variant="body2">{legalEntityName}</Typography>
      </TableCell>

      {/* Experience */}
      <TableCell>{experience} yrs</TableCell>

      {/* Regulatory */}
      <TableCell>{regulatory}</TableCell>

      {/* Fees */}
      <TableCell>{fees}</TableCell>

      {/* Response Time */}
      <TableCell>{responseTime}</TableCell>

      {/* Actions */}
      <TableCell align="center">
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View">
            <IconButton onClick={onView}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Send Request">
            <IconButton color="primary" onClick={onSendRequest}>
              <Iconify icon="solar:paper-plane-bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

DebentureTrusteeTableRow.propTypes = {
  row: PropTypes.object,
  onView: PropTypes.func,
  onSendRequest: PropTypes.func,
};
