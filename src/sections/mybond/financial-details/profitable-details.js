import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFPriceField, RHFTextField } from 'src/components/hook-form';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { NewProfitabilityDetails } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';
import { AutoFill } from 'src/forms-autofilled-script/autofill';
import { Button } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'react-router';
export default function ProfitabilityDetails({
  currentDetails,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const profitableSchema = Yup.object().shape({
    netProfit: Yup.number()
      .typeError('Net Profit must be a number')
      .required('Net Profit is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: currentDetails?.netProfit || '',
    }),
    [currentDetails]
  );

  const methods = useForm({
    resolver: yupResolver(profitableSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const REQUIRED_FIELDS = ['netProfit'];

  // 🔹 SAME percent logic pattern (50% weight)
  const calculatePercent = () => {
    let completed = 0;

    REQUIRED_FIELDS.forEach((field) => {
      if (values[field]) completed++;
    });

    const percentVal = (completed / REQUIRED_FIELDS.length) * 50;
    setPercent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
  }, [values]);

  // 🔹 Restore on refresh / edit
  useEffect(() => {
    if (currentDetails && Object.keys(currentDetails).length > 0) {
      reset(defaultValues);
      setProgress?.(true);
      setPercent?.(50);
    }
  }, [currentDetails, reset, defaultValues, setProgress, setPercent]);

  const handleAutoFill = () => {
    const data = NewProfitabilityDetails();
    AutoFill({ setValue, fields: data });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.patch(
        `/bonds-pre-issue/profitability-details/${applicationId}`,
        data
      );

      if (response.data.success) {
        enqueueSnackbar('Profitability details saved successfully', { variant: 'success' });
        setProgress?.(true);
      }
    } catch (error) {
      console.error('Error while submitting profitability details:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h5" color="primary" fontWeight='bold' mb={2}>
            Profitability Details
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <RHFPriceField name="netProfit" label="Net Profit" fullWidth />
            </Grid>

          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={() => handleAutoFill()}>Autofill</Button>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" sx={{ color: '#fff' }}>
              Save
            </LoadingButton>
          </Box>

        </Card>
      </Box>
    </FormProvider>
  );
}

ProfitabilityDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  setCurrentFormCount: PropTypes.func,
};
