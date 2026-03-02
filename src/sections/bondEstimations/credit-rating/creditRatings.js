/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCustomFileUploadBox } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { DatePicker } from '@mui/x-date-pickers';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { useGetCreditRatingAgencies, useGetCreditRatings } from 'src/api/creditRatingsAndAgencies';
import { useParams } from 'src/routes/hook';
import { format } from 'date-fns';

export default function CreditRating({ currentCreditRatings, percent, setActiveStepId }) {
  const params = useParams();
  const { applicationId } = params;
  const [agenciesData, setAgenciesData] = useState([]);
  const [ratingsData, setRatingsData] = useState([]);
  const { creditRatingAgencies, creditRatingAgenciesLoading } = useGetCreditRatingAgencies();
  const { creditRatings, creditRatingsLoading } = useGetCreditRatings();
  const { enqueueSnackbar } = useSnackbar();
  const [ratingList, setRatingList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApiSubmitting, setIsApiSubmitting] = useState(false);

  const newCreditRatingSchema = Yup.object().shape({
    selectedAgency: Yup.object().required('Please select agency'),
    selectedRating: Yup.object().required('Please select rating'),
    validFrom: Yup.string().required('Valid from is required'),
    creditRatingLetter: Yup.mixed().required('Credit rating letter required'),
  });

  const defaultValues = useMemo(
    () => ({
      selectedAgency: null,
      selectedRating: null,
      validFrom: '',
      creditRatingLetter: null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newCreditRatingSchema),
    defaultValues,
  });

  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleAddRating = handleSubmit((data) => {
    const newEntry = {
      agency: data.selectedAgency,
      rating: data.selectedRating,
      validFrom: data.validFrom,
      creditRatingLetter: data.creditRatingLetter,
    };

    if (isEditing) {
      const updatedList = [...ratingList];
      updatedList[editIndex] = newEntry;
      setRatingList(updatedList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setRatingList([...ratingList, newEntry]);
    }

    reset(defaultValues);
  });

  const handleDeleteRating = (index) => {
    setRatingList(ratingList.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    try {
      setIsApiSubmitting(true);
      if (!ratingList.length || ratingList.length === 0) {
        enqueueSnackbar('Please add at least one rating', { variant: 'error' });
        return;
      }

      const payload = {
        creditRatings: ratingList.map((rating) => ({
          validFrom: rating.validFrom,
          creditRatingsId: rating.rating.id,
          creditRatingAgenciesId: rating.agency.id,
          ratingLetterId: rating.creditRatingLetter.id,
          isActive: true,
        })),
      };

      const response = await axiosInstance.patch(`/bond-estimations/credit-ratings/${applicationId}`, payload);

      if (response.data?.success) {
        setActiveStepId(true);
        enqueueSnackbar('Credit ratings updated', { variant: 'success' });
      }
    } catch (error) {
      console.error('error while submitting credit ratings :', error);
    } finally {
      setIsApiSubmitting(false);
    }
  };

  const calculatePercent = () => {
    if (!ratingList.length) {
      percent?.(0);
      return;
    }

    let completed = 0;
    const latest = ratingList[0];

    if (latest.agency) completed++;
    if (latest.rating) completed++;
    if (latest.validFrom) completed++;
    if (latest.creditRatingLetter) completed++;
    if (ratingList.length > 0) completed++;

    const percentVal = (completed / 5) * 100;
    percent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
  }, [ratingList, values]);

  useEffect(() => {
    if (creditRatingAgencies && !creditRatingAgenciesLoading) {
      setAgenciesData(creditRatingAgencies);
    }
  }, [creditRatingAgencies, creditRatingAgenciesLoading]);

  useEffect(() => {
    if (creditRatings && !creditRatingsLoading) {
      setRatingsData(creditRatings);
    }
  }, [creditRatings, creditRatingsLoading]);

  useEffect(() => {
    if (currentCreditRatings?.length && currentCreditRatings?.length > 0) {
      const newRatingList = currentCreditRatings.map((rating) => ({
        agency: rating.creditRatingAgencies,
        rating: rating.creditRatings,
        validFrom: rating.validFrom,
        creditRatingLetter: rating.ratingLetter,
      }));

      setRatingList(newRatingList);
    }
  }, [currentCreditRatings]);

  return (
    <FormProvider methods={methods} onSubmit={handleAddRating}>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
          Credit Ratings Available
        </Typography>

        <Grid container spacing={4} mb={2}>
          <Grid item xs={12} md={6}>
            <RHFAutocomplete
              name="selectedAgency"
              label="Credit Rating Agency"
              options={agenciesData || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFAutocomplete
              name="selectedRating"
              label="Credit Rating"
              options={ratingsData || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
            />
            <YupErrorMessage name="selectedRating" />
          </Grid>
        </Grid>

        <Controller
          name="validFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              sx={{ mb: 2 }}
              {...field}
              label="Valid From"
              value={field.value ? (field.value instanceof Date ? field.value : new Date(field.value)) : null}
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

        <RHFCustomFileUploadBox
          name="creditRatingLetter"
          label="Upload Credit Rating Letter"
          icon="mdi:file-document-outline"
          accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          }}
        />

        <YupErrorMessage name="creditRatingLetter" />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: 2 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEditing ? 'Update Rating' : 'Add Rating'}
          </LoadingButton>
        </Box>

        {ratingList.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Added Ratings
            </Typography>

            <TableContainer component={Card}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rating Agency</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Valid From</TableCell>
                    <TableCell>Letter</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ratingList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.agency?.name}</TableCell>
                      <TableCell>{row.rating?.name}</TableCell>
                      <TableCell>{row.validFrom ? format(new Date(row.validFrom), 'dd/MM/yyyy') : 'NA'}</TableCell>
                      <TableCell>
                        <Button variant="text" color="primary" onClick={() => window.open(row.creditRatingLetter?.fileUrl, '_blank')}>
                          Preview
                        </Button>
                      </TableCell>

                      <TableCell align="center">
                        <Icon
                          icon="mdi:pencil-outline"
                          width="20"
                          style={{ cursor: 'pointer', marginRight: 12 }}
                          onClick={() => {
                            setValue('selectedAgency', agenciesData.find((a) => a.id === row.agency?.id));
                            setValue('selectedRating', ratingsData.find((r) => r.id === row.rating?.id));
                            setValue('validFrom', row.validFrom);
                            setValue('additionalRating', row.additionalRating);
                            setValue('creditRatingLetter', row.creditRatingLetter);
                            setIsEditing(true);
                            setEditIndex(index);
                          }}
                        />

                        <Icon
                          icon="mdi:delete-outline"
                          width="20"
                          style={{ cursor: 'pointer', color: '#d32f2f' }}
                          onClick={() => handleDeleteRating(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton loading={isApiSubmitting} type="button" variant="contained" onClick={onSubmit}>
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

CreditRating.propTypes = {
  currentCreditRatings: PropTypes.array,
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
};
