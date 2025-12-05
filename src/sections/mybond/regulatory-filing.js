/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { DatePicker } from '@mui/x-date-pickers';
import { enqueueSnackbar } from 'notistack';

export default function RegulatoryFiling({ saveStepData, setActiveStepId, percent }) {
  const [authority, setAuthority] = useState();

  const RegulatoryFilingSchema = Yup.object().shape({
    // PAS-4
    filingDatePas4: Yup.string().required('Filing Date is required'),
    fileNamePas4: Yup.string().required('File Name is required'),
    referenceNoPas4: Yup.string().required('Reference No is required'),
    approvalNoPas4: Yup.string().required('Approval Number is required'),
    pas4: Yup.mixed()
      .required('Upload is required')
      .test('fileSize', 'Max size is 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF allowed', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.type === 'application/pdf';
      }),

    // Memorandum
    filingDateMemorandum: Yup.string().required('Filing Date is required'),
    fileNameMemorandum: Yup.string().required('File Name is required'),
    referenceNoMemorandum: Yup.string().required('Reference No is required'),
    informationMemorandum: Yup.mixed()
      .required('Upload is required')
      .test('fileSize', 'Max size is 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF allowed', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.type === 'application/pdf';
      }),

    // SEBI/NHB/RBI Approvals
    sebiApprovalNo: Yup.string().required('Approval number is required'),
    sebiDate: Yup.date().nullable().required('Date is required'),
    authorityType: Yup.string().required('Authority is required'),
    sebi: Yup.mixed()
      .required('Upload required')
      .test('fileSize', 'Max size is 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      }),

    // In-principle listing
    principleApprovalNo: Yup.string().required('Approval number is required'),
    principleDate: Yup.date().nullable().required('Date is required'),
    principle: Yup.mixed().required('Upload required'),

    // ROC
    rocApprovalNo: Yup.string().required('Approval number is required'),
    rocDate: Yup.date().nullable().required('Date is required'),
    roc: Yup.mixed().required('Upload required'),
  });

  const defaultValues = {
    filingDatePas4: '',
    fileNamePas4: '',
    referenceNoPas4: '',
    approvalNoPas4: '',
    pas4: null,

    filingDateMemorandum: '',
    fileNameMemorandum: '',
    referenceNoMemorandum: '',
    informationMemorandum: null,

    // SEBI Approvals
    sebiApprovalNo: '',
    sebiDate: null,
    authorityType: '', // 👈 stored here (SEBI / NHB / RBI)
    sebi: null,

    // In-principle
    principleApprovalNo: '',
    principleDate: null,
    principle: null,

    // ROC
    rocApprovalNo: '',
    rocDate: null,
    roc: null,
  };

  const methods = useForm({
    resolver: yupResolver(RegulatoryFilingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log('🟢 Regulatory Filing Submit Data:', data);

    saveStepData({ regulatoryFiling: data });

    setActiveStepId('isin_activation');
    enqueueSnackbar('Created Successfully!', { variant: 'success' });
  };

  const requiredFields = [
    'pas4',
    'informationMemorandum',
    'sebi',
    'principle',
    'roc',
    'authorityType',
  ];

  const calculatePercentUsingYup = () => {
    let completed = 0;

    requiredFields.forEach((field) => {
      if (!errors[field]) {
        const value = methods.getValues(field);

        // Only count if field has actual value or valid file
        if (value && value !== '' && value !== null) {
          completed += 1;
        }
      }
    });

    const p = Math.round((completed / requiredFields.length) * 100);

    if (typeof percent === 'function') {
      percent(p);
    }
  };

  useEffect(() => {
    calculatePercentUsingYup();
  }, [methods.watch(), errors]);

  useEffect(() => {
    if (authority) {
      setValue('authorityType', authority);
    }
  }, [authority]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
            Regulatory Filings
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            PAS-4
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDatePas4" label="Filing Date" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNamePas4" label="File Name" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoPas4" label="Reference No" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="approvalNoPas4" label="Approval Number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <RHFFileUploadBox
                name="pas4"
                label="Upload Filing Document"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="pas4" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            Prospectus/Information Memorandum
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDateMemorandum" label="Filing Date" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNameMemorandum" label="File Name" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoMemorandum" label="Reference No" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <RHFFileUploadBox
                name="informationMemorandum"
                label="Prospectus/Information Memorandum"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="informationMemorandum" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            SEBI/ NHB/RBI Approvals:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="sebiApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="sebiDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={authority}
                  exclusive
                  onChange={(e, val) => val && setAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '& .MuiToggleButtonGroup-grouped': {
                      border: '1px solid #ccc !important', // restore border for buttons
                      borderRadius: 0,
                      '&:not(:last-of-type)': {
                        borderRight: 'none !important', // remove double border overlap
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#2E6CF6',
                        color: '#fff',
                      },
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <RHFFileUploadBox
                name="sebi"
                label="Prospectus/Information Memorandum"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="sebi" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            In-Principle Listing Approvals
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="principleApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="principleDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Principle Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={authority}
                  exclusive
                  onChange={(e, val) => val && setAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '& .MuiToggleButtonGroup-grouped': {
                      border: '1px solid #ccc !important', // restore border for buttons
                      borderRadius: 0,
                      '&:not(:last-of-type)': {
                        borderRight: 'none !important', // remove double border overlap
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#2E6CF6',
                        color: '#fff',
                      },
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <RHFFileUploadBox
                name="principle"
                label="In-Principle Listing Approvals"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="principle" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            Registrar of Companies (ROC)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="rocApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="rocDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="ROC Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={authority}
                  exclusive
                  onChange={(e, val) => val && setAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '& .MuiToggleButtonGroup-grouped': {
                      border: '1px solid #ccc !important', // restore border for buttons
                      borderRadius: 0,
                      '&:not(:last-of-type)': {
                        borderRight: 'none !important', // remove double border overlap
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#2E6CF6',
                        color: '#fff',
                      },
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <RHFFileUploadBox
                name="roc"
                label="Registrar of Companies (ROC)"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="roc" />
            </Grid>
          </Grid>
        </Card>
        <Grid item xs={12}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {/* <Button variant="outlined" sx={{ color: '#000000' }}>
              Cancel
            </Button> */}
            <LoadingButton variant="contained" type='submit' sx={{ color: '#fff' }}>
              Next
            </LoadingButton>
          </Box>
        </Grid>
      </Container>
    </FormProvider>
  );
}
