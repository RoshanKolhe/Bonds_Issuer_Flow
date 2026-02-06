import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'src/routes/hook';

export default function RegulatoryFilingCard({ document, currentValue, setStatus }) {
    console.log('currentValue', currentValue);
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const { applicationId } = params;
    const newDocumentSchema = Yup.object().shape({
        documentFile: Yup.object().required('Please upload the document')
    });

    const defaultValues = useMemo(() => ({
        documentFile: currentValue || null
    }), [currentValue]);

    const methods = useForm({
        resolver: yupResolver(newDocumentSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const payload = {
                regulatoryFilingDocumentId: document?.id,
                bondIssueApplicationId: applicationId,
                documentId: formData.documentFile?.id
            };

            const response = await axiosInstance.patch(`/bonds-pre-issue/regulatory-filings/upload-document/${applicationId}`, payload);
            if (response?.data?.success) {
                setStatus();
                enqueueSnackbar(response?.data?.message, { variant: 'success' });
            }
        } catch (error) {
            console.error(`error while uploading ${document?.label} :`, error);
        }
    });

    useEffect(() => {
        if (currentValue) {
            reset(defaultValues);
            setStatus();
        }
    }, [currentValue, reset, defaultValues]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h5" color='primary' fontWeight='bold' mb={2}>
                        {document?.label}
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <RHFCustomFileUploadBox
                                name="documentFile"
                                label={`Upload ${document?.label}`}
                                icon="mdi:file-document-outline"
                            />
                            <YupErrorMessage name="documentFile" />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                            Save
                        </LoadingButton>
                    </Box>
                </Card>
            </Container>
        </FormProvider>
    )
}