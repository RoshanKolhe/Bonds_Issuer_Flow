import { useState, useMemo } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFAutocomplete } from 'src/components/hook-form';
import { useGetCreditRatingAgencies } from 'src/api/creditRatingsAndAgencies';
import { useSnackbar } from 'notistack';

export default function CreditRatingAgency() {
  const { enqueueSnackbar } = useSnackbar();

  const { creditRatingAgencies = [], creditRatingAgenciesLoading } = useGetCreditRatingAgencies();

  const [agencyList, setAgencyList] = useState([]);

  const Schema = Yup.object().shape({
    agencies: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      agencies: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;

  const selectedAgencies = watch('agencies');

  // ---------------- Add Multiple Agencies ----------------
  const handleAddAgencies = () => {
    if (!selectedAgencies?.length) return;

    setAgencyList((prev) => {
      const existingIds = prev.map((a) => a.id);
      const newOnes = selectedAgencies.filter((a) => !existingIds.includes(a.id));
      return [...prev, ...newOnes];
    });

    // clear selection
    setValue('agencies', []);
  };

  // ---------------- Remove ----------------
  const handleRemove = (id) => {
    setAgencyList((prev) => prev.filter((a) => a.id !== id));
  };

  const onSubmit = () => {
    if (!agencyList.length) {
      enqueueSnackbar('Please add at least one credit rating agency', {
        variant: 'error',
      });
      return;
    }

    console.log('✅ Selected Credit Rating Agencies:', agencyList);

    enqueueSnackbar('Credit Rating Agencies saved successfully', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2, mb: '50px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Iconify icon="solar:chart-bold" width={22} />
              Credit Rating Agency
            </Typography>
          </Grid>

          {/* Multi Select Autocomplete */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <RHFAutocomplete
                  name="agencies"
                  label="Select Credit Rating Agencies"
                  multiple
                  options={creditRatingAgencies}
                  loading={creditRatingAgenciesLoading}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Iconify icon="solar:chart-bold" width={18} style={{ marginRight: 8 }} />
                      {option.name}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={option.name}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleAddAgencies}
                startIcon={<Iconify icon="solar:add-circle-bold" />}
                sx={{
                  px: 3,
                  height: 40, // 🔥 same visual size as Save
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
          {/* Table */}
          {agencyList.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agency Name</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {agencyList.map((agency) => (
                      <TableRow key={agency.id}>
                        <TableCell>{agency.name}</TableCell>
                        <TableCell align="right">
                          <IconButton color="error" onClick={() => handleRemove(agency.id)}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          )}

          {/* Save */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
