import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function TrusteeDueDiligence({ currentData, saveStepData, setPercent, setProgress }) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    trusteeDueDiligence: Yup.mixed().required('Upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    trusteeDueDiligence: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const principle = watch('principle');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (principle) completed++;

    const pct = Math.round((completed / 1) * 20);

    setPercent?.(pct);
    setProgress?.(pct === 20);
  }, [principle, setPercent, setProgress]);

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

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      trusteeDueDiligence: data.trusteeDueDiligence,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('Trustee Due Diligence saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Trustee Due Diligence 
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="trusteeDueDiligence"
                label="Upload Trustee Due Diligence"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="trusteeDueDiligence" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained">
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Container>
    </FormProvider>
  );
}
