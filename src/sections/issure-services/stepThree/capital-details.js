import React, { useEffect } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ✅ Validation schema (optional)
const Schema = Yup.object().shape({
  shareCapital: Yup.number().typeError('Enter a valid number').required('Required'),
  reserveSurplus: Yup.number().typeError('Enter a valid number').required('Required'),
  netWorth: Yup.number().typeError('Enter a valid number'),
});

export default function CapitalDetails() {
  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      shareCapital: '',
      reserveSurplus: '',
      netWorth: '',
    },
  });

  const { watch, setValue } = methods;

  // ✅ Watch for field changes
  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');

  // ✅ Auto-calculate net worth whenever either field changes
  useEffect(() => {
    const total =
      (parseFloat(shareCapital) || 0) + (parseFloat(reserveSurplus) || 0);
    setValue('netWorth', total.toFixed(2)); // Keeps 2 decimal precision
  }, [shareCapital, reserveSurplus, setValue]);

  return (
    <FormProvider methods={methods}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h3" fontWeight={600} color="#1874ED" mb={2}>
            Capital Details
          </Typography>

          <Grid container spacing={1} alignItems="center">
            {/* Share Capital */}
            <Grid item xs={12} md={3}>
              <RHFTextField
                name="shareCapital"
                label="Share Capital"
                fullWidth
                type="number"
              />
            </Grid>

            {/* + symbol */}
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                +
              </Typography>
            </Grid>

            {/* Reserve Surplus */}
            <Grid item xs={12} md={3}>
              <RHFTextField
                name="reserveSurplus"
                label="Reserve Surplus"
                fullWidth
                type="number"
              />
            </Grid>

            {/* = symbol */}
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                =
              </Typography>
            </Grid>

            {/* Net Worth (auto-calculated) */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="netWorth"
                label="Net Worth"
                fullWidth
                type="number"
                InputProps={{ readOnly: true }} 
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}
