import { createContext, useContext, useMemo, useState } from 'react';

import { Box, Grid } from '@mui/material';

import InitiateKYC from '../initiate-kyc';
import IdentityVerification from '../identity-verification';
import VideoKYC from '../video-kyc';
import IdentityKycSidebar from './identity-kyc-sidebar';

const IdentityKycFlowContext = createContext(null);

const steps = [
  { id: 'welcome', label: 'Welcome', component: InitiateKYC },
  { id: 'verification', label: 'Documentation', component: IdentityVerification },
  { id: 'video-kyc', label: 'Video KYC', component: VideoKYC },
];

export function useIdentityKycFlow() {
  const context = useContext(IdentityKycFlowContext);

  if (!context) {
    throw new Error('useIdentityKycFlow must be used within IdentityKycLayout');
  }

  return context;
}

export default function IdentityKycLayout() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const value = useMemo(
    () => ({
      currentStep,
      steps,
      goToNextStep,
      isLastStep: currentStep === steps.length - 1,
    }),
    [currentStep]
  );

  const ActiveScreen = steps[currentStep].component;

  return (
    <IdentityKycFlowContext.Provider value={value}>
      <Grid container sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        <Grid
          item
          xs={12}
          md={3}
          lg={2.7}
          sx={{
            alignSelf: 'flex-start',
            position: { md: 'sticky' },
            top: { md: 0 },
          }}
        >
          <IdentityKycSidebar />
        </Grid>

        <Grid item xs={12} md={9} lg={9.3}>
          <Box sx={{ minHeight: '100%' }}>
            <ActiveScreen />
          </Box>
        </Grid>
      </Grid>
    </IdentityKycFlowContext.Provider>
  );
}
