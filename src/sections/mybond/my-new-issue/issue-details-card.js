import * as Yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useGetInvestorCategories } from 'src/api/investorCategories';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useGetRedemptionTypes } from 'src/api/redemptionTypes';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'src/routes/hook';

export default function IssueDetailsCard({
  currentIssueDetail,
  setProgress,
  saveStepData,
  setPercent,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { investorCtegories, investorCtegoriesLoading } = useGetInvestorCategories();
  const [investorCategoriesData, setInvestorCategoriesData] = useState([]);

  const [redemptionType, setRedemptionType] = useState();
  const { redemptionTypes, redemptionTypesLoading } = useGetRedemptionTypes();

  const param = useParams();

  const { applicationId } = param;


  useEffect(() => {
    if (redemptionTypes && !redemptionTypesLoading) {
      setRedemptionType(redemptionTypes)
    }
  }, [redemptionTypes, redemptionTypesLoading])
  const paymentCycleOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quaterly', value: 'quarterly' },
    { label: 'Anually', value: 'annually' },
  ];
  const Schema = Yup.object().shape({
    issueType: Yup.string().required('Required'),
    securityType: Yup.bool().required('Please select security type'),
    issueSize: Yup.string().required('Required'),
    tenureYears: Yup.string().required('Required'),
    preferedInvestorCategory: Yup.string().when('issueType', {
      is: 'private',
      then: (schema) => schema.required('Investor category is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    couponRate: Yup.string().required('Required'),
    minimumInvestmentPrice: Yup.string().required('Required'),
    redemptionType: Yup.string().required('Required'),
    minimumPurchaseUnit: Yup.string().required('Required'),
    totalUnit: Yup.string().required('Required'),
  });

  const defaultValues = useMemo(
    () => ({
      issueType: currentIssueDetail?.issueType || 'public',
      securityType: currentIssueDetail?.securityType || true,
      issueSize: currentIssueDetail?.issueSize || '',
      tenureYears: currentIssueDetail?.tenureYears || '',
      couponRate: currentIssueDetail?.couponRate || '',
      minimumInvestmentPrice: currentIssueDetail?.minimumInvestmentPrice || '',
      redemptionType: currentIssueDetail?.redemptionType || '',
      minimumPurchaseUnit: currentIssueDetail?.minimumPurchaseUnit || '',
      totalUnit: currentIssueDetail?.totalUnit || '',
      preferedPaymentCycle: currentIssueDetail?.preferedInvestorCategory || '',
    }),
    [currentIssueDetail]
  );

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const requiredFields = [
    'issueType',
    'securityType',
    'issueSize',
    'tenureYears',
    'couponRate',
    'minimumInvestmentPrice',
    'redemptionType',
    'minimumPurchaseUnit',
    'totalUnit',
  ];

  useEffect(() => {
    let completed = 0;

    requiredFields.forEach((field) => {
      if (values[field]) completed++;
    });

    const percentValue = (completed / requiredFields.length) * 50;
    setPercent?.(percentValue);
  }, [values, setPercent]);

  useEffect(() => {
    if (currentIssueDetail && Object.keys(currentIssueDetail).length > 0) {
      reset(currentIssueDetail);
      setProgress?.(true);
    }
  }, [currentIssueDetail, reset, setProgress]);

  useEffect(() => {
    const size = parseFloat(values.issueSize);
    const units = parseFloat(values.totalUnit);
    const minUnit = parseFloat(values.minimumPurchaseUnit);

    if (size > 0 && units > 0 && minUnit > 0) {
      const minInvestment = (size / units) * minUnit;
      setValue('minimumInvestmentPrice', minInvestment.toFixed(2), {
        shouldValidate: true,
      });
    } else {
      setValue('minimumInvestmentPrice', '', { shouldValidate: false });
    }
  }, [values.issueSize, values.totalUnit, values.minimumPurchaseUnit, setValue]);

  const issueType = watch('issueType');
  const securityType = watch('securityType');
  const issueSize = watch('issueSize');
  const totalUnit = watch('totalUnit');
  const minimumPurchaseUnit = watch('minimumPurchaseUnit');

  const handleIssueTypeChange = (e, value) => {
    if (value !== null) setValue('issueType', value);
  };

  const handleSecurityTypeChange = (e, value) => {
    if (value !== null) setValue('securityType', value);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        placementType: data.issueType, // public / private

        isEbpIssue: false, // or true based on business logic

        tenure: Number(data.tenureYears),

        interestPaymentFrequency: data.preferedPaymentCycle, // 0/1/2

        minimumInvestment: Number(data.minimumInvestmentPrice),

        minimumUnitsToPurchase: Number(data.minimumPurchaseUnit),

        totalUnits: Number(data.totalUnit),

        issueSize: Number(data.issueSize),

        couponRate: Number(data.couponRate),

        securityType: data.securityType ? 'secured' : 'unsecured',
      };

      const response = await axiosInstance.patch(
        `/bonds-pre-issue/update-issue-details/${applicationId}`,
        payload
      );

      if (response.data.success) {
        setProgress(true);
        enqueueSnackbar('Issue details saved successfully', { variant: 'success' });
      }
    } catch (error) {
      const message =
        error?.response?.data?.error?.message || 'Failed to save issue details';
      enqueueSnackbar(message, { variant: 'error' });
      console.error(error);
    }
  });


  useEffect(() => {
    if (issueType === 'public') {
      setValue('preferedInvestorCategory', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [issueType, setValue]);

  useEffect(() => {
    if (investorCtegories && !investorCtegoriesLoading) {
      setInvestorCategoriesData(investorCtegories);
    }
  }, [investorCtegories, investorCtegoriesLoading]);

  useEffect(() => {
    if (currentIssueDetail) {
      reset(currentIssueDetail);
    }
  }, [currentIssueDetail]);

  useEffect(() => {
    const size = parseFloat(issueSize);
    const units = parseFloat(totalUnit);
    const minUnit = parseFloat(minimumPurchaseUnit);

    if (size > 0 && units > 0 && minUnit > 0) {
      const oneUnitPrice = size / units;
      const minInvestment = oneUnitPrice * minUnit;

      setValue('minimumInvestmentPrice', minInvestment.toFixed(2), {
        shouldValidate: true,
      });
    } else {
      setValue('minimumInvestmentPrice', '', { shouldValidate: false });
    }
  }, [issueSize, totalUnit, minimumPurchaseUnit, setValue]);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2, mb: '50px' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary">
            New Issue Setup
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Issue Type*
              </Typography>
              <ToggleButtonGroup
                value={issueType}
                exclusive
                onChange={handleIssueTypeChange}
                fullWidth
              >
                <ToggleButton value="public">Public</ToggleButton>
                <ToggleButton value="private">Private</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {issueType === 'private' && (
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Prefered Investor Category*
                </Typography>
                <RHFSelect name="preferedInvestorCategory">
                  <MenuItem value="">Select category</MenuItem>
                  {investorCategoriesData?.length > 0 ? (
                    investorCategoriesData.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No categories</MenuItem>
                  )}
                </RHFSelect>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Tenure (Years)*
              </Typography>
              <RHFTextField
                name="tenureYears"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Redemption Type*
              </Typography>
              <RHFSelect name="redemptionType">
                <MenuItem value="">Select Redemption</MenuItem>
                {redemptionType?.length > 0 ? (
                  redemptionType.map((red) => (
                    <MenuItem key={red.id} value={red.id}>
                      {red.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No categories</MenuItem>
                )}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Security Type*
              </Typography>
              <Controller
                name="securityType"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={field.value}
                    onChange={(e, val) => val !== null && field.onChange(val)}
                    fullWidth
                  >
                    <ToggleButton value={true}>Secured</ToggleButton>
                    <ToggleButton value={false}>Unsecured</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Interest Payment Cycle*
              </Typography>
              <Controller
                name="preferedPaymentCycle"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={field.value}
                    onChange={(e, val) => {
                      if (val !== null) {
                        field.onChange(val);
                      }
                    }}
                    fullWidth
                  >
                    {paymentCycleOptions.map((option) => (
                      <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Coupon Rate(%)*
              </Typography>
              <RHFTextField
                name="couponRate"
                placeholder="e.g., 5.25"
                onInput={(e) => {
                  let value = e.target.value;

                  // Allow only digits and at most one decimal
                  value = value.replace(/[^0-9.]/g, '');

                  // Prevent more than one decimal point
                  const parts = value.split('.');
                  if (parts.length > 2) {
                    value = parts[0] + '.' + parts[1];
                  }

                  // Max 2 digits before decimal
                  if (parts[0].length > 2) {
                    parts[0] = parts[0].slice(0, 2);
                  }

                  // Max 2 digits after decimal
                  if (parts[1]?.length > 2) {
                    parts[1] = parts[1].slice(0, 2);
                  }

                  e.target.value = parts.join('.');
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Issue Size*
              </Typography>
              <RHFTextField
                name="issueSize"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Total Units
              </Typography>
              <RHFTextField
                name="totalUnit"
                placeholder="e.g., 5.25"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Minimum Purchase Unit
              </Typography>
              <RHFTextField
                name="minimumPurchaseUnit"
                placeholder="e.g., 5.25"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Minimum Investment Price
              </Typography>
              <RHFTextField name="minimumInvestmentPrice" placeholder="Auto calculated" disabled />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained">
              Save
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
