import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormProvider, { RHFCheckbox, RHFCustomFileUploadBox, RHFDatePicker, RHFTextField } from "src/components/hook-form";
import { Stack, Card, CardContent, CardHeader, Grid, Alert, Typography, Box, alpha, Button } from "@mui/material";
import Iconify from "src/components/iconify";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "src/routes/hook";

export default function UBONewEditForm(currentUBO) {
  const router = useRouter();
  const [initiateKycLoading, setInitiateKycLoading] = useState(false);
  const [sendToWhatsappLoading, setSendToWhatsappLoading] = useState(false);

  const newUBOSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    designation: Yup.string().required('Designation is required'),
    designationType: Yup.string().required('Designation Type is required'),
    ownershipPercent: Yup.number().required('Ownership Percent is required').min(0).max(100),
    dob: Yup.string().required('Date of Birth is required'),
    boardResolution: Yup.mixed().required('Board Resolution is required'),
    consent: Yup.boolean().oneOf([true], 'Consent is required').required('Consent is required')
  });

  const defaultValues = useMemo(() => ({
    fullName: currentUBO ? currentUBO.fullName : '',
    email: currentUBO ? currentUBO.email : '',
    phone: currentUBO ? currentUBO.phone : '',
    designation: currentUBO ? currentUBO.designation : '',
    designationType: currentUBO ? currentUBO.designationType : '',
    ownershipPercent: 0,
    dob: currentUBO ? currentUBO.dob : '',
    boardResolution: currentUBO ? currentUBO.boardResolution : null,
    consent: currentUBO ? currentUBO.consent : false
  }), [currentUBO]);

  const methods = useForm({
    resolver: yupResolver(newUBOSchema),
    defaultValues: defaultValues
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const consent = watch('consent');

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
  });

  useEffect(() => {
    if (currentUBO) {
      reset(defaultValues);
    }
  }, [currentUBO, defaultValues, reset]);

  return (
    <FormProvider onSubmit={onSubmit} methods={methods}>
      <Stack direction="column" spacing={2}>
        {/* Identity & contact Information Card */}
        <Card>
          <CardHeader title="Identity & Contact Information" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="fullName" label="Full Name" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="email" label="Email" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="phone" label="Phone" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="designation" label="Designation" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="designationType" label="Designation Type" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="ownershipPercent" label="Ownership Percent" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFDatePicker name="dob" label="Date of Birth" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Company Relationship Proof */}
        <Card>
          <CardHeader title="Company Relationship Proof" />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Alert severity="info" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" color="text.primary">Document Requirements</ Typography>
                Upload a Board Resolution to verify the official connection between the UBO and corporate entity.
              </Alert>
              <RHFCustomFileUploadBox
                name="boardResolution"
                label="Upload Board Resolution"
                accept={{
                  'application/pdf': ['.pdf'],
                }}
                icon="mdi:file-document-outline"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Initiate KYC card */}
        <Card>
          <CardHeader title="Initiate KYC" />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Alert severity="info" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" color="text.primary">Document Requirements</ Typography>
                Upload a Board Resolution to verify the official connection between the UBO and corporate entity.
              </Alert>
              <Box
                component='div'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => theme.palette.grey[200],
                  borderRadius: 2,
                  gap: 2,
                  p: { xs: 2, md: 4 }
                }}
              >
                <Box
                  component='div'
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: (theme) => alpha(theme.palette.info.main, 0.12),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="mdi:shield-check" color="info.main" width={40} />
                </Box>

                <Typography variant="h5" color="text.primary">Verify personal Identity and Video KYC</Typography>
                <Typography sx={{ maxWidth: 600, textAlign: 'center' }} variant="body1" color="text.secondary">
                  A secure link will be generate for electronic KYC verification via DigiLocker. This satisfies both PAN and Aadhar regulatory requirements.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} component='div'>
                  <LoadingButton
                    type="button"
                    onClick={() => router.push('/kyc/identity-kyc')}
                    variant="contained"
                    disabled={initiateKycLoading}
                    color="primary"
                  >
                    Initiate KYC
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    onClick={() => console.log('Clicked on Initiate KYC')}
                    variant="outlined"
                    disabled={sendToWhatsappLoading}
                    color="primary"
                  >
                    Send to Email
                  </LoadingButton>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* regulatory complaiance card */}
        <Alert severity="info" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" color="text.primary">Regulatory Compliance: AML and KYC protocols</ Typography>
          Ultimate Beneficiary Ownership (UBO) declaration is mandatory under the Prevention of Money Laundering Act (PMLA). We collect the information
          to satisfy know Your Customer (KYC) requirements and ensure financial transparency. By Submitting this form, you certify that the information
          provided is accurate and register individual maintains significant control or ownership interest in the legal entity.
        </Alert>

        {/* consent box */}
        <Box
          component='div'
          sx={{
            display: 'flex',
            alignItems: 'start',
          }}
        >
          <RHFCheckbox name='consent' />
          <Typography variant='body2' color='text.secondary'>
            I authorize the processing of my personal data for KYC and AML compliance in accordance with DPDPA guidelines.
            I understand this information will be handled securely as per regulatory mandates.
          </Typography>
        </Box>

        <Box
          component='div'
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={() => console.log('Clicked on Cancel')}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!consent || isSubmitting}
          >
            Submit UBO Registration
          </LoadingButton>
        </Box>
      </Stack>
    </FormProvider>
  )
}

UBONewEditForm.propTypes = {
  currentUBO: PropTypes.object,
}; 