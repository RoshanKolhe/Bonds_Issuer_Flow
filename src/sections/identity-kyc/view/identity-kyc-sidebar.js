import PropTypes from 'prop-types';

import { alpha, Box, Button, Card, LinearProgress, Stack, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import { useIdentityKycFlow } from './identity-kyc-layout';

const stepIcons = [
  'solar:info-circle-bold',
  'solar:document-text-bold',
  'solar:videocamera-record-bold',
];

export default function IdentityKycSidebar({ title = 'KYC Progress', subtitle = 'Personal Identity Flow' }) {
  const { currentStep, steps } = useIdentityKycFlow();
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card
      sx={{
        p: 3,
        minHeight: '100%',
        borderRadius: 0,
        boxShadow: 'none',
        bgcolor: 'transparent',
        borderRight: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
      }}
    >
      <Stack spacing={6} justifyContent="space-between" sx={{ minHeight: 'calc(100vh - 50px)' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2 }}>
              {subtitle}
            </Typography>
          </Box>

          <Stack spacing={1}>
            {steps.map((item, index) => {
              const active = index === currentStep;
              const completed = index < currentStep;
              const locked = index > currentStep;

              return (
                <Stack
                  key={item.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    py: 1.75,
                    px: 1.5,
                    borderRadius: 2,
                    color: active ? 'primary.main' : locked ? 'text.disabled' : 'text.secondary',
                    bgcolor: active ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    borderLeft: active
                      ? (theme) => `4px solid ${theme.palette.primary.main}`
                      : '4px solid transparent',
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: active || completed ? 'primary.main' : 'text.disabled',
                      bgcolor:
                        active || completed
                          ? (theme) => alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon={completed ? 'solar:check-circle-bold' : stepIcons[index]} width={20} />
                  </Box>

                  <Stack spacing={0.25}>
                    <Typography variant="h6" sx={{ fontWeight: active ? 700 : 500 }}>
                      {index + 1}. {item.label}
                    </Typography>
                    {locked ? (
                      <Typography variant="caption" color="text.disabled">
                        Locked until previous step is completed
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              boxShadow: 'none',
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">
                  Step {currentStep + 1} of {steps.length}
                </Typography>
                <Typography variant="subtitle2">{Math.round(progress)}%</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
                }}
              />
            </Stack>
          </Card>

          <Button variant="contained" color="inherit" size="large" sx={{ borderRadius: 2, py: 1.75 }}>
            Save Progress
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

IdentityKycSidebar.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string,
};
