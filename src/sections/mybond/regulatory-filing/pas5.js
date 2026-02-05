import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { NewPAS5 } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';
import { AutoFill } from 'src/forms-autofilled-script/autofill';

export default function PAS5({ currentData, saveStepData, setPercent, setProgress }) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    filingDatePas5: Yup.string().required('Filing Date is required'),
    fileNamePas5: Yup.string().required('File Name is required'),
    referenceNoPas5: Yup.string().required('Reference No is required'),
    approvalNoPas5: Yup.string().required('Approval Number is required'),
    pas5: Yup.mixed().required('PAS-5 upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    filingDatePas5: '',
    fileNamePas5: '',
    referenceNoPas5: '',
    approvalNoPas5: '',
    pas5: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, watch, reset, setValue } = methods;

  const filingDatePas5 = watch('filingDatePas5');
  const fileNamePas5 = watch('fileNamePas5');
  const referenceNoPas5 = watch('referenceNoPas5');
  const approvalNoPas5 = watch('approvalNoPas5');
  const pas5 = watch('pas5');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (filingDatePas5) completed++;
    if (fileNamePas5) completed++;
    if (referenceNoPas5) completed++;
    if (approvalNoPas5) completed++;
    if (pas5) completed++;

    const pct = Math.round((completed / 5) * 35);

    setPercent?.(pct);
    setProgress?.(pct === 35);
  }, [
    filingDatePas5,
    fileNamePas5,
    referenceNoPas5,
    approvalNoPas5,
    pas5,
    setPercent,
    setProgress,
  ]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
      });

      setPercent?.(20);
      setProgress?.(true);
    }
  }, [currentData, reset, setPercent, setProgress]);

  /* ---------------- AUTOFILL ---------------- */
  const handleAutoFill = () => {
    const data = NewPAS5();
    AutoFill({ setValue, fields: data });
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      filingDatePas5: data.filingDatePas5,
      fileNamePas5: data.fileNamePas5,
      referenceNoPas5: data.referenceNoPas5,
      approvalNoPas5: data.approvalNoPas5,
      pas5: data.pas5,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('PAS-5 saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            PAS-5
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDatePas5" label="Filing Date" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNamePas5" label="File Name" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoPas5" label="Reference No" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="approvalNoPas5" label="Approval Number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="pas5"
                label="Upload PAS-5"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="pas5" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleAutoFill}>
              Autofill
            </Button>

            <LoadingButton type="submit" variant="contained">
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Container>
    </FormProvider>
  );
}
