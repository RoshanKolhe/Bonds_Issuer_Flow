import { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';

import PreliminaryBondRequirements from './preliminary-bond-requirements';
import MyBondStar from './mybond-start';
import MyBondNewIssue from './mybond-new-issue';
import FundPositionForm from './fund-positions';
import MainFile from './borrowing/main';
import FinancialDetails from './financial-details';
import LaunchIssue from './launch-issue';
import IsinActivation from './isin-activation';
import RegulatoryFiling from './regulatory-filing';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';

// -------------------- Dynamic Stepper ------------------------
function DynamicStepper({ steps, activeStepId, stepsProgress, onStepClick }) {
  const getColor = (percent) => {
    if (percent === 100) return { border: '#22c55e', text: '#22c55e' };
    if (percent >= 50) return { border: '#f59e0b', text: '#f59e0b' };
    return { border: '#ef4444', text: '#ef4444' };
  };

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ pt: 3, overflowX: 'auto', display: 'flex', justifyContent: 'space-between' }}
    >
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

export default function MybondStepper() {
  const [activeStepId, setActiveStepId] = useState('my_bond_new_issue');
  const [formData, setFormData] = useState({
    my_bond_new_issue: {},
    fund_position: {},
    audited_financial: {},
    borrowing_details: {},
    financial_details: {},
    preliminary_bond_requirements: {},
    regulatory_filing: {},
    isin_activation: {},
    launch_issue: {},
  });

  const steps = [
    {
      id: 'my_bond_new_issue',
      number: 1,
      lines: ['New Issue', 'Setup'],
    },
    {
      id: 'fund_position',
      number: 2,
      lines: ['Fund', 'Position'],
    },
    {
      id: 'audited_financial',
      number: 3,
      lines: ['Audited', 'Financials'],
    },
    {
      id: 'borrowing_details',
      number: 4,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'financial_details',
      number: 5,
      lines: ['Financial', 'Details'],
    },
    {
      id: 'preliminary_bond_requirements',
      number: 6,
      lines: ['Preliminary', 'Requirements'],
    },
    {
      id: 'regulatory_filing',
      number: 7,
      lines: ['Regulatory', 'Filing'],
    },
    {
      id: 'isin_activation',
      number: 8,
      lines: ['ISIN', 'Activation'],
    },
    {
      id: 'launch_issue',
      number: 9,
      lines: ['Launch', 'Issue'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    my_bond_new_issue: { percent: 0 },
    fund_position: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    financial_details: { percent: 0 },
    preliminary_bond_requirements: { percent: 0 },
    regulatory_filing: { percent: 0 },
    isin_activation: { percent: 0 },
    launch_issue: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const saveStepData = (stepId, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...data, // merge new fields with old
      },
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
      case 'my_bond_new_issue':
        return (
          <MyBondNewIssue
            currentIssue={formData.my_bond_new_issue}
            percent={(p) => updateStepPercent('my_bond_new_issue', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('my_bond_new_issue', data)}
          />
        );

      case 'fund_position':
        return (
          <FundPositionForm
            currentFund={formData.fund_position}
            percent={(p) => updateStepPercent('fund_position', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={saveStepData}
          />
        );

      case 'audited_financial':
        return (
          <AuditedFinancialDocument
            currentAuditedDetails={formData.audited_financial}
            percent={(p) => updateStepPercent('audited_financial', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('audited_financial', data)}
          />
        );

      case 'borrowing_details':
        return (
          <MainFile
            currentDetails={formData.borrowing_details}
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('borrowing_details', data)}
          />
        );

      case 'financial_details':
        return (
          <FinancialDetails
            currentFinancial={formData.financial_details}
            percent={(p) => updateStepPercent('financial_details', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('financial_details', data)}
          />
        );

      case 'preliminary_bond_requirements':
        return (
          <PreliminaryBondRequirements
            currentBondRequirements={formData.preliminary_bond_requirements}
            percent={(p) => updateStepPercent('preliminary_bond_requirements', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('preliminary_bond_requirements', data)}
          />
        );

      case 'regulatory_filing':
        return (
          <RegulatoryFiling
            currentRegulatory={formData.regulatory_filing}
            percent={(p) => updateStepPercent('regulatory_filing', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('regulatory_filing', data)}
          />
        );
      case 'isin_activation':
        return (
          <IsinActivation
            currentIsin={formData.isin_activation}
            percent={(p) => updateStepPercent('isin_activation', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={saveStepData}
          />
        );
      case 'launch_issue':
        return (
          <LaunchIssue
            currentLaunchIssue={formData.launch_issue}
            percent={(p) => updateStepPercent('launch_issue', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('launch_issue', data)}
          />
        );

      default:
        return <Box>Done</Box>;
    }
  };

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
