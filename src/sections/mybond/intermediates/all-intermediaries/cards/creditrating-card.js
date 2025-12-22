import { Card, Typography, Stack, Button, Grid, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function CreditRatingCard({ data = [], onGoToTab }) {
  const hasData = Array.isArray(data) && data.length > 0;
  const rating = hasData ? data[0] : null; 
  const emptyDataComponent = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1">
        Credit Rating request is pending
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Please complete credit rating selection to proceed.
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={onGoToTab}>
        Appoint
      </Button>
    </Box>
  );

  const dataComponent = () => (
    <Stack spacing={0.5}>
      <Typography fontWeight={600}>{rating.agencyName}</Typography>
      <Typography variant="body2">
        Rating Type: {rating.ratingType}
      </Typography>
      <Typography variant="body2">
        Timeline: {rating.timeline}
      </Typography>
      <Typography variant="body2" color="success.main">
        {rating.status}
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ p: 0 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            borderRight: { md: '2px dashed lightgray' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Iconify icon="solar:chart-bold" width={22} />
            Credit Rating Agency
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          {hasData ? dataComponent() : emptyDataComponent()}
        </Grid>
      </Grid>
    </Card>
  );
}
