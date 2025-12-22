import { Grid, Typography, Box, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import IntermediarySection from './intermediary-section';
import { useSnackbar } from 'notistack';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useEffect, useState } from 'react';

const SectionTitle = ({ icon, title }) => (
  <Typography
    variant="h6"
    fontWeight={700}
    mb={1}
    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
  >
    <Iconify icon={icon} width={22} />
    {title}
  </Typography>
);

export default function AllIntermediariesView({ setActiveStepId }) {
  const param = useParams();
  const { applicationId } = param;
  const { enqueueSnackbar } = useSnackbar();
  const [appointedIntermediaries, setAppointedIntermediaries] = useState({
    debenture_trustee: null,
    rta: null,
    valuer: null,
    credit_rating: [],
  });
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'intermediary_appointments_pending');

  const handleNext = () => {
    const allIntermediaries = Object.values().flat();

    const hasPending = allIntermediaries.some((item) => item.status !== 'Appointed');

    if (hasPending) {
      enqueueSnackbar('Please appoint all intermediaries before proceeding', { variant: 'error' });
      return;
    }

    // ✅ All appointed → go next
    enqueueSnackbar('All intermediaries appointed', { variant: 'success' });
    setActiveStepId('fund_position');
  };

  useEffect(() => {
    if (stepData && !stepDataLoading) {
      if (stepData.debentureTrustee) {
        appointedIntermediaries.debenture_trustee = {
          ...stepData.debentureTrustee,
          status: 'Appointed'
        }
      };

      if (stepData.creditRatingAgency.length) {
        appointedIntermediaries.credit_rating = stepData.creditRatingAgency.map((agency) => ({
          ...agency,
          status: 'Appointed'
        }))
      };

      if (stepData.registrarAndTransferAgent) {
        appointedIntermediaries.rta = {
          ...stepData.registrarAndTransferAgent,
          status: 'Appointed'
        }
      };

      if (stepData.valuer) {
        appointedIntermediaries.valuer = {
          ...stepData.valuer,
          status: 'Appointed'
        }
      };
    }
  }, [stepData, stepDataLoading]);
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SectionTitle icon="solar:shield-check-bold" title="Debenture Trustee" />

          <IntermediarySection data={appointedIntermediaries.debenture_trustee} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:document-text-bold" title="Registrar & Transfer Agent (RTA)" />
          <IntermediarySection data={appointedIntermediaries.rta} />
        </Grid>

        {/* <Grid item xs={12}>
          <SectionTitle icon="solar:user-star-bold" title="Lead Manager" />
          <IntermediarySection data={appointedIntermediaries.lead_manager} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:scale-bold" title="Legal Advisor" />
          <IntermediarySection data={appointedIntermediaries.legal_advisor} />
        </Grid> */}

        <Grid item xs={12}>
          <SectionTitle icon="solar:calculator-bold" title="Valuer" />
          <IntermediarySection data={appointedIntermediaries.valuer} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:chart-bold" title="Credit Rating Agency" />
          <IntermediarySection data={appointedIntermediaries.credit_rating} />
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </>
  );
}
