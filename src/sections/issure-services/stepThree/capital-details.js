import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';



export default function CapitalDetails() {

  return (

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
            />
          </Grid>

          {/* = symbol */}
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              =
            </Typography>
          </Grid>

          {/* Net Worth */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="netWorth"
              label="Net Worth"
              fullWidth
            />
          </Grid>
        </Grid>
      </Card>
    </Box>

  );
}
