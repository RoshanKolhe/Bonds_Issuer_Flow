// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ mt: { xs: 6, md: 8 } }}>
      <Divider sx={{ mb: 2.5 }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography variant="caption" color="text.secondary">
          Copyright {year} Project Bond. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Link component={RouterLink} href="#" variant="caption" color="text.secondary">
            Terms
          </Link>
          <Link component={RouterLink} href="#" variant="caption" color="text.secondary">
            Privacy
          </Link>
          <Link href="mailto:support@projectbond.cc" variant="caption" color="text.secondary">
            support@projectbond.cc
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
