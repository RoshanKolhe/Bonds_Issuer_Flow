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

export default function AuditedFinancial({ setActiveStep }) {
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

  const onSubmit = (data) => {
    console.log('✅ Full Form Data:', data);

    // if API success
    setActiveStep(2);
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
        {/* <Grid
          container
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
            p: 3,
            mb: 3,
          }}
        >
          <Grid xs={12}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Document type
            </Typography>
          </Grid>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              row
              aria-labelledby="document-type-radio-buttons"
              name="documentType"
              sx={{ width: '100%' }}
            >
              <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                <Grid xs={12} md={6} sx={{ p: 0, pr: { md: 1.5 } }}>
                  <label
                    htmlFor="audited-radio"
                    style={{ width: '100%', cursor: 'pointer', display: 'block' }}
                  >
                    <Grid
                      container
                      sx={{
                        p: 3,
                        borderRadius: 1.5,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        width: '100%',
                        m: 0,
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Grid item xs container direction="column" sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" noWrap>
                          Audited Document
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          Financial Statement, IT Returns, GST returns (Monthly 3B & Annual 9)
                        </Typography>
                      </Grid>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <Radio
                          id="audited-radio"
                          value="audited"
                          sx={{ p: 0, ml: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Grid>
                    </Grid>
                  </label>
                </Grid>

                <Grid xs={12} md={6} sx={{ p: 0, pl: { md: 1.5 } }}>
                  <label
                    htmlFor="provisional-radio"
                    style={{ width: '100%', cursor: 'pointer', display: 'block' }}
                  >
                    <Grid
                      container
                      sx={{
                        p: 3,
                        borderRadius: 1.5,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        width: '100%',
                        m: 0,
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Grid item xs container direction="column" sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" noWrap>
                          Provisional Document
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          Monthly/Quarterly GST Returns (GSTR-3B & GSTR-1)
                        </Typography>
                      </Grid>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <Radio
                          id="provisional-radio"
                          value="provisional"
                          sx={{ p: 0, ml: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Grid>
                    </Grid>
                  </label>
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid> */}
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
            <Button
              variant="outlined"
              sx={{ color: '#000000' }}
              onClick={() => setActiveStep(0)}
            >
              Cancel
            </Button>

            <LoadingButton variant="contained" sx={{ color: '#fff' }}>
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
