import { useState } from 'react';

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { ConsentPopup } from 'src/components/consent-popup';
import Iconify from 'src/components/iconify';
import { useIdentityKycFlow } from './view/identity-kyc-layout';

const instructionArray = [
  {
    id: 1,
    icon: 'mdi:wifi-check',
    instruction: 'Stable Internet',
    description:
      'Ensure you have a consistent connection for the upcoming video KYC session to avoid interruptions.',
  },
  {
    id: 2,
    icon: 'mdi:card-account-details-outline',
    instruction: 'Aadhar Card',
    description:
      'Keep your original physical Aadhar card ready. We will verify your identity via a secure digital scan.',
  },
  {
    id: 3,
    icon: 'mdi:volume-off',
    instruction: 'Quiet Room',
    description:
      'The verification requires clear audio. Find a well-lit, silent environment for the biometric steps.',
  },
];

export default function InitiateKYC() {
  const { goToNextStep } = useIdentityKycFlow();
  const [openConsent, setOpenConsent] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleOpenConsent = () => {
    setOpenConsent(true);
  };

  const handleCloseConsent = () => {
    setOpenConsent(false);
  };

  const handleAgreeConsent = (value) => {
    setConsent(value);
    goToNextStep();
  };

  const handleDeclineConsent = (value) => {
    setConsent(value);
  };

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}>
        <Stack spacing={5}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6.5}>
            <Box sx={{ maxWidth: 760 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3 }}>
                Step 1 of 3: Welcome
              </Typography>
              <Typography variant="h1" sx={{ mt: 1.5, mb: 2 }}>
                Secure Your Bond Investment With KYC
              </Typography>
              <Typography variant="h4" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 400 }}>
                To comply with financial regulations and secure your bond portfolio, please
                complete this one time identity verification process. This process is encrypted and
                usually takes under 5 mins.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} lg={5.5}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 360,
                background:
                  'linear-gradient(135deg, rgba(232,239,248,0.95) 0%, rgba(248,250,252,0.98) 56%, rgba(223,233,245,0.9) 100%)',
              }}
            >
              <Box
                component="img"
                src="/assets/background/steps.jpg"
                alt="kyc-image"
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 320,
                  objectFit: 'cover',
                  borderRadius: 2.5,
                }}
              />

              <Card
                sx={{
                  width: { xs: 'calc(100% - 32px)', sm: 260 },
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  borderRadius: 2.5,
                  boxShadow: '0 24px 40px rgba(24, 39, 60, 0.12)',
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.main',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="mdi:shield-check" width={30} />
                  </Box>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.6 }}>
                      Security Level
                    </Typography>
                    <Typography variant="h5">Tier 1 AES-256</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2.4 }}>
                Verification Essentials
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>

            <Grid container spacing={2.5}>
              {instructionArray.map((instruction) => (
                <Grid item xs={12} md={4} key={instruction.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderRadius: 2.5,
                      boxShadow: 'none',
                      borderColor: (theme) => alpha(theme.palette.grey[500], 0.16),
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.02),
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                          }}
                        >
                          <Iconify icon={instruction.icon} width={28} />
                        </Box>
                        <Typography variant="h5">{instruction.instruction}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {instruction.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Card>

        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
              <Typography variant="h4">Ready To Proceed?</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                By clicking below, you agree to our terms of service and privacy policy regarding
                data processing.
              </Typography>
            </Stack>
            <Button
              size="large"
              variant="contained"
              onClick={handleOpenConsent}
              endIcon={<Iconify icon="mdi:arrow-right" width={20} />}
              sx={{ py: 1.8, px: 3, borderRadius: 2, boxShadow: 'none' }}
            >
              Start Verification
            </Button>
          </Stack>
        </Card>
        </Stack>
      </Box>

      <ConsentPopup
        open={openConsent}
        onClose={handleCloseConsent}
        onAgree={handleAgreeConsent}
        onDecline={handleDeclineConsent}
        consent={consent}
        description="In compliance with the Digital Personal Data Protection Act (DPDPA), we require your explicit consent to process your personal data for your bond investment application."
        documents={[
          'Aadhar Details',
          'PAN Card Information',
          'Video & Photo (Biometrics)',
        ]}
        purposes={[
          'Identity Verification',
          'Anti-Money Laundering (AML)',
          'SEBI Compliance for Bonds',
        ]}
        note="By clicking 'I Agree', you authorize Bonds to collect, process, and store your data as per our Privacy Policy. You have the right to withdraw this consent at any time, though it may affect your ability to invest."
      />
    </>
  );
}
