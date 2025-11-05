import { useState } from "react";
import MainFile from "./stepThree/main";

import { Box, Stepper, Step, StepLabel, Card, Stack, Button } from '@mui/material';
import StepFour from "./stepFour";
import FundPositionForm from "./fund-positions";
import PreliminaryBondRequirements from "./preliminary-bond-requirements";

const steps = ['1', '2', '3', '4'];

export default function RoiStepper() {
    const [activeSteps, setActiveSteps] = useState(0)
    const [formData, setFormData] = useState(null)

    const renderForm = () => {
        switch (activeSteps) {
            case 0:
                return (
                    <FundPositionForm
                        currentFund={formData}
                        setActiveStep={setActiveSteps}
                        onSave={(data) => setFormData(data)}
                    />
                );
            case 1:
                return (
                    <MainFile
                    currentDetails={formData}
                        setActiveStep={setActiveSteps}
                        onSave={(data)=> setFormData(data)}
                    />
                );
            case 2:
                return (
                    <StepFour
                       currentFinancial={formData}
                        setActiveStep={setActiveSteps}
                        onSave={(data)=> setFormData(data)}
                    />
                );
            case 3:
                return (
                    <PreliminaryBondRequirements
                    currentBondRequirements={formData}
                        setActiveStep={setActiveSteps}
                        onSave={(data)=> setFormData(data)}
                    />
                );
            default:
                return (
                    <Box sx={{ p: 3 }}>
                        <h3>All steps completed successfully!</h3>
                    </Box>
                );
        }
    }
    return (
        <Card sx={{ p: 3, boxShadow: 'none' }}>

            <Stepper activeStep={activeSteps} sx={{ mb: 3 }}>
                {steps.map((_, index) => (
                    <Step key={index}>
                        <StepLabel />
                    </Step>
                ))}
            </Stepper>
            <Stack spacing={3}>{renderForm()}</Stack>
        </Card>
    );
}