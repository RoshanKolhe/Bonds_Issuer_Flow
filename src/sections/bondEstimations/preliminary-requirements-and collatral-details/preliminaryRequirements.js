import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Icon, MenuItem, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useGetInvestorCategories } from 'src/api/investorCategories';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

export default function PreliminaryRequirements({ currentPriliminaryRequirements, setPercent, setProgress }) {
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
            .required('Issue Amount is required'),
        security: Yup.bool().required("Please select security type"),
        tenure: Yup.number()
            .typeError('Tenure must be a number')
            .positive('Must be positive')
            .required('Tenure is required'),
        preferedInvestorCategory: Yup.string().required("Please select category"),
        preferedPaymentCycle: Yup.number().required("Please select payment cycle"),
        roi: Yup.number()
            .typeError('ROI must be a number')
            .min(0, 'Must be at least 0%')
            .max(100, 'Cannot exceed 100%')
            .required('ROI is required'),
    });

    const defaultValues = useMemo(() => {

    }, []);

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

    const onSubmit = handleSubmit(async (data) => {

    });

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
                            <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
                                Preliminary Bond Requirements
                            </Typography>

                            {/* Issue Amount */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Issue Amount (₹)
                                    <Tooltip title="Whether the bond is backed by collateral or not" arrow>
                                        <Icon
                                            icon="mdi:information-outline"
                                            width={18}
                                            height={18}
                                            style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                                        />
                                    </Tooltip>
                                </Typography>
                                <RHFTextField
                                    name="issueAmount"
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="₹ 500,00,000"
                                    variant="outlined"
                                    label="Issue Amount"
                                />
                            </Box>

                            {/* Security */}
                            <Box mt={3}>
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
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Tenure
                                    <Tooltip title="Enter tenure for your bond (e.g., 5 for 5 years)" arrow>
                                        <Icon
                                            icon="mdi:information-outline"
                                            width={18}
                                            height={18}
                                            style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                                        />
                                    </Tooltip>
                                </Typography>
                                <RHFTextField
                                    name="tenure"
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="3.5"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Preferred ROI */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Preferred ROI (%)
                                </Typography>
                                <RHFTextField
                                    name="roi"
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="8.5"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Investor Category */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Preferred Investor Category
                                    <Tooltip title="Select the type of investors you need to target" arrow>
                                        <Icon
                                            icon="mdi:information-outline"
                                            width={18}
                                            height={18}
                                            style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                                        />
                                    </Tooltip>
                                </Typography>
                                <RHFSelect name="preferedInvestorCategory" >
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
                                display: 'flex',
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
                        <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
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