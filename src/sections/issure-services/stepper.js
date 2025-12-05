import { useState, useEffect } from "react";
import MainFile from "./stepThree/main";
import { Box, Card, Stack, Typography } from "@mui/material";

import FundPositionForm from "./fund-positions";
import PreliminaryBondRequirements from "./preliminary-bond-requirements";
import { RouterLink } from "src/routes/components";
import FinancialDetails from "./stepFour/financial-details";
import AuditedFinancial from "./audited-financial/audited-financial";

// -------------------- Dynamic Stepper ------------------------
function DynamicStepper({ steps, activeStep, percent, onStepClick }) {

  const getColorByPercent = (percent) => {
    if (percent <= 25) return { border: '#ef4444', text: '#ef4444' }; // red
    if (percent <= 50) return { border: '#f59e0b', text: '#f59e0b' }; // yellow
    if (percent <= 75) return { border: '#22c55e', text: '#22c55e' }; // green
    return { border: '#15803d', text: '#15803d' }; // dark green
  };

  const percentColor = getColorByPercent(percent);

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={3}
      sx={{ width: '100%', pt: 4, overflowX: 'auto' }}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;

        const colorToUse = isActive
          ? percentColor
          : { border: '#d1d5db', text: '#6b7280' }; 

        return (
          <Stack
            key={step.number}
            alignItems="center"
            spacing={1}
            sx={{ cursor: "pointer", minWidth: 80 }}
            onClick={() => onStepClick(index)}
          >
            {/* Circle with progress only on active */}
            <Box sx={{ position: "relative", width: 40, height: 40 }}>
              <svg width="100%" height="100%" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none" />

                {isActive && (
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    stroke={colorToUse.border}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="100"
                    strokeDashoffset={100 - percent}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                )}
              </svg>

              {/* Step number */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {step.number}
                </Typography>
              </Box>
            </Box>

            {/* Label */}
            <Box sx={{ textAlign: "center" }}>
              {step.lines.map((line, i) => (
                <Typography
                  key={i}
                  sx={{ color: colorToUse.text, fontSize: "0.75rem", lineHeight: 1.2 }}
                >
                  {line}
                </Typography>
              ))}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}


// -------------------- ROI STEPPER IMPLEMENTATION ------------------------

const steps = [
  { number: 1, lines: ["Fund", "Position"] },
  { number: 2, lines: ["Audited", "Financial"] },
  { number: 3, lines: ["Borrowing", "Details"] },
  { number: 4, lines: ["Profit &", "Capital"] },
  { number: 5, lines: ["Preliminary", "Requirements"] },

];

export default function RoiStepper({ percent }) {
  const [activeSteps, setActiveSteps] = useState(() => {
    const saved = Number(localStorage.getItem("roi_active_step"));
    return !isNaN(saved) && saved >= 0 && saved < steps.length ? saved : 0;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("roi_form_data");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    localStorage.setItem("roi_active_step", activeSteps);
  }, [activeSteps]);

  useEffect(() => {
    localStorage.setItem("roi_form_data", JSON.stringify(formData));
  }, [formData]);

  const handleSave = (key, data) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev?.[key] || {}),
        ...data,
      },
    }));
  };
  const [percentValue, setPercentValue] = useState(0);


  const renderForm = () => {
    switch (activeSteps) {
      case 0:
        return (
          <FundPositionForm
            currentFund={formData?.fundPosition}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
            percent={setPercentValue}
          />
        );
      case 1:
        return (
          <AuditedFinancial
            currentBondRequirements={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
            percent={setPercentValue}
          />
        );
      case 2:
        return (
          <MainFile
            currentDetails={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
            percent={setPercentValue}
          />
        );
      case 3:
        return (
          <FinancialDetails
            currentFinancial={formData?.financialDetails}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
            percent={setPercentValue}
          />
        );
      case 4:
        return (
          <PreliminaryBondRequirements
            currentBondRequirements={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
            percent={setPercentValue}
          />
        );
      default:
        return <Box sx={{ p: 3 }}>All steps completed!</Box>;
    }
  };


  return (
    <Card sx={{ p: 3, boxShadow: "none" }}>
      {/*  REPLACED MUI STEPPER WITH CUSTOM STEPPER  */}
      <DynamicStepper
        steps={steps}
        activeStep={activeSteps}
        percent={percentValue}   //  THIS IS NEW
        onStepClick={(step) => setActiveSteps(step)}
      />
      <Stack spacing={3} sx={{ mt: 3 }}>
        {renderForm()}
      </Stack>
    </Card>
  );
}
