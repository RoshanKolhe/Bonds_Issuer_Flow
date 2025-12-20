import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { enqueueSnackbar } from 'notistack';

/* ---------------- YUP SCHEMA ---------------- */

export default function IsinActivationFinalization({
  currentIsin,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const IsinSchema = Yup.object().shape({
    ISIN: Yup.string()
      .required('ISIN is required')
      .matches(/^INE[0-9A-Z]{10}$/, 'Invalid ISIN format'),

    activationDate: Yup.date().required('Activation date is required'),

    isinLetter: Yup.mixed().required('ISIN confirmation letter is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    ISIN: '',
    activationDate: null,
    isinLetter: null,
  };

  const methods = useForm({
    resolver: yupResolver(IsinSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset, setValue } = methods;

  const watched = watch(['ISIN', 'activationDate', 'isinLetter']);

  useEffect(() => {
    let completed = 0;
    if (watched[0]) completed++;
    if (watched[1]) completed++;
    if (watched[2]) completed++;

    const pct = Math.round((completed / 3) * 100);
    setPercent?.(pct);
    setProgress?.(pct === 100);
  }, [watched, setPercent, setProgress]);

  useEffect(() => {
    if (currentIsin && Object.keys(currentIsin).length > 0) {
      reset({
        ...defaultValues,
        ...currentIsin,
        activationDate: currentIsin.activationDate ? new Date(currentIsin.activationDate) : null,
      });
    }
  }, [currentIsin, reset]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.(data);
    setPercent?.(100);
    setProgress?.(true);
    enqueueSnackbar('ISIN Activation saved', { variant: 'success' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600}>
              ISIN Activation & Finalization
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField name="ISIN" label="ISIN*" fullWidth />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="activationDate"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Activation Date*"
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
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="isinLetter"
              label="Upload ISIN Confirmation Letter*"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="isinLetter" />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained">
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
