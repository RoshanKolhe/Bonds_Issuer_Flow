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


import AuditedFinancialStatement from './audited-fnancial-statement';
import AuditedIncomeTaxReturn from './audited-income-tax-return';
import AuditedGSTR9 from './audited-gstr9';
import AuditedGST3B from './audited-gstr3b';
// ----------------------------------------------------------------------

export default function AuditedFinancialDocument() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year.toString(),
      label: `${year - 1} - ${year}`, // Shows as "2023 - 2024" for FY 2023-24
    };
  });

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

  const onSubmit = handleSubmit(async (formData) => {});

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid
        container
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Grid xs={12}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Base Year (Latest Financial Year)
          </Typography>

          <Controller
            name="baseYear"
            control={control}
            render={({ field }) => (
              <RHFSelect
                {...field}
                select
                fullWidth
                placeholder="Select Year"
                sx={{ maxWidth: 200 }}
              >
                {years.map((yearData) => (
                  <MenuItem key={yearData.value} value={yearData.value}>
                    {yearData.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
            Select your latest financial year. Previous years will be auto populated
          </Typography>
        </Grid>
      </Grid>

      <AuditedFinancialStatement />
      <AuditedIncomeTaxReturn />
      <AuditedGSTR9 />
      <AuditedGST3B />
    </FormProvider>
  );
}
