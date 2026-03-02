import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFDatePicker, RHFPriceField } from 'src/components/hook-form';
import { useParams } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function FundPosition({ currentFundPosition, setPercent, setProgress }) {
  const { applicationId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const newFundPositionSchema = Yup.object().shape({
    cashAndBankBalance: Yup.string().required('Cash and bank balance is required'),
    cashAndBankBalanceDate: Yup.date().nullable().required('Date is required'),
    inventoryAmount: Yup.string().required('Inventory amount is required'),
    prepaidExpensesAmount: Yup.string().required('Prepaid expenses amount is required'),
    otherCurrentAssetsAmount: Yup.string().required('Other current assets amount is required'),
    currentAssets: Yup.string().required('Current assets is required'),
    quickAssets: Yup.string().required('Quick assets is required'),
    totalAssets: Yup.string().required('Total assets is required'),
    currentLiabilitiesAmount: Yup.string().required('Current liabilities amount is required'),
    currentAssetsAndLiabilitiesDate: Yup.date().nullable().required('Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      cashAndBankBalance: currentFundPosition?.cashAndBankBalance || '',
      cashAndBankBalanceDate: currentFundPosition?.cashAndBankBalanceDate
        ? new Date(currentFundPosition.cashAndBankBalanceDate)
        : null,
      inventoryAmount: currentFundPosition?.inventoryAmount || '',
      prepaidExpensesAmount: currentFundPosition?.prepaidExpensesAmount || '',
      otherCurrentAssetsAmount: currentFundPosition?.otherCurrentAssetsAmount || '',
      currentAssets: currentFundPosition?.currentAssets || '',
      quickAssets: currentFundPosition?.quickAssets || '',
      totalAssets: currentFundPosition?.totalAssets || '',
      currentLiabilitiesAmount: currentFundPosition?.currentLiabilitiesAmount || '',
      currentAssetsAndLiabilitiesDate: currentFundPosition?.currentAssetsAndLiabilitiesDate
        ? new Date(currentFundPosition.currentAssetsAndLiabilitiesDate)
        : null,
    }),
    [currentFundPosition]
  );

  const methods = useForm({
    resolver: yupResolver(newFundPositionSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const cashAndBank = parseFloat(values.cashAndBankBalance || 0);
    const inventory = parseFloat(values.inventoryAmount || 0);
    const prepaidExpenses = parseFloat(values.prepaidExpensesAmount || 0);
    const otherCurrentAssets = parseFloat(values.otherCurrentAssetsAmount || 0);

    if (
      !values.cashAndBankBalance &&
      !values.inventoryAmount &&
      !values.prepaidExpensesAmount &&
      !values.otherCurrentAssetsAmount
    ) {
      setValue('currentAssets', '');
      setValue('quickAssets', '');
      setValue('totalAssets', '');
      return;
    }

    const currentAssets = cashAndBank + inventory + prepaidExpenses + otherCurrentAssets;
    const quickAssets = cashAndBank + otherCurrentAssets;

    setValue('currentAssets', currentAssets.toFixed(2));
    setValue('quickAssets', quickAssets.toFixed(2));
    setValue('totalAssets', currentAssets.toFixed(2));
  }, [
    values.cashAndBankBalance,
    values.inventoryAmount,
    values.prepaidExpensesAmount,
    values.otherCurrentAssetsAmount,
    setValue,
  ]);

  useEffect(() => {
    let completed = 0;

    if (values.cashAndBankBalance) completed += 1;
    if (values.cashAndBankBalanceDate) completed += 1;
    if (values.inventoryAmount) completed += 1;
    if (values.prepaidExpensesAmount) completed += 1;
    if (values.otherCurrentAssetsAmount) completed += 1;
    if (values.currentAssets) completed += 1;
    if (values.quickAssets) completed += 1;
    if (values.currentLiabilitiesAmount) completed += 1;
    if (values.currentAssetsAndLiabilitiesDate) completed += 1;

    const percentVal = (completed / 9) * 100;
    setPercent?.(percentVal);
    setProgress?.(percentVal === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    if (currentFundPosition) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentFundPosition, defaultValues, reset, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.patch(
        `/bond-estimations/fund-positions/${applicationId}`,
        data
      );

      if (response.data.success) {
        enqueueSnackbar('Fund position saved successfully', { variant: 'success' });
        setProgress?.(true);
      }
    } catch (error) {
      enqueueSnackbar('Error while saving fund position', { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold">
          Fund Position
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Add and manage your liquidity and working capital details
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Cash and Bank Balance
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFPriceField name="cashAndBankBalance" label="Cash and Bank Balance" fullWidth />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFDatePicker
              name="cashAndBankBalanceDate"
              control={control}
              label="Cash and Bank Balance Date"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Working Capital Position
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="inventoryAmount"
              label="Inventory"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="prepaidExpensesAmount"
              label="Prepaid Expenses"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="otherCurrentAssetsAmount"
              label="Other Current Assets"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="currentAssets"
              label="Current Assets"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="quickAssets"
              label="Quick Assets"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFPriceField
              name="currentLiabilitiesAmount"
              label="Current Liabilities"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFDatePicker
              name="currentAssetsAndLiabilitiesDate"
              control={control}
              label="Current Assets and Liabilities Date"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
            sx={{ color: '#fff' }}
          >
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

FundPosition.propTypes = {
  currentFundPosition: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
