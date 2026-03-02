import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFDatePicker, RHFPriceField } from 'src/components/hook-form';
import { useParams } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function AuditedFinancial({ currentFinancialStatements, setPercent, setProgress }) {
  const { applicationId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const getFinancialYears = (baseDate) => {
    if (!baseDate) return [];
    const year = new Date(baseDate).getFullYear();

    return [
      { key: 'year1', startYear: year - 3, endYear: year - 2 },
      { key: 'year2', startYear: year - 2, endYear: year - 1 },
      { key: 'year3', startYear: year - 1, endYear: year },
    ];
  };

  const schema = Yup.object().shape({
    baseDate: Yup.date().nullable().required('Base date is required'),
    amounts: Yup.object().shape({
      year1: Yup.number().typeError('Amount is required').required('Amount is required'),
      year2: Yup.number().typeError('Amount is required').required('Amount is required'),
      year3: Yup.number().typeError('Amount is required').required('Amount is required'),
    }),
  });

  const defaultValues = useMemo(() => {
    if (currentFinancialStatements?.length >= 3) {
      const sorted = [...currentFinancialStatements]
        .sort((a, b) => (a.periodStartYear || 0) - (b.periodStartYear || 0))
        .slice(-3);

      return {
        baseDate: sorted[2]?.periodEndYear ? new Date(`${sorted[2].periodEndYear}-03-31`) : new Date(),
        amounts: {
          year1: sorted[0]?.amount || '',
          year2: sorted[1]?.amount || '',
          year3: sorted[2]?.amount || '',
        },
      };
    }

    return {
      baseDate: new Date(),
      amounts: {
        year1: '',
        year2: '',
        year3: '',
      },
    };
  }, [currentFinancialStatements]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const financialYears = getFinancialYears(values.baseDate);

  useEffect(() => {
    const completed =
      values.baseDate &&
      values.amounts?.year1 !== '' &&
      values.amounts?.year2 !== '' &&
      values.amounts?.year3 !== '';

    const percentValue = completed ? 100 : 0;
    setPercent?.(percentValue);
    setProgress?.(completed);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    if (currentFinancialStatements?.length) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentFinancialStatements, defaultValues, reset, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const years = getFinancialYears(data.baseDate);
      const payload = {
        baseDate: data.baseDate,
        financialStatements: years.map((year, idx) => ({
          periodStartYear: year.startYear,
          periodEndYear: year.endYear,
          amount: data.amounts[`year${idx + 1}`],
        })),
      };

      const response = await axiosInstance.patch(
        `/bond-estimations/financial-details/${applicationId}`,
        payload
      );

      if (response?.data?.success) {
        enqueueSnackbar('3-year financial statement saved', { variant: 'success' });
        setProgress?.(true);
      }
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message || 'Failed to save 3-year financial statement',
        { variant: 'error' }
      );
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={1}>
          3-Year Financial Statement
        </Typography>
        {/* <Typography variant="body2" mb={3}>
          Select a base date to auto-map last 3 financial years and enter amounts
        </Typography> */}

        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={4}>
            <RHFDatePicker name="baseDate" label="Base Date" control={control} />
          </Grid> */}

          {financialYears.map((fy, index) => (
            <Grid item xs={12} md={4} key={fy.key}>
              <RHFPriceField
                name={`amounts.year${index + 1}`}
                label={`FY ${fy.startYear}-${String(fy.endYear).slice(-2)} Amount`}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton loading={isSubmitting} type="submit" variant="contained" sx={{ color: '#fff' }}>
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

AuditedFinancial.propTypes = {
  currentFinancialStatements: PropTypes.array,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
