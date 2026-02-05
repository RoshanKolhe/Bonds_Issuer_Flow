import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Card,
  Checkbox,
  Tooltip,
  Alert,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useGetCreditRatingAgencies } from 'src/api/creditRatingsAndAgencies';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'react-router';
import Label from 'src/components/label';

export default function CreditRatingAgency({ isLocked, stepData }) {
  const { enqueueSnackbar } = useSnackbar();
  const { applicationId } = useParams();

  const { creditRatingAgencies = [] } = useGetCreditRatingAgencies();

  const [selectedAgencyIds, setSelectedAgencyIds] = useState([]);
  const [showError, setShowError] = useState(false);


  useEffect(() => {
    if (stepData?.creditRatingAgency?.length) {
      setSelectedAgencyIds(
        stepData.creditRatingAgency.map((agency) => agency.id)
      );
    }
  }, [stepData?.creditRatingAgency]);

  const handleToggle = (id) => {
    if (isLocked) return;

    setShowError(false);
    setSelectedAgencyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = async () => {
    if (!selectedAgencyIds.length) {
      setShowError(true);
      enqueueSnackbar('Please select at least one credit rating agency', {
        variant: 'error',
      });
      return;
    }

    const selectedAgencies = creditRatingAgencies.filter((agency) =>
      selectedAgencyIds.includes(agency.id)
    );

    try {
      const response = await axiosInstance.post(
        `/bonds-pre-issue/save-intermediaries/${applicationId}`,
        {
          creditRatingAgency: selectedAgencies,
        }
      );

      if (response?.data?.success) {
        enqueueSnackbar('Request sent successfully', { variant: 'success' });

      }
    } catch (error) {
      enqueueSnackbar('Failed to send request', { variant: 'error' });
    }
  };

  const fileUrl =
    'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=400&auto=format&fit=crop';

  return (
    <>
      {/* HEADER */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ p: 2 }}
        justifyContent="space-between"
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Iconify icon="solar:chart-bold" width={22} />
          Credit Rating Agency
        </Typography>

        <Button
          variant="contained"
          disabled={isLocked || selectedAgencyIds.length === 0}
          onClick={onSubmit}
        >
          Send Request
        </Button>
      </Stack>

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          You must select at least one credit rating agency
        </Alert>
      )}

      {/* LIST */}
      <Grid container spacing={3}>
        {creditRatingAgencies.map((agency) => {
          const checked = selectedAgencyIds.includes(agency.id);

          return (
            <Grid item xs={12} md={6} lg={4} key={agency.id}>
              <Card
                sx={{
                  p: 2.5,
                  height: '100%',
                  position: 'relative',
                  border: checked
                    ? '2px solid #1877F2'
                    : '1px solid #e0e0e0',
                  pointerEvents: isLocked ? 'none' : 'auto',
                  transition: '0.2s',
                }}
              >
                {checked ? (
                  <Label sx={{ position: 'absolute', top: 8, right: 8 }} variant='soft' color='success'>Appointed</Label>
                ) : (<Checkbox
                  checked={checked}
                  disabled={isLocked}
                  onChange={() => handleToggle(agency.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />)}

                <Box sx={{ height: 60, mb: 1.5 }}>
                  <Box
                    component="img"
                    src={agency.logo?.fileUrl || fileUrl}
                    alt={agency.name}
                    sx={{ maxHeight: 50, objectFit: 'contain' }}
                  />
                </Box>

                <Typography fontWeight={600} variant="subtitle1">
                  {agency.name}
                </Typography>

                <Tooltip title={agency.description || ''} arrow>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {agency.description || 'No description available'}
                  </Typography>
                </Tooltip>

              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
