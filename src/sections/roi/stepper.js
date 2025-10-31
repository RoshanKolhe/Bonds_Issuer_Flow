import { useState } from "react";
import MainFile from "./stepThree/main";

import { Box, Stepper, Step, StepLabel, Card, Stack, Button } from '@mui/material';
import StepFour from "./stepFour";

const steps = ['1', '2', '3', '4', '5'];

export default function RoiStepper() {
    const [activeSteps, setActiveSteps] = useState(0)

    const renderForm = () => {
        switch (activeSteps) {
            case 0:
                return (
                    <MainFile
                        setActiveStep={setActiveSteps}
                    />
                );
            case 1:
                return (
                    <StepFour
                        activeStep={activeSteps}
                        setActiveStep={setActiveSteps}
                    />
                );
            //   case 2:
            //     return (
            //       <ProgramModule
            //         courseId={courseId}
            //         activeStep={activeStep}
            //         setActiveStep={setActiveStep}
            //         currentModules={currentPlan?.courses?.programModules}
            //       />
            //     );
            //   case 3:
            //     return (
            //       <Tools
            //         courseId={courseId}
            //         activeStep={activeStep}
            //         setActiveStep={setActiveStep}
            //         currentTools={currentPlan?.courses?.tools}
            //       />
            //     );
            //   case 4:
            // return (
            //   <Faq
            //     courseId={courseId}
            //     activeStep={activeStep}
            //     setActiveStep={setActiveStep}
            //     currentplansFaqs={currentPlan?.courses?.plansFaqs}
            //   />
            // );
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