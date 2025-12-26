import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function InPrincipleApproval({
  currentData,
  saveStepData,
  setPercent,
  setProgress,
}) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    principleApprovalNo: Yup.string().required('Approval number is required'),
    principleDate: Yup.date().nullable().required('Date is required'),
    principle: Yup.mixed().required('Upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    principleApprovalNo: '',
    principleDate: null,
    principle: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const principleApprovalNo = watch('principleApprovalNo');
  const principleDate = watch('principleDate');
  const principle = watch('principle');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (principleApprovalNo) completed++;
    if (principleDate) completed++;
    if (principle) completed++;

    const pct = Math.round((completed / 3) * 20);

    setPercent?.(pct);
    setProgress?.(pct === 20);
  }, [
    principleApprovalNo,
    principleDate,
    principle,
    setPercent,
    setProgress,
  ]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
        principleDate: currentData.principleDate
          ? new Date(currentData.principleDate)
          : null,
      });

      setPercent?.(20);
      setProgress?.(true);
    }
  }, [currentData, reset, setPercent, setProgress]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      principleApprovalNo: data.principleApprovalNo,
      principleDate: data.principleDate,
      principle: data.principle,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('In-Principle Approval saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            In-Principle Listing Approval
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="principleApprovalNo"
                label="Approval Number"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="principleDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Approval Date"
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
                name="principle"
                label="Upload In-Principle Approval"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="principle" />
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
