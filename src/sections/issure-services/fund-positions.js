/* eslint-disable no-useless-escape */
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Card,
  Button,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

// ----------------------------------------------------------------------

export default function FundPositionForm({ currentFund }) {
  const { enqueueSnackbar } = useSnackbar();

  const FundSchema = Yup.object().shape({
    cashBalance: Yup.string().required('Cash Balance is required'),
    bankBalance: Yup.string().required('Bank Balance is required'),
    hasCredit: Yup.string().required('Please select credit rating option'),
    selectedAgency: Yup.string().when('hasCredit', {
      is: 'yes',
      then: (schema) => schema.required('Agency selection is required'),
    }),
    selectedRating: Yup.string().when('hasCredit', {
      is: 'yes',
      then: (schema) => schema.required('Rating selection is required'),
    }),
    vault: Yup.string().required('Vault Till data is required'),
    agencyRating: Yup.string().required('Agency rating is required'),
    additionalRating: Yup.string().required('Additional rating is required'),
    creditRatingLetter: Yup.object().shape({
      fileUrl: Yup.string().required('Upload credit rating letter'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      cashBalance: currentFund?.cashBalance || '',
      bankBalance: currentFund?.bankBalance || '',
      hasCredit: currentFund?.hasCredit || 'yes',
      selectedAgency: currentFund?.selectedAgency || '',
      selectedRating: currentFund?.selectedRating || '',
      vault: currentFund?.vault || '',
      additionalRating: currentFund?.additionalRating || '',
      agencyRating: currentFund?.agencyRating || '',
      creditRatingLetter: currentFund?.creditRatingLetter
        ? {
            fileUrl: currentFund.creditRatingLetter.fileUrl,
            preview: currentFund.creditRatingLetter.fileUrl,
          }
        : '',
    }),
    [currentFund]
  );

  const methods = useForm({
    resolver: yupResolver(FundSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  // ✅ Upload Handlers (same as clinic form)
  const handleRemoveFile = useCallback(() => {
    setValue('creditRatingLetter', null);
  }, [setValue]);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('creditRatingLetter', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        const fileUrl = data?.files?.[0]?.fileUrl;
        setValue(
          'creditRatingLetter',
          {
            fileUrl,
            preview: fileUrl,
          },
          { shouldValidate: true }
        );
      }
    },
    [setValue]
  );

  // ✅ OnSubmit handler (same pattern as Clinic form)
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        cashBalance: formData.cashBalance,
        bankBalance: formData.bankBalance,
        hasCredit: formData.hasCredit,
        selectedAgency: formData.selectedAgency,
        selectedRating: formData.selectedRating,
        vault: formData.vault,
        agencyRating: formData.agencyRating,
        additionalRating: formData.additionalRating,
        creditRatingLetter: { fileUrl: formData.creditRatingLetter?.fileUrl },
      };

      if (!currentFund) {
        await axiosInstance.post('/fund-position', payload);
      } else {
        await axiosInstance.patch(`/fund-position/${currentFund.id}`, payload);
      }

      enqueueSnackbar(currentFund ? 'Update success!' : 'Create success!');
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        typeof error === 'string' ? error : error.error?.message || 'Something went wrong!',
        { variant: 'error' }
      );
    }
  });
  // const onSubmit = (data) => {
  //   console.log('Form Data:', data);
  // };

  const agencies = [
    'CRISIL',
    'ICRA',
    'INDIA RATINGS & RESEARCH',
    'Rating Agency 4',
    'Rating Agency 5',
    'Rating Agency 6',
  ];

  const ratings = [
    { value: 'A+', label: 'A+' },
    { value: 'AAA', label: 'AAA' },
    { value: 'AA+', label: 'AA+' },
    { value: 'AA-', label: 'AA-' },
    { value: 'AA', label: 'AA' },
    { value: 'A-', label: 'A-' },
    { value: 'BBB+', label: 'BBB+' },
    { value: 'UNRATED', label: 'UNRATED' },
  ];

  const dummyCards = [
    { image: '/assets/images/roi/crisil.png', label: 'CRISIL' },
    { image: '/assets/images/roi/ICRA.png', label: 'ICRA' },
    { image: '/assets/images/roi/india-ratings.png', label: 'India Ratings' },
    { image: '/assets/images/roi/ICRA.png', label: 'Rating Agency 4' },
    { image: '/assets/images/roi/ICRA.png', label: 'Rating Agency 5' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* 1. Fund Position Section */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
          <Typography variant="h3" sx={{ color: '#1565c0', fontWeight: 600 }}>
            Fund Position
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Add and manage your borrowing information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="cashBalance"
                label="Cash Balance as on Date"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="bankBalance"
                label="Bank Balance as on Date"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Card>

        {/* 2. Credit Rating Question */}
        <Box sx={{ mb: '20px' }}>
          <FormControl>
            <FormLabel
              sx={{ fontWeight: 500, color: 'black', '&.Mui-focused': { color: 'black' } }}
            >
              Do You Already Have a Credit Rating? <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              row
              value={values.hasCredit}
              onChange={(e) => setValue('hasCredit', e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* 3. Conditional Rendering */}
        {values.hasCredit === 'yes' ? (
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Credit Ratings Available
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                {/* <Select
                  value={values.selectedAgency}
                  onChange={(e) => setValue('selectedAgency', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="agencyRating">Select the appropriate rating agency</MenuItem>
                  {agencies.map((agency, idx) => (
                    <MenuItem key={idx} value={agency}>
                      {agency}
                    </MenuItem>
                  ))}
                </Select> */}
                <RHFSelect
                  name="selectedAgency"
                  label="Select Rating Agency"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="">Select the appropriate rating agency</MenuItem>
                  {agencies.map((agency, idx) => (
                    <MenuItem key={idx} value={agency}>
                      {agency}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Rating
                </Typography>
                <Grid container spacing={2}>
                  {ratings
                    .filter((rating) => {
                      // Example logic: only show ratings based on selected category
                      if (values.category === 'Credit') return rating.value <= 3;
                      if (values.category === 'Risk') return rating.value > 3;
                      return true;
                    })
                    .map((rating) => (
                      <Grid item xs={4} key={rating.value}>
                        <FormControlLabel
                          value={rating.value}
                          control={
                            <Radio
                              checked={values.selectedRating === rating.value}
                              onChange={(e) => setValue('selectedRating', e.target.value)}
                              color="primary"
                            />
                          }
                          label={rating.label}
                        />
                      </Grid>
                    ))}
                </Grid>
                <YupErrorMessage name="selectedRating" />
              </Grid>
            </Grid>
          </Card>
        ) : (
          <Box
            sx={{
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              mb: 4,
              scrollbarWidth: { xs: 'none', md: 'thin' },
              msOverflowStyle: { xs: 'none', md: 'auto' },
              '&::-webkit-scrollbar': { height: 8, display: { xs: 'none', md: 'block' } },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: 4 },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, width: 'fit-content' }}>
              {dummyCards.map((card, index) => (
                <Box key={index} sx={{ minWidth: 250, flexShrink: 0 }}>
                  <CreditRatingCard
                    imageSrc={card.image}
                    label={card.label}
                    onClick={() => setValue('selectedAgency', card.label)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <RHFTextField name="vault" label="Vault Till" fullWidth size="small" sx={{ pb: '30px' }} />
        <RHFTextField
          name="additionalRating"
          label="Additional Rating"
          fullWidth
          size="small"
          sx={{ pb: '30px' }}
        />

        {/* 5. Credit Rating Letter Upload */}
        <RHFFileUploadBox
          name="creditRatingLetter"
          label="Upload Credit Rating Letter"
          icon="mdi:file-document-outline"
          helperText="Upload your latest rating report"
        />

        {/* 6. Action Buttons */}
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          sx={{ maxWidth: 400, ml: 'auto', mt: 5 }}
        >
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" color="inherit">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
}

// ----------------------------------------------------------------------

const CreditRatingCard = ({ imageSrc, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      mb: '20px',
      borderRadius: 0,
      height: 150,
      cursor: 'pointer',
      minWidth: 250,
    }}
  >
    <Box sx={{ height: 150, overflow: 'hidden', flexShrink: 0, borderRadius: 1 }}>
      <img
        src={imageSrc}
        alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
  </Box>
);

CreditRatingCard.propTypes = {
  imageSrc: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};
