import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import FundAndCreditForm from './fund-position-and-credit-rating/fundAndCreditForm';
import { useGetBondEstimation } from 'src/api/bondEstimations';
import { useParams } from 'src/routes/hook';
import NotFoundPage from 'src/pages/404';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import MainFile from './borrowing-and-capital-details/main';
import FinancialDetails from './financial-ratios/financial-details';
import PreliminaryBondRequirements from './preliminary-bond-requirements';

// -------------------- Dynamic Stepper ------------------------
function DynamicStepper({ steps, activeStepId, stepsProgress, onStepClick }) {
  const getColor = (percent) => {
    if (percent === 100) return { border: '#22c55e', text: '#22c55e' };
    if (percent >= 50) return { border: '#f59e0b', text: '#f59e0b' };
    return { border: '#ef4444', text: '#ef4444' };
  };

  return (
    <Stack direction="row" spacing={3} sx={{ pt: 3, overflowX: 'auto', display: 'flex', justifyContent: 'space-between' }}>
      {steps.map((step) => {
        const isActive = step.id === activeStepId;
        const progress = stepsProgress[step.id]?.percent || 0;

        const color = isActive
          ? getColor(progress)
          : progress === 100
            ? { border: '#22c55e', text: '#22c55e' }
            : { border: '#d1d5db', text: '#6b7280' };

        return (
          <Stack
            key={step.id}
            alignItems="center"
            sx={{ cursor: progress === 100 || isActive ? 'pointer' : 'not-allowed' }}
            onClick={() => onStepClick(step.id)}
          >
            <Box sx={{ width: 40, height: 40, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none" />

                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  stroke={color.border}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography fontWeight={600}>{step.number}</Typography>
              </Box>
            </Box>

            <Typography sx={{ color: color.text, fontSize: '0.75rem', textAlign: 'center' }}>
              {step.lines.join(' ')}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function Stepper() {
  const params = useParams()
  const { applicationId } = params;
  const [activeStepId, setActiveStepId] = useState('fund_position_and_credit_ratings');
  const [estimationData, setEstimationData] = useState(null);
  const { bondEstimation, bondEstimationLoading } = useGetBondEstimation(applicationId);
  const [dataInitialized, setDataInitialized] = useState(false);

  const steps = [
    {
      id: 'fund_position_and_credit_ratings',
      number: 1,
      lines: ['Fund Position and', 'Credit Rating'],
    },
    {
      id: 'audited_financial',
      number: 2,
      lines: ['Audited', 'Financials'],
    },
    {
      id: 'borrowing_details',
      number: 3,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'financial_details',
      number: 4,
      lines: ['Financial', 'Details'],
    },
    {
      id: 'preliminary_bond_requirements',
      number: 5,
      lines: ['Preliminary', 'Requirements'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    fund_position_and_credit_ratings: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    financial_details: { percent: 0 },
    preliminary_bond_requirements: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    // Prevent jumping forward if previous step is incomplete
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'fund_position_and_credit_ratings':
        return (
          <FundAndCreditForm
            percent={(p) => updateStepPercent('fund_position_and_credit_ratings', p)}
            setActiveStepId={() => setActiveStepId('audited_financial')}
            currentFundPosition={estimationData ? estimationData?.fundPosition : null}
            currentCreditRatings={estimationData ? estimationData?.estimationCreditRatings : null}
          />
        );

      case 'audited_financial':
        return (
          <AuditedFinancialDocument
            percent={(p) => updateStepPercent('audited_financial', p)}
            setActiveStepId={() => setActiveStepId('borrowing_details')}
            currentAuditedFinancials={estimationData ? estimationData?.fundPosition : null}
          />
        );

      case 'borrowing_details':
        return (
          <MainFile
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={() => setActiveStepId('financial_details')}
            currentBorrowingDetails={estimationData ? estimationData?.estimationBorrowingDetails : null}
            currentCapitalDetails={estimationData ? estimationData?.capitalDetails : null}
            currentProfitabilityDetails={estimationData ? estimationData?.profitabilityDetails : null}
          />
        );

      case 'financial_details':
        return (
          <FinancialDetails
            percent={(p) => updateStepPercent('financial_details', p)}
            setActiveStepId={() => setActiveStepId('preliminary_bond_requirements')}
            currentFinancialRatios={estimationData ? estimationData?.financialRatios : null}
          />
        );

      case 'preliminary_bond_requirements':
        return (
          <PreliminaryBondRequirements
            percent={(p) => updateStepPercent('preliminary_bond_requirements', p)}
            // setActiveStepId={() => setActiveStepId('preliminary_bond_requirements')}
            currentPrliminaryRequirements={estimationData ? estimationData?.estimationPriliminaryRequirements : null}
          />
        );

      default:
        return <NotFoundPage />;
    }
  };

  useEffect(() => {
    if (bondEstimation && !bondEstimationLoading && !dataInitialized) {

      setEstimationData(bondEstimation);
      let currentStep = 'fund_position_and_credit_ratings';

      if (
        bondEstimation.currentProgress.includes('fund_position') &&
        bondEstimation.currentProgress.includes('credit_ratings')
      ) {
        updateStepPercent('fund_position_and_credit_ratings', 100);
        currentStep = 'borrowing_details';
      }

      if (
        bondEstimation.currentProgress.includes('profitability_details') &&
        bondEstimation.currentProgress.includes('capital_details') &&
        bondEstimation.currentProgress.includes('borrowing_details')
      ) {
        updateStepPercent('audited_financial', 100);
        updateStepPercent('borrowing_details', 100);
        currentStep = 'financial_details';
      }

      if (bondEstimation.currentProgress.includes('financial_details')) {
        updateStepPercent('financial_details', 100);
        currentStep = 'preliminary_bond_requirements';
      }

      setActiveStepId(currentStep);

      setDataInitialized(true);
    }
  }, [bondEstimation, bondEstimationLoading, dataInitialized]);

  return (
    <Box sx={{ p: 3 }}>
      <DynamicStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>{renderForm()}</Stack>
    </Box>
  );
}
