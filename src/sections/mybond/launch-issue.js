import React from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';

import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import FormProvider, { RHFSelect } from 'src/components/hook-form';
import RHFDateTimePicker from 'src/components/custom-date-range-picker/rhf-date-time-picker';
import { DatePicker } from '@mui/x-date-pickers';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';

export default function LaunchIssue() {
  const LaunchIssueSchema = Yup.object().shape({
    listingExchange: Yup.string().required('Listing exchange is required'),
  });

  const defaultValues = {
    listingExchange: 'nse',
  };

  const methods = useForm({
    resolver: yupResolver(LaunchIssueSchema),
    defaultValues,
  });

  const { watch, setValue, control } = methods;

  const currentAction = watch('listingExchange');

  return (
    <FormProvider methods={methods}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>
                Launch Issue
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Listing Exchange:
                </Typography>

                <Tabs
                  value={currentAction}
                  onChange={(e, val) => setValue('listingExchange', val)}
                  TabIndicatorProps={{ sx: { display: 'none' } }}
                  sx={{
                    minHeight: 36,
                    height: 36,
                    borderBottom: 'none',
                    '& .MuiTabs-flexContainer': {
                      gap: 0.5, // Small gap between tabs
                      border: 'none',
                    },
                  }}
                >
                  {['NSE', 'BSE'].map((option) => (
                    <Tab
                      key={option}
                      label={option}
                      value={option.toLowerCase()}
                      disableRipple
                      sx={{
                        minWidth: 'auto',
                        minHeight: 36,
                        height: 36,
                        px: 2.5,
                        py: 0,
                        margin: 0,
                        fontSize: '13px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        textTransform: 'none',

                        // Override internal MUI button base styles
                        '& .MuiButtonBase-root': {
                          margin: 0,
                          padding: 0,
                        },
                        '& .MuiTab-root': {
                          margin: 0,
                        },

                        '&.Mui-selected': {
                          backgroundColor: '#2E6CF6',
                          color: '#fff',
                          borderColor: '#2E6CF6',
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Subscription Window
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFDateTimePicker name="subscriptionStartDateTime*" label="Start Date & Time*" />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFDateTimePicker name="subscriptionEndDateTime*" label="End Date & Time*" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Allotment Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfAllotment"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date of Allotment*"
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
                      textField: (params) => ({
                        ...params,
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,

                        InputProps: {
                          ...params.InputProps,

                          endAdornment: (
                            <>
                              <Tooltip
                                title="Select the actual date on which bonds are allotted"
                                placement="top"
                              >
                                <Icon
                                  icon="mdi:information-outline"
                                  width={20}
                                  style={{
                                    marginRight: 0,
                                    cursor: 'pointer',
                                    color: '#5C6BC0',
                                  }}
                                />
                              </Tooltip>

                              {/* ⭐ Keep MUI's default calendar icon */}
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        },
                      }),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfMaturity"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date of Maturity*"
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
                      textField: (params) => ({
                        ...params,
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,

                        InputProps: {
                          ...params.InputProps,

                          endAdornment: (
                            <>
                              <Tooltip
                                title="Auto-calculated from tenor; you can override if required"
                                placement="top"
                              >
                                <Icon
                                  icon="mdi:information-outline"
                                  width={20}
                                  style={{
                                    marginRight: 0,
                                    cursor: 'pointer',
                                    color: '#5C6BC0',
                                  }}
                                />
                              </Tooltip>
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        },
                      }),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                  Mode of Issuance*
                </Typography>

                <Tooltip
                  title="Select the mode of Issuance - NSDL or CDSL for demat, physical for paper form"
                  placement="top"
                >
                  <Icon
                    icon="mdi:information-outline"
                    width={16} // smaller icon
                    height={16}
                    style={{
                      cursor: 'pointer',
                      color: '#5C6BC0',
                      marginTop: 2, // slight alignment tweak (optional)
                    }}
                  />
                </Tooltip>
              </Stack>
            </Grid>

            <Grid item xs={12} md={12}>
              <RHFSelect name="depository" label="Depository" fullWidth>
                <MenuItem value="nsdl">NSDL</MenuItem>
                <MenuItem value="cdsl">CDSL</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
                Issue Period
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="issueOpeningDate "
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Issue Opening Date* "
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
              <Controller
                name="issueClosingDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Issue Closing Date*"
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
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button variant="outlined" sx={{ color: '#000000' }}>
                Cancel
              </Button>
              <LoadingButton variant="contained" sx={{ color: '#fff' }}>
                Launch Issue
              </LoadingButton>
            </Box>
          </Grid>
        </Card>
      </Container>
    </FormProvider>
  );
}
