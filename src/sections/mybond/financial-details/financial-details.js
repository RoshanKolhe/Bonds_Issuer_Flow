/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import PropTypes from 'prop-types';

export default function FinancialDetails({
  currentDetails,
  currentCapitalDetails,
  currentProfitabilityDetails,
  currentFundPosition,
  currentBorrowingDetails,
  setPercent,
  setProgress,
}) {
  const MainSchema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    returnOnAssets: Yup.string().required('Return on Assets (ROA) is required'),
  });

  const toNumber = (value) => {
    const numericValue = parseFloat(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const formatRatio = (value) => {
    if (!Number.isFinite(value)) return '';
    return value.toFixed(2);
  };

  const calculatedRatios = useMemo(() => {
    const netWorth = toNumber(currentCapitalDetails?.netWorth);
    const totalDebt = (currentBorrowingDetails || []).reduce(
      (sum, item) => sum + toNumber(item?.lenderAmount),
      0
    );

    const cashBalance = toNumber(currentFundPosition?.cashBalance);
    const bankBalance = toNumber(currentFundPosition?.bankBalance);
    const cashAndBankBalance = toNumber(currentFundPosition?.cashAndBankBalance);
    const currentAssets = toNumber(currentFundPosition?.currentAssets) || (cashBalance + bankBalance) || cashAndBankBalance;
    const quickAssets = toNumber(currentFundPosition?.quickAssets) || cashAndBankBalance || currentAssets;
    const currentLiabilities = toNumber(currentFundPosition?.currentLiabilitiesAmount);

    const netProfit = toNumber(currentProfitabilityDetails?.netProfit);
    return {
      debtEquityRatio: netWorth > 0 && totalDebt > 0 ? formatRatio(totalDebt / netWorth) : '',
      currentRatio:
        currentLiabilities > 0 && currentAssets > 0 ? formatRatio(currentAssets / currentLiabilities) : '',
      netWorth: netWorth > 0 ? formatRatio(netWorth) : '',
      quickRatio:
        currentLiabilities > 0 && quickAssets > 0 ? formatRatio(quickAssets / currentLiabilities) : '',
      returnOnEquity:
        netWorth > 0 && netProfit !== 0 ? formatRatio((netProfit / netWorth) * 100) : '',
      returnOnAssets:
        currentAssets > 0 && netProfit !== 0 ? formatRatio((netProfit / currentAssets) * 100) : '',
    };
  }, [currentCapitalDetails, currentBorrowingDetails, currentFundPosition, currentProfitabilityDetails]);

  const defaultValues = useMemo(
    () => ({
      debtEquityRatio: calculatedRatios.debtEquityRatio || currentDetails?.debtEquityRatio || '',
      currentRatio: calculatedRatios.currentRatio || currentDetails?.currentRatio || '',
      netWorth: calculatedRatios.netWorth || currentDetails?.netWorth || '',
      quickRatio: calculatedRatios.quickRatio || currentDetails?.quickRatio || '',
      returnOnEquity: calculatedRatios.returnOnEquity || currentDetails?.returnOnEquity || '',
      returnOnAssets: calculatedRatios.returnOnAssets || currentDetails?.returnOnAssets || '',
    }),
    [calculatedRatios, currentDetails]
  );

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { watch, reset } = methods;
  const values = watch();

  const REQUIRED_FIELDS = [
    'debtEquityRatio',
    'currentRatio',
    'netWorth',
    'quickRatio',
    'returnOnEquity',
    'returnOnAssets',
  ];

  useEffect(() => {
    let completed = 0;

    REQUIRED_FIELDS.forEach((field) => {
      if (values[field]) completed += 1;
    });

    const percentVal = Math.round((completed / REQUIRED_FIELDS.length) * 100);
    setPercent?.(percentVal / 2);
    setProgress?.(percentVal === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <FormProvider methods={methods}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            Financial Ratios
          </Typography>
          <Typography variant="body2" mb={3}>
            Auto-calculated ratios based on financial details entered above
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="currentRatio" label="Current Ratio" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="netWorth" label="Net Worth" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="quickRatio" label="Quick Ratio" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnEquity" label="Return on Equity (ROE)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnAssets" label="Return on Assets (ROA)" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}

FinancialDetails.propTypes = {
  currentDetails: PropTypes.object,
  currentCapitalDetails: PropTypes.object,
  currentProfitabilityDetails: PropTypes.object,
  currentFundPosition: PropTypes.object,
  currentBorrowingDetails: PropTypes.array,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
