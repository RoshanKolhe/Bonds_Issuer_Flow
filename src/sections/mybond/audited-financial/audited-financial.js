import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
// sections
import AuditedFinancialDocument from './audited-financial-document';

// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';


import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import { fDate } from 'src/utils/format-time';
import KYCTitle from 'src/pages/components/audited-financial/title';


// ----------------------------------------------------------------------

export default function AuditedFinancial({ currentIssue, saveStepData, setActiveStepId, percent }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year.toString(),
      label: `${year - 1} - ${year}`, // Shows as "2023 - 2024" for FY 2023-24
    };
  });

  const calculatePercent = () => {
      let p = 100;
      if (typeof percent === 'function') {
        percent(p); // send to parent stepper
        console.log('🟠 Fund Position Percent Calculation Triggered',p);
      }
    };
  
    useEffect(() => {
      calculatePercent();
    }, []);

  const methods = useForm({
    defaultValues: {
      documentType: '',
      baseYear: currentYear.toString(),
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    console.log('✅ Full Form Data:', data);

    // if API success
    setActiveStepId('borrowing_details');
  };

  return (
    <Container>

      <KYCTitle
        title="Audited Financial"
        subtitle={
          'Upload the audited financial statements and annual reports to assess your financial health.'
        }
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <AuditedFinancialDocument />
        <Grid item xs={12}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {/* <Button
              variant="outlined"
              sx={{ color: '#000000' }}
              onClick={() => setActiveStep(0)}
            >
              Cancel
            </Button> */}

            <LoadingButton variant="contained" type='submit' sx={{ color: '#fff' }}>
              Next
            </LoadingButton>
          </Box>
        </Grid>
      </FormProvider>
    </Container>
  );
}

AuditedFinancial.propTypes ={
  setActiveStep: PropTypes.func
};
