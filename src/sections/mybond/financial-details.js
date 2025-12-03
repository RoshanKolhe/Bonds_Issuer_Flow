/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import PropTypes from 'prop-types';

export default function FinancialDetails({ currentFinancial, setActiveStep, onSave, percent }) {

  const MainSchema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    returnOnAssets: Yup.string().required('Return on Assets (ROA) is required'),
    debtServiceCoverageRatio: Yup.string().required('DSCR is required'),
  });

  const defaultValues = useMemo(() => ({
    debtEquityRatio: currentFinancial?.debtEquityRatio || '',
    currentRatio: currentFinancial?.currentRatio || '',
    netWorth: currentFinancial?.netWorth || '',
    quickRatio: currentFinancial?.quickRatio || '',
    returnOnEquity: currentFinancial?.returnOnEquity || '',
    returnOnAssets: currentFinancial?.returnOnAssets || '',
    debtServiceCoverageRatio: currentFinancial?.debtServiceCoverageRatio || '',
  }), [currentFinancial]);

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (currentFinancial) {
      reset(defaultValues);
      // Auto set percent 100% if data already exists (edit mode or refresh)
      percent?.(100);
    }
  }, [currentFinancial, reset, defaultValues, percent]);

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    const values = methods.getValues();
    onSave("financialDetails", values);

    percent?.(100); // ######## Progress fully completed #######

    setActiveStep( 4);
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            sx={{
              border: '2px solid #1877F2',
              pl: 2,
              py: 2,
            }}
          >
            <Typography variant="h3" color="#1877F2" fontWeight={600}>
              Financial Ratios
            </Typography>
            <Typography variant="body1" color="#5E5E5E">
              Provide your company’s key financial ratios to assess financial health
            </Typography>
          </Box>

          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="currentRatio" label="Current Ratio" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="netWorth" label="Net Worth" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="quickRatio" label="Quick Ratio" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="returnOnEquity" label="Return on Equity (ROE)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField name="returnOnAssets" label="Return on Assets (ROA)" fullWidth />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="debtServiceCoverageRatio"
                  label="Debt Service Coverage Ratio (DSCR)"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </FormProvider>

      {/* Footer Buttons Section */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" sx={{ color: '#000' }} onClick={() => setActiveStep(2)}>
          Cancel
        </Button>

        <LoadingButton variant="contained" sx={{ color: '#fff' }} onClick={handleNext}>
          Next
        </LoadingButton>
      </Box>
    </>
  );
}

FinancialDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentFinancial: PropTypes.object,
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
