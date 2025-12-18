import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import ProfitabilityDetails from './profitable-details';
import FinancialDetails from './financial-details';

export default function FinancialProfitableMainFile({
  saveStepData,
  currentFinancial,
  currentProfitability,
  percent,
  setActiveStepId,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [financialPercent, setFinancialPercent] = useState(0);
  const [profitabilityPercent, setProfitabilityPercent] = useState(0);

  const [financialCompleted, setFinancialCompleted] = useState(false);
  const [profitabilityCompleted, setProfitabilityCompleted] = useState(false);

  useEffect(() => {
    const total = financialPercent + profitabilityPercent;
    percent?.(total);
  }, [financialPercent, profitabilityPercent, percent]);

  const handleNextClick = () => {
    if (!profitabilityCompleted) {
      enqueueSnackbar('Please complete Profitability Details section', {
        variant: 'warning',
      });
      return;
    }

    setActiveStepId('trustee_selection');
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FinancialDetails
          currentDetails={currentFinancial}
          setPercent={setFinancialPercent}
          setProgress={setFinancialCompleted}
          saveStepData={(data) => saveStepData('financialStatements', data)}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentDetails={currentProfitability}
          setPercent={setProfitabilityPercent}
          setProgress={setProfitabilityCompleted}
          saveStepData={(data) => saveStepData('profitabilityStatements', data)}
        />
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
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ color: '#fff' }}
            onClick={handleNextClick}
          >
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}

FinancialProfitableMainFile.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
