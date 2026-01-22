import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Icon, MenuItem, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useGetInvestorCategories } from 'src/api/investorCategories';
import FormProvider, { RHFPriceField, RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function PreliminaryRequirements({ currentPriliminaryRequirements, setPercent, setProgress }) {
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const { applicationId } = params;
    const { investorCtegories, investorCtegoriesLoading } = useGetInvestorCategories();
    const [investorCategoriesData, setInvestorCategoriesData] = useState([]);

    const paymentCycleOptions = [
        { label: 'Monthly', value: 0 },
        { label: 'Quaterly', value: 1 },
        { label: 'Anually', value: 2 }
    ];

    const newPreliminaryRequirementsSchema = Yup.object().shape({
        issueAmount: Yup.number()
            .typeError('Issue Amount is required')
            .positive('Must be positive')
            .required('Issue Amount is required')
            .min(10000000, 'Issue amount minimum 1 Cr')
            .max(50000000000, 'Issue amount maximum 5000 Cr'),

        security: Yup.bool().required("Please select security type"),
        tenure: Yup.number()
            .typeError('Tenure must be a number')
            .required('Tenure is required')
            .min(1, 'Minimum tenure is 1 year')
            .max(30, 'Maximum tenure is 30 years'),
        preferedInvestorCategory: Yup.string().required("Please select category"),
        preferedPaymentCycle: Yup.number().required("Please select payment cycle"),
        roi: Yup.number()
            .typeError('ROI must be a number')
            .required('ROI is required')
            .min(0, 'Must be at least 0%')
            .max(25, 'Cannot exceed 25%'),
    });

    const defaultValues = useMemo(() => ({
        issueAmount: currentPriliminaryRequirements?.issueAmount || '',
        security: currentPriliminaryRequirements?.security || true,
        tenure: currentPriliminaryRequirements?.tenure || '',
        preferedInvestorCategory: currentPriliminaryRequirements?.investorCategoryId || '',
        preferedPaymentCycle: currentPriliminaryRequirements?.preferedPaymentCycle || 0,
        roi: currentPriliminaryRequirements?.roi || ''
    }), [currentPriliminaryRequirements]);

    const methods = useForm({
        resolver: yupResolver(newPreliminaryRequirementsSchema),
        defaultValues
    });

    const {
        control,
        watch,
        reset,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const payload = {
                issueAmount: data.issueAmount,
                security: data.security,
                tenure: data.tenure,
                investorCategoryId: data.preferedInvestorCategory,
                preferedPaymentCycle: data.preferedPaymentCycle,
                roi: data.roi
            };
            const response = await axiosInstance.patch(`/bond-estimations/priliminary-requirements/${applicationId}`, payload);
            if (response.data.success) {
                setProgress(true);
                enqueueSnackbar('Priliminary requirements saved', { variant: 'success' });
            }
        } catch (error) {
            enqueueSnackbar(error?.error?.message || 'Error while filling priliminary requirements :', { variant: 'error' })
            console.error('Error while filling priliminary requirements :', error);
        }
    });

    const calculatePercent = () => {
        let completed = 0;

        if (values.issueAmount) completed++;
        if (values.security) completed++;
        if (values.preferedInvestorCategory) completed++;
        if (values.tenure) completed++;
        if (values.preferedPaymentCycle) completed++;
        if (values.roi) completed++;


        const percentVal = (completed / 6) * 100;

        setPercent?.(percentVal);
    };

    useEffect(() => {
        calculatePercent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.issueAmount, values.preferedInvestorCategory, values.preferedPaymentCycle, values.security, values.tenure, values.roi]);

    useEffect(() => {
        if (currentPriliminaryRequirements) {
            reset(defaultValues);
        }
    }, [currentPriliminaryRequirements, reset, defaultValues]);

    useEffect(() => {
        if (investorCtegories && !investorCtegoriesLoading) {
            setInvestorCategoriesData(investorCtegories);
        }
    }, [investorCtegories, investorCtegoriesLoading]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box
                sx={{
                    minHeight: '100vh',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        mt: 5,
                        p: 5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" color='primary' fontWeight='bold' sx={{ mb: 3 }}>
                                Preliminary Bond Requirements
                            </Typography>

                            {/* Issue Amount */}
                            <Box sx={{ mb: 3 }}>
                                <RHFPriceField
                                    name="issueAmount"
                                    fullWidth
                                    size="small"
                                    placeholder="₹ 500,00,000"
                                    variant="outlined"
                                    label="Issue Amount"
                                />
                            </Box>

                            {/* Security */}
                            <Box mb={3}>
                                <Typography mb={1}>Security</Typography>
                                <Controller
                                    name="security"
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
                            </Box>

                            {/* Tenure */}
                            <Box sx={{ mb: 3 }}>

                                <RHFTextField
                                    name="tenure"
                                    label="Tenure"
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="3.5"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Preferred ROI */}
                            <Box sx={{ mb: 3 }}>
                                <RHFTextField
                                    name="roi"
                                    label="Preferred ROI (%)"
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="8.5"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Investor Category */}
                            <Box sx={{ mb: 3 }}>
                                <RHFSelect name="preferedInvestorCategory" label="Preferred Investor Category" >
                                    {investorCategoriesData?.length > 0 ? investorCategoriesData.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.label}</MenuItem>
                                    )) : (
                                        <MenuItem value=''>No categories</MenuItem>
                                    )}
                                </RHFSelect>
                            </Box>

                            {/* Payment Cycle */}
                            <Box mt={3}>
                                <Typography mb={1}>Interest Payment Cycle</Typography>
                                <Controller
                                    name="preferedPaymentCycle"
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButtonGroup
                                            exclusive
                                            value={field.value}
                                            onChange={(e, val) => val && field.onChange(val)}
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
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                display: { xs: 'none', lg: 'flex' },
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src="/assets/images/roi/preliminary.png"
                                alt="Bond Illustration"
                                style={{ maxWidth: '100%', borderRadius: 8 }}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                    >
                        <LoadingButton type="submit" loading={isSubmitting} variant="contained" sx={{ color: '#fff' }}>
                            Save
                        </LoadingButton>
                    </Box>
                </Card>
            </Box>
        </FormProvider>
    )
}

PreliminaryRequirements.propTypes = {
    currentPriliminaryRequirements: PropTypes.object,
    setPercent: PropTypes.func,
    setProgress: PropTypes.func
}