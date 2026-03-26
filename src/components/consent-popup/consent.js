import PropTypes from 'prop-types';

import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

function ConsentListCard({ title, items, icon = 'solar:check-circle-bold' }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        height: '100%',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2.4 }}>
          {title}
        </Typography>

        <Stack spacing={1.5}>
          {items.map((item) => (
            <Stack key={item} direction="row" spacing={1.25} alignItems="flex-start">
              <Iconify icon={icon} width={18} sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
              <Typography variant="body1">{item}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

ConsentListCard.propTypes = {
  icon: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default function ConsentPopup({
  open,
  onClose,
  onAgree,
  onDecline,
  consent,
  documents = [],
  purposes = [],
  title = 'Data Privacy Consent',
  description,
  note,
  agreeLabel = 'I Agree & Continue',
  declineLabel = 'Decline',
}) {
  const defaultDescription =
    'In compliance with the Digital Personal Data Protection Act (DPDPA), we require your explicit consent to process your personal data.';

  const defaultNote =
    "By clicking 'I Agree', you authorize processing of your data for the purposes listed below. You may withdraw this consent later, though it may affect your ability to continue.";

  const handleDecline = () => {
    if (onDecline) {
      onDecline(false);
    }

    if (onClose) {
      onClose();
    }
  };

  const handleAgree = () => {
    if (onAgree) {
      onAgree(true);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.24)',
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              <Iconify icon="solar:shield-check-bold" width={22} />
            </Box>

            <Typography variant="h3">{title}</Typography>
          </Stack>

          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.7 }}>
            {description || defaultDescription}
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <ConsentListCard title="Data Collected" items={documents} />
            </Grid>

            <Grid item xs={12} md={6}>
              <ConsentListCard
                title="Purpose of Processing"
                items={purposes}
                icon="solar:verified-check-bold"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: 'primary.dark', fontStyle: 'italic', lineHeight: 1.8 }}
            >
              {note || defaultNote}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            justifyContent="flex-end"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={handleDecline}
              sx={{ minWidth: 120 }}
            >
              {declineLabel}
            </Button>

            <Button
              variant="contained"
              onClick={handleAgree}
              endIcon={<Iconify icon="solar:check-read-bold" width={20} />}
              color="primary"
              sx={{
                minWidth: 240,
                py: 1.6,
                borderRadius: 2,
              }}
            >
              {consent ? agreeLabel : 'Agree & Continue'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

ConsentPopup.propTypes = {
  agreeLabel: PropTypes.string,
  consent: PropTypes.bool,
  declineLabel: PropTypes.string,
  description: PropTypes.string,
  documents: PropTypes.arrayOf(PropTypes.string),
  note: PropTypes.string,
  onAgree: PropTypes.func,
  onClose: PropTypes.func,
  onDecline: PropTypes.func,
  open: PropTypes.bool.isRequired,
  purposes: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};
