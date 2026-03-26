import { useState } from 'react';

import {
  alpha,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useIdentityKycFlow } from './view/identity-kyc-layout';

const requestedDocuments = [
  {
    title: 'Aadhar Card',
    subtitle: 'Proof of identity & address',
    icon: 'solar:card-bold',
  },
  {
    title: 'PAN Card',
    subtitle: 'Proof of tax residency',
    icon: 'solar:wallet-money-bold',
  },
];

const featureCards = [
  {
    title: 'Instant Verification',
    icon: 'solar:bolt-bold',
  },
  {
    title: 'No Document Scans',
    icon: 'solar:document-add-bold',
  },
  {
    title: 'Secure & Encrypted',
    icon: 'solar:lock-password-bold',
  },
];

function DocumentRequestCard({ title, subtitle, icon }) {
  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: 2,
        bgcolor: 'common.white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          display: 'grid',
          placeItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
          {subtitle}
        </Typography>
      </Box>

      <Iconify icon="solar:menu-dots-bold" width={22} sx={{ color: 'text.disabled' }} />
    </Box>
  );
}

export default function IdentityVerification() {
  const [consent, setConsent] = useState(true);
  const { goToNextStep } = useIdentityKycFlow();

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}>
      <Stack spacing={5}>
        <Box sx={{ maxWidth: 920 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3 }}>
            Step 2 of 3: Documentation
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.5, mb: 2 }}>
            Verify via DigiLocker
          </Typography>
          <Typography variant="h4" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 400 }}>
            Authorize Bonds to securely access your verified documents directly from the
            Government of India&apos;s DigiLocker vault. This eliminates the need for manual
            scanning and ensures the highest level of data integrity.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7.5}>
            <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, boxShadow: (theme) => theme.customShadows?.card || theme.shadows[8] }}>
              <Stack spacing={4}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2.5,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    <Iconify icon="solar:shield-network-bold" width={34} />
                  </Box>

                  <Box>
                    <Typography variant="h3">Secure Gateway</Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 400 }}>
                      Connect your official digital wallet
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Iconify icon="solar:shield-check-bold" width={24} sx={{ color: 'text.secondary' }} />
                        <Typography variant="h4">Data Privacy Guarantee</Typography>
                      </Stack>

                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                          bgcolor: (theme) => alpha(theme.palette.success.main, 0.14),
                          color: 'success.main',
                        }}
                      >
                        <Typography variant="subtitle2">Official API</Typography>
                      </Box>
                    </Stack>

                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                      Your documents are fetched via an encrypted channel. Bonds does not store
                      your DigiLocker login credentials.
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Checkbox checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                  <Typography variant="body1" color="text.secondary" sx={{ pt: 1 }}>
                    I authorize Bonds to fetch my PAN and Aadhar details from DigiLocker for
                    identity verification as per DPDPA guidelines.
                  </Typography>
                </Stack>

                <Button
                  size="large"
                  variant="contained"
                  disabled={!consent}
                  onClick={goToNextStep}
                  endIcon={<Iconify icon="solar:arrow-right-linear" width={22} />}
                  sx={{
                    py: 2.2,
                    borderRadius: 2,
                    fontSize: 18,
                    boxShadow: 'none',
                  }}
                >
                  Proceed to DigiLocker
                </Button>
              </Stack>
            </Card>

            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {featureCards.map((item) => (
                <Grid item xs={12} sm={4} key={item.title}>
                  <Card sx={{ p: 3, height: '100%', borderRadius: 2.5, boxShadow: 'none', border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                    <Stack spacing={2}>
                      <Iconify icon={item.icon} width={28} sx={{ color: 'primary.main' }} />
                      <Typography variant="h5" sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
                        {item.title}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} lg={4.5}>
            <Stack spacing={3}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                  boxShadow: 'none',
                }}
              >
                <Stack spacing={2.5}>
                  <Typography variant="overline" sx={{ letterSpacing: 3, fontSize: 14 }}>
                    Documents Requested
                  </Typography>

                  {requestedDocuments.map((item) => (
                    <DocumentRequestCard
                      key={item.title}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                    />
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 78,
                        height: 100,
                        borderRadius: 2,
                        flexShrink: 0,
                        background:
                          'linear-gradient(180deg, rgba(46,58,71,0.72) 0%, rgba(93,104,117,0.9) 100%)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'common.white',
                      }}
                    >
                      <Iconify icon="solar:verified-check-bold" width={34} />
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Verification is performed in accordance with SEBI and RBI guidelines for
                      digital KYC. By proceeding, you consent to the one-time fetch of these
                      documents.
                    </Typography>
                  </Stack>
                </Stack>
              </Card>

              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                <Stack spacing={1.5}>
                  <Typography variant="h4">Can&apos;t use DigiLocker?</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    You can still proceed with manual document uploads, though this may take up to
                    48 hours for verification.
                  </Typography>
                  <Button
                    variant="text"
                    sx={{ alignSelf: 'flex-start', px: 0 }}
                    endIcon={<Iconify icon="solar:arrow-right-up-linear" width={20} />}
                  >
                    Upload manually instead
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
