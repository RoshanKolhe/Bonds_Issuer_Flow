import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useGetBondEstimation } from 'src/api/bondEstimations';
import { useParams } from 'src/routes/hook';
import NotFoundPage from 'src/pages/404';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import MainFile from './borrowing-details/main';
import FinancialDetailsMain from './financial-details/main';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import CollateralAssets from './collateral-assets/collatralAssets';
import PreliminaryRequirements from './preliminary-requirements/preliminaryRequirements';
import CreditRating from './credit-rating/creditRatings';

export default function Stepper() {
  const params = useParams();
  const { applicationId } = params;
  const [activeStepId, setActiveStepId] = useState('bond_priliminary_requirements');
  const [estimationData, setEstimationData] = useState(null);
  const { bondEstimation, bondEstimationLoading, auditedFinancials } = useGetBondEstimation(applicationId);
  const [dataInitialized, setDataInitialized] = useState(false);

  const steps = [
    {
      id: 'bond_priliminary_requirements',
      number: 1,
      lines: ['Preliminary', 'Requirements'],
    },
    {
      id: 'credit_ratings',
      number: 2,
      lines: ['Credit Rating'],
    },
    // {
    //   id: 'audited_financial',
    //   number: 3,
    //   lines: ['Audited', 'Financials'],
    // },
    {
      id: 'borrowing_details',
      number: 3,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'collateral_assets',
      number: 4,
      lines: ['Collatral', 'Assets'],
    },
    {
      id: 'financial_details',
      number: 5,
      lines: ['Financial', 'Details'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    bond_priliminary_requirements: { percent: 0 },
    credit_ratings: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    collateral_assets: { percent: 0 },
    financial_details: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'bond_priliminary_requirements':
        return (
          <PreliminaryRequirements
            percent={(p) => updateStepPercent('bond_priliminary_requirements', p)}
            setActiveStepId={() => setActiveStepId('credit_ratings')}
            currentPrliminaryRequirements={estimationData ? estimationData?.estimationPriliminaryBondRequirements : null}
          />
        );

      case 'credit_ratings':
        return (
          <CreditRating
            percent={(p) => updateStepPercent('credit_ratings', p)}
            setActiveStepId={() => setActiveStepId('borrowing_details')}
            currentCreditRatings={estimationData ? estimationData?.estimationCreditRatings : null}
          />
        );

      // case 'audited_financial':
      //   return (
      //     <AuditedFinancialDocument
      //       percent={(p) => updateStepPercent('audited_financial', p)}
      //       setActiveStepId={() => setActiveStepId('borrowing_details')}
      //       currentAuditedFinancials={estimationData ? estimationData?.auditedFinancials : null}
      //     />
      //   );

      case 'borrowing_details':
        return (
          <MainFile
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={() => setActiveStepId('collateral_assets')}
            currentBorrowingDetails={estimationData ? estimationData?.estimationBorrowingDetails : null}
          />
        );

      case 'collateral_assets':
        return (
          <CollateralAssets
            percent={(p) => updateStepPercent('collateral_assets', p)}
            currentCollateralAssets={estimationData ? estimationData?.bondEstimationCollateralAssets : null}
            setActiveStepId={() => setActiveStepId('financial_details')}
          />
        );

      case 'financial_details':
        return (
          <FinancialDetailsMain
            percent={(p) => updateStepPercent('financial_details', p)}
            currentFinancialRatios={estimationData ? estimationData?.financialRatios : null}
            currentCapitalDetails={estimationData ? estimationData?.capitalDetails : null}
            currentProfitabilityDetails={estimationData ? estimationData?.profitabilityDetails : null}
            currentFundPosition={estimationData ? estimationData?.fundPosition : null}
            currentBorrowingDetails={estimationData ? estimationData?.estimationBorrowingDetails : null}
            currentFinancialStatements={estimationData ? estimationData?.financialDetails?.financialStatements : null }
          />
        );

      default:
        return <NotFoundPage />;
    }
  };

  useEffect(() => {
    if (bondEstimation && !bondEstimationLoading && !dataInitialized) {
      setEstimationData({ ...bondEstimation, auditedFinancials });
      let currentStep = 'bond_priliminary_requirements';

      if (bondEstimation.currentProgress.includes('bond_priliminary_requirements')) {
        updateStepPercent('bond_priliminary_requirements', 100);
        currentStep = 'credit_ratings';
      }

      if (bondEstimation.currentProgress.includes('credit_ratings')) {
        updateStepPercent('credit_ratings', 100);
        currentStep = 'borrowing_details';
      }

      // if (bondEstimation.currentProgress.includes('audited_financials')) {
      //   updateStepPercent('audited_financial', 100);
      //   currentStep = 'borrowing_details';
      // }

      if (bondEstimation.currentProgress.includes('borrowing_details')) {
        updateStepPercent('borrowing_details', 100);
        currentStep = 'collateral_assets';
      }

      if (bondEstimation.currentProgress.includes('collateral_assets')) {
        updateStepPercent('collateral_assets', 100);
        currentStep = 'financial_details';
      }

      if (bondEstimation.currentProgress.includes('financial_details')) {
        updateStepPercent('financial_details', 100);
        currentStep = 'financial_details';
      }

      setActiveStepId(currentStep);
      setDataInitialized(true);
    }
  }, [bondEstimation, bondEstimationLoading, dataInitialized, auditedFinancials]);

  return (
    <Box sx={{ p: 3 }}>
      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
