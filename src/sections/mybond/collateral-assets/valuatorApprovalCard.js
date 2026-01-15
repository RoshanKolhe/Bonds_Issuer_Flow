import * as Yup from 'yup';
import { Grid, Stack } from "@mui/material";
import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from "src/components/hook-form";
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useParams } from 'src/routes/hook';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function ValuatorApprovalCard() {
    const params = useParams();
    const { applicationId } = params;
    const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, '');

    const valuatorApprovalSchema = Yup.object().shape({
        securityDocRef: Yup.string().required('Security document ref is required'),
        securityDocument: Yup.mixed().required('Security document is required'),
        assetCoverCertificate: Yup.mixed().required('Asset cover certificate is required'),
        valuationReport: Yup.mixed().required('Valuation report is required'),
        remark: Yup.string()
    });

    const defaultValues = useMemo(() => ({
        securityDocRef: '',
        securityDocument: null,
        assetCoverCertificate: null,
        valuationReport: null
    }), []);

    const methods = useForm({
        resolver: yupResolver(valuatorApprovalSchema),
        defaultValues
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    const onSubmit = handleSubmit((formData) => {
        // 
    });

    useEffect(() => {
        // if(){
        // reset(defaultValues); 
        // }
    }, [reset, defaultValues]);

    return (
        <FormProvider>
            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <RHFTextField name='securityDocRef' label="Security Document Ref" fullWidth />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Stack spacing={2}>
                        <RHFCustomFileUploadBox
                            name='securityDocument'
                            label="Security Document"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/png': ['.png'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                            }}
                        />
                        <YupErrorMessage name='securityDocument' />


                        <RHFCustomFileUploadBox
                            name='assetCoverCertificate'
                            label="Asset Cover Certificate"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/png': ['.png'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                            }}
                        />
                        <YupErrorMessage name='assetCoverCertificate' />

                        <RHFCustomFileUploadBox
                            name='valuationReport'
                            label="Valuation Report"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/png': ['.png'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                            }}
                        />
                        <YupErrorMessage name='valuationReport' />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                    <RHFTextField
                        name='remark'
                        label="Remark"
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </FormProvider>
    )
}