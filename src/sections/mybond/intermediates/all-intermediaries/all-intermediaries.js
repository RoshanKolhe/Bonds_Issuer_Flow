import { Grid, Typography, Box, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import IntermediarySection from './intermediary-section';
import { useSnackbar } from 'notistack';

const ALL_INTERMEDIARIES = {
  debenture_trustee: [
    {
      id: 1,
      name: 'IDBI Trusteeship Services Ltd',
      registrationNo: 'SEBI/DT/001',
      status: 'Appointed',
    },
  ],
  rta: [
    {
      id: 1,
      name: 'KFin Technologies Ltd',
      registrationNo: 'SEBI/RTA/102',
      status: 'Appointed',
    },
  ],
  lead_manager: [
    {
      id: 1,
      name: 'Axis Capital Ltd',
      registrationNo: 'SEBI/MB/005',
      status: 'Appointed',
    },
  ],
  legal_advisor: [
    {
      id: 1,
      name: 'Cyril Amarchand Mangaldas',
      registrationNo: 'LAW/IND/001',
      status: 'Appointed',
    },
  ],
  valuer: [
    {
      id: 1,
      name: 'RBSA Valuation Advisors LLP',
      registrationNo: 'IBBI/RV/2018/103',
      status: 'Appointed',
    },
  ],
  credit_rating: [
    {
      id: 1,
      name: 'CRISIL Ratings Ltd',
      registrationNo: 'SEBI/CRA/001',
      status: 'Appointed',
    },
  ],
};

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
  const { enqueueSnackbar } = useSnackbar();

  const handleNext = () => {
    const allIntermediaries = Object.values(ALL_INTERMEDIARIES).flat();

    const hasPending = allIntermediaries.some((item) => item.status !== 'Appointed');

    if (hasPending) {
      enqueueSnackbar('Please appoint all intermediaries before proceeding', { variant: 'error' });
      return;
    }

    // ✅ All appointed → go next
    enqueueSnackbar('All intermediaries appointed', { variant: 'success' });
    setActiveStepId('fund_position');
  };
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SectionTitle icon="solar:shield-check-bold" title="Debenture Trustee" />

          <IntermediarySection data={ALL_INTERMEDIARIES.debenture_trustee} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:document-text-bold" title="Registrar & Transfer Agent (RTA)" />
          <IntermediarySection data={ALL_INTERMEDIARIES.rta} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:user-star-bold" title="Lead Manager" />
          <IntermediarySection data={ALL_INTERMEDIARIES.lead_manager} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:scale-bold" title="Legal Advisor" />
          <IntermediarySection data={ALL_INTERMEDIARIES.legal_advisor} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:calculator-bold" title="Valuer" />
          <IntermediarySection data={ALL_INTERMEDIARIES.valuer} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:chart-bold" title="Credit Rating Agency" />
          <IntermediarySection data={ALL_INTERMEDIARIES.credit_rating} />
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
