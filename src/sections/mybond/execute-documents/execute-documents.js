import { Box, Card, Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

export default function ExecuteDocument({
  currentExecuteDocument,
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const executeDocumentSchema = Yup.object().shape({
    debentureTrusteeDeed: Yup.mixed().required('Debenture Trustee Deed is required'),
    securityDocumt: Yup.mixed().required('Security Document is required'),
    escrowAgremment: Yup.mixed().required('Escrow Agreement is required'),
  });

  const defaultValues = {
    debentureTrusteeDeed: null,
    securityDocumt: null,
    escrowAgremment: null,
  };

  const methods = useForm({
    resolver: yupResolver(executeDocumentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const calculatePercent = () => {
    let completed = 0;

    if (values.debentureTrusteeDeed) completed++;
    if (values.securityDocumt) completed++;
    if (values.escrowAgremment) completed++;

    const p = Math.round((completed / 3) * 100);
    percent?.(p);
  };

  useEffect(() => {
    calculatePercent();
  }, [values.debentureTrusteeDeed, values.securityDocumt, values.escrowAgremment]);

  /* ---------------- PREFILL DATA ---------------- */
  useEffect(() => {
    if (currentExecuteDocument) {
      reset({
        ...defaultValues,
        ...currentExecuteDocument,
      });
    }
  }, [currentExecuteDocument, reset]);

  const onSubmit = (data) => {
    console.log('📌 Execute Document Data:', data);

    saveStepData?.(data);

    enqueueSnackbar('Execute Documents saved successfully', { variant: 'success' });

    setActiveStepId?.('launch_issue');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2, mb: '50px' }}>
        <Grid container spacing={3}>
          {/* Debenture Trustee Deed */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Execute Documents
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              E-sign Document
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="debentureTrusteeDeed"
              label="Upload Debenture Trustee Deed*"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="debentureTrusteeDeed" />
          </Grid>

          {/* Security Document */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="securityDocumt"
              label="Upload Security Document*"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="securityDocumt" />
          </Grid>

          {/* Escrow Agreement */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="escrowAgremment"
              label="Upload Escrow Agreement*"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="escrowAgremment" />
          </Grid>
        </Grid>
      </Card>
      <Grid item xs={12}>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            m: 2,
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ color: '#fff' }}
          >
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </FormProvider>
  );
}
