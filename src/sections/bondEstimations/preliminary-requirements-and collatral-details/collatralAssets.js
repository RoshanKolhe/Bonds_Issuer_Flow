import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useGetChargeTypes,
  useGetCollateralTypes,
  useGetOwnershipTypes,
} from 'src/api/fieldOptions';
import FormProvider, { RHFCustomFileUploadBox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

export default function CollateralAssets({ currentCollateralAssets, setPercent, setProgress }) {
  const { enqueueSnackbar } = useSnackbar();
  const { chargeTypes, chargeTypesLoading } = useGetChargeTypes();
  const { collateralTypes, collateralTypesLoading } = useGetCollateralTypes();
  const { ownershipTypes, ownershipTypesLoading } = useGetOwnershipTypes();
  const [chargeTypesData, setChargeTypesData] = useState([]);
  const [collateralTypesData, setCollateralTypesData] = useState([]);
  const [ownershipTypesData, setOwnershipTypesData] = useState([]);

  const newCollateralSchema = Yup.object().shape({
    collateralType: Yup.string().required('Collateral Type is required'),
    chargeType: Yup.string().required('Charge Type is required'),
    description: Yup.string().required('Asset Description is required'),
    estimatedValue: Yup.string().required('Estimated Value is required'),
    valuationDate: Yup.date().required('Valuation Date is required'),
    ownershipType: Yup.string().required('Ownership Type is required'),
    securityDocument: Yup.object().required('Security Document is required'),
    securityDocRef: Yup.string().required('Security Document Ref is required'),
    trustName: Yup.string().required('Trust Name is required'),
    remarks: Yup.string(),
    assetCoverCertificate: Yup.mixed().required('Asset Cover Certificate is required'),
    valuationReport: Yup.array().of(Yup.mixed().required('Valuation Report is required'))
  });

  const defaultValues = useMemo(
    () => ({
      collateralType: currentCollateralAssets?.collateralTypeId || '',
      chargeType: currentCollateralAssets?.chargeTypeId || '',
      description: currentCollateralAssets?.description || '',
      estimatedValue: currentCollateralAssets?.estimatedValue || '',
      ownershipType: currentCollateralAssets?.ownershipTypeId || '',
      securityDocRef: currentCollateralAssets?.securityDocRef || '',
      trustName: currentCollateralAssets?.trustName || '',
      remarks: currentCollateralAssets?.remarks || '',
      valuationDate: currentCollateralAssets?.valuationDate || new Date(),
      securityDocument: currentCollateralAssets?.securityDocument || null,
      assetCoverCertificate: currentCollateralAssets?.assetCoverCertificate || null,
      valuationReport: currentCollateralAssets?.valuationReport || [],
    }),
    [currentCollateralAssets]
  );

  const methods = useForm({
    resolver: yupResolver(newCollateralSchema),
    defaultValues,
  });

  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
  });


  useEffect(() => {
    if (currentCollateralAssets) {
      reset(defaultValues);
    }
  }, [currentCollateralAssets, reset, defaultValues]);

  useEffect(() => {
    if (chargeTypes && !chargeTypesLoading) {
      setChargeTypesData(chargeTypes);
    }
  }, [chargeTypes, chargeTypesLoading]);

  useEffect(() => {
    if (collateralTypes && !collateralTypesLoading) {
      setCollateralTypesData(collateralTypes);
    }
  }, [collateralTypes, collateralTypesLoading]);

  useEffect(() => {
    if (ownershipTypes && !ownershipTypesLoading) {
      setOwnershipTypesData(ownershipTypes);
    }
  }, [ownershipTypes, ownershipTypesLoading]);


  console.log('values', values);

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
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 0,
            mt: '0px',
          }}
        >
          <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
            Collateral & Asset Verification
          </Typography>

          <Grid container spacing={3}>
            {/* Collateral Type */}
            <Grid item xs={12} md={4}>
              <RHFSelect name="collateralType" label="Collateral Type" defaultValue="">
                {collateralTypesData.length > 0 ? (
                  collateralTypesData.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No collateral types
                  </MenuItem>
                )}
              </RHFSelect>
            </Grid>

            {/* Charge Type */}
            <Grid item xs={12} md={4}>

              <RHFSelect disabled name="chargeType" label="Charge Type" defaultValue="">
                {chargeTypesData.length > 0 ? (
                  chargeTypesData.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No charge types
                  </MenuItem>
                )}
              </RHFSelect>

            </Grid>
            <Grid item xs={12} md={4}>

              <RHFSelect name="ownershipType" label="Ownership Type" defaultValue="">
                {ownershipTypesData.length > 0 ? (
                  ownershipTypesData.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No ownership types
                  </MenuItem>
                )}
              </RHFSelect>
            </Grid>


            {/* Estimated Value */}
            <Grid item xs={12} md={4}>
              <RHFTextField name="estimatedValue" label="Estimated Value" fullWidth />
            </Grid>

            {/* Security Document Ref */}
            <Grid item xs={12} md={4}>

              <RHFTextField name="securityDocRef" label="Security Document Ref" fullWidth />

            </Grid>
            <Grid item xs={12} md={4}>

              <RHFTextField name="trustName" label="Trust Name" fullWidth />

            </Grid>

            {/* Valuation Date */}
            <Grid item xs={12} md={6}>

              <Controller
                name="valuationDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Valuation Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
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
            {/* Remarks */}
            <Grid item xs={12} md={6}>

              <RHFTextField name="remarks" label="Remarks" fullWidth />

            </Grid>
            <Grid item xs={12} md={12}>
            
                  <RHFTextField multiline name="assetDescription" label="Asset Description" rows={3} fullWidth />
               
            </Grid>

            <Grid item xs={12} md={12}>
        <Stack spacing={3}>
              <RHFCustomFileUploadBox
                name="securityDocument"
                label="Upload security document"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                }}
              />
        
              <RHFCustomFileUploadBox
                name="assetCoverCertificate"
                label="Upload Asset cover certificate"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                }}
              />
         
              <RHFCustomFileUploadBox
                name="valuationReport"
                label="Upload Valuation Report"
                icon="mdi:file-document-outline"
                multiple
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                }}
              />
              </Stack>
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
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ color: '#fff' }}
            >
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

CollateralAssets.propTypes = {
  currentCollateralAssets: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
