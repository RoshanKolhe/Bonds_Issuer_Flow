import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  Alert,
  Link,
  MenuItem,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { AutoFill } from 'src/forms-autofilled-script/autofill';
import { NewISINApplication } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';
import InstructionModal from 'src/components/instruction-modal/instruction-modal';

/* ---------------- SCHEMA ---------------- */

const Schema = Yup.object().shape({
  depository: Yup.string()
    .oneOf(['NSDL', 'CDSL'])
    .required('Depository is required'),

  isinApplicationDate: Yup.date()
    .nullable()
    .required('ISIN application date is required'),

  isinCode: Yup.string()
    .required('ISIN is required')
    .matches(/^INE[0-9A-Z]{10}$/, 'Enter a valid ISIN'),

  isinAllotmentLetter: Yup.mixed()
    .required('ISIN allotment letter is required'),
});

/* ---------------- COMPONENT ---------------- */

export default function IsinApplication({
  currentData,
  saveStepData,
  percent,
  setActiveStepId,
}) {
  const [openInstructions, setOpenInstructions] = useState(false);

  /* ---------------- DEFAULT VALUES ---------------- */

  const defaultValues = {
    depository: '',
    isinApplicationDate: null,
    isinCode: '',
    isinAllotmentLetter: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset, setValue } = methods;

  const depository = watch('depository');
  const applicationDate = watch('isinApplicationDate');
  const isinCode = watch('isinCode');
  const allotmentLetter = watch('isinAllotmentLetter');

  const instructionTitle = 'ISIN Application Flow';
  const instructionItems = [
    "If you do not have the document pack, click 'Generate ISIN Application Draft'.",
    'Submit the generated ISIN application to the selected depository (NSDL or CDSL).',
    'After ISIN allotment, capture the allotted ISIN and application date here.',
    'Upload the ISIN allotment letter and save to proceed to the next step.',
  ];

  /* ---------------- PERCENT (BINARY) ---------------- */

  useEffect(() => {
    percent?.(
      depository && applicationDate && isinCode && allotmentLetter ? 100 : 0
    );
  }, [depository, applicationDate, isinCode, allotmentLetter, percent]);

  /* ---------------- PREFILL (EDIT MODE) ---------------- */

  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
        isinApplicationDate: currentData.isinApplicationDate
          ? new Date(currentData.isinApplicationDate)
          : null,
      });
      percent?.(100);
    }
  }, [currentData, reset, percent]);

  /* ---------------- GENERATE DRAFT ---------------- */

  const handleGenerateDraft = () => {
    // Later: backend call / PDF / Excel generator
    enqueueSnackbar('ISIN application data pack generated successfully', {
      variant: 'success',
    });
  };

  const handleAutoFill = () => {
    const data = NewISINApplication();
    AutoFill({ setValue, fields: data });
  };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (data) => {
    const payload = {
      depository: data.depository,
      isinApplicationDate: data.isinApplicationDate,
      isinCode: data.isinCode,
      isinAllotmentLetter: data.isinAllotmentLetter,
      isinStatus: 'ALLOTTED',
    };

    saveStepData?.(payload);
    percent?.(100);

    // ✅ NEXT STEP: EXECUTE DOCUMENT
    setActiveStepId?.('execute_document');

    enqueueSnackbar('ISIN application details saved successfully', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            ISIN Application & Allotment
          </Typography>

          {/* INFO MESSAGE */}
          <Alert severity="info" sx={{ mb: 3 }}>
            ISIN application is made to the depository (NSDL/CDSL) and the ISIN
            is allotted. Activation will be permitted only after execution of
            debenture trust deed and security documents.{' '}
            <Link
              component="button"
              type="button"
              underline="always"
              onClick={() => setOpenInstructions(true)}
              sx={{ fontWeight: 600 }}
            >
              View flow instructions
            </Link>
          </Alert>

          {/* GENERATED DRAFT SECTION */}
          <Card
            variant="outlined"
            sx={{ mb: 3, p: 2, backgroundColor: '#fafafa' }}
          >
            <Typography fontWeight={600} mb={1}>
              Generated Drafts / Data Pack
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography>
                ISIN Application Data Pack (Depository Format)
              </Typography>

              <Button
                variant="outlined"
                onClick={handleGenerateDraft}
              >
                Generate ISIN Application Draft
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary">
              This data pack is system-generated for submission by the Issuer /
              RTA to the depository.
            </Typography>
          </Card>

          {/* FORM */}
          <Grid container spacing={3}>
            {/* DEPOSITORY */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="depository"
                label="Depository"
                select
                fullWidth
              >
                <MenuItem value="NSDL">NSDL</MenuItem>
                <MenuItem value="CDSL">CDSL</MenuItem>
              </RHFTextField>
            </Grid>

            {/* APPLICATION DATE */}
            <Grid item xs={12} md={4}>
              <Controller
                name="isinApplicationDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="ISIN Application Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldState.error,
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* ISIN CODE */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="isinCode"
                label="Allotted ISIN"
                placeholder="INE1234567890"
                fullWidth
              />
            </Grid>

            {/* ISIN ALLOTMENT LETTER */}
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="isinAllotmentLetter"
                label="Upload ISIN Allotment Letter"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="isinAllotmentLetter" />
            </Grid>
          </Grid>

          {/* ACTIONS */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" onClick={handleAutoFill}>
              Autofill
            </Button>
            <LoadingButton type="submit" variant="contained">
              Save & Continue
            </LoadingButton>
          </Box>
        </Card>
      </Container>

      <InstructionModal
        open={openInstructions}
        onClose={() => setOpenInstructions(false)}
        title={instructionTitle}
        instructions={instructionItems}
      />
    </FormProvider>
  );
}
