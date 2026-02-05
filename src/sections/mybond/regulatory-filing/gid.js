import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { NewGID } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';
import { AutoFill } from 'src/forms-autofilled-script/autofill';

export default function GID({ currentData, saveStepData, setPercent, setProgress }) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    filingDateGid: Yup.string().required('Filing Date is required'),
    fileNameGid: Yup.string().required('File Name is required'),
    referenceNoGid: Yup.string().required('Reference No is required'),
    approvalNoGid: Yup.string().required('Approval Number is required'),
    gid: Yup.mixed().required('GID upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    filingDateGid: '',
    fileNameGid: '',
    referenceNoGid: '',
    approvalNoGid: '',
    gid: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, watch, reset, setValue } = methods;

  const filingDateGid = watch('filingDateGid');
  const fileNameGid = watch('fileNameGid');
  const referenceNoGid = watch('referenceNoGid');
  const approvalNoGid = watch('approvalNoGid');
  const gid = watch('gid');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (filingDateGid) completed++;
    if (fileNameGid) completed++;
    if (referenceNoGid) completed++;
    if (approvalNoGid) completed++;
    if (gid) completed++;

    const pct = Math.round((completed / 5) * 35);

    setPercent?.(pct);
    setProgress?.(pct === 35);
  }, [
    filingDateGid,
    fileNameGid,
    referenceNoGid,
    approvalNoGid,
    gid,
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
    const data = NewGID();
    AutoFill({ setValue, fields: data });
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      filingDateGid: data.filingDateGid,
      fileNameGid: data.fileNameGid,
      referenceNoGid: data.referenceNoGid,
      approvalNoGid: data.approvalNoGid,
      gid: data.gid,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('GID saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            GID
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDateGid" label="Filing Date" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNameGid" label="File Name" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoGid" label="Reference No" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="approvalNoGid" label="Approval Number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="gid"
                label="Upload GID"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="gid" />
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
