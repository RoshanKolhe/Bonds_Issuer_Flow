import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Box, IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function DocumentTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { name, description, isActive, createdAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{name || 'NA'}</TableCell>
      <TableCell>
        <Tooltip title={description}>
          <Box
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || 'NA'}
          </Box>
        </Tooltip>

      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={Number(isActive) === 1 ? 'success' : 'error'}
        >
          {Number(isActive) === 1 ? 'Active' : 'In-active'}
        </Label>
      </TableCell>
      <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
        <Tooltip title="Draft" placement="top">
          <IconButton onClick={onEditRow}>
            <Iconify icon="solar:document-text-bold" />

          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

DocumentTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
