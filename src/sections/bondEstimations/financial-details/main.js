import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import FinancialDetails from './financial-details';
import CapitalDetails from './capital-details';
import ProfitabilityDetails from './profitable-details';
import FundPosition from './fundPosition';
import AuditedFinancial from './audited-financial';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router';
import { paths } from 'src/routes/paths';

export default function FinancialDetailsMain({
  percent,
  currentFinancialRatios,
  currentCapitalDetails,
  currentProfitabilityDetails,
  currentFundPosition,
  currentBorrowingDetails,
  currentFinancialStatements,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const { applicationId } = params;
  const [ratiosPercent, setRatiosPercent] = useState(0);
  const [capitalPercent, setCapitalPercent] = useState(0);
  const [profitabilityPercent, setProfitabilityPercent] = useState(0);
  const [fundPositionPercent, setFundPositionPercent] = useState(0);
  const [auditedFinancialPercent, setAuditedFinancialPercent] = useState(0);

  const [ratiosCompleted, setRatiosCompleted] = useState(false);
  const [capitalCompleted, setCapitalCompleted] = useState(false);
  const [profitabilityCompleted, setProfitabilityCompleted] = useState(false);
  const [fundPositionCompleted, setFundPositionCompleted] = useState(false);
  const [auditedFinancialCompleted, setAuditedFinancialCompleted] = useState(false);

  const handleGenerateReport = () => {
    if (!fundPositionCompleted) {
      enqueueSnackbar("Please complete the fund position section", { variant: 'error' });
      return;
    }

    if (!auditedFinancialCompleted) {
      enqueueSnackbar("Please complete the 3-year financial statement section", { variant: 'error' });
      return;
    }

    if (!capitalCompleted) {
      enqueueSnackbar("Please complete the capital details section", { variant: 'error' });
      return;
    }

    if (!profitabilityCompleted) {
      enqueueSnackbar("Please complete the profitability details section", { variant: 'error' });
      return;
    }

    if (!ratiosCompleted) {
      enqueueSnackbar("Ratios are missing", { variant: 'error' });
      return;
    }

    navigate(paths.dashboard.issureservices.view(applicationId));
  }

  useEffect(() => {
    const weightedTotal =
      ratiosPercent * 0.2 +
      capitalPercent * (20 / 30) +
      profitabilityPercent * (20 / 30) +
      fundPositionPercent * 0.8 +
      auditedFinancialPercent * 0.2;

    const allCompleted =
      ratiosCompleted &&
      capitalCompleted &&
      profitabilityCompleted &&
      fundPositionCompleted &&
      auditedFinancialCompleted;

    percent?.(allCompleted ? 100 : Math.min(99, Math.round(weightedTotal)));
  }, [
    ratiosPercent,
    capitalPercent,
    profitabilityPercent,
    fundPositionPercent,
    ratiosCompleted,
    capitalCompleted,
    profitabilityCompleted,
    fundPositionCompleted,
    auditedFinancialCompleted,
    auditedFinancialPercent,
    percent,
  ]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AuditedFinancial
          currentFinancialStatements={currentFinancialStatements}
          setPercent={setAuditedFinancialPercent}
          setProgress={setAuditedFinancialCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <FundPosition
          currentFundPosition={currentFundPosition}
          setPercent={setFundPositionPercent}
          setProgress={setFundPositionCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <CapitalDetails
          currentCapitalDetails={currentCapitalDetails}
          setPercent={setCapitalPercent}
          setProgress={setCapitalCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentProfitabilityDetails={currentProfitabilityDetails}
          setPercent={setProfitabilityPercent}
          setProgress={setProfitabilityCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <FinancialDetails
          currentFinancialRatios={currentFinancialRatios}
          currentCapitalDetails={currentCapitalDetails}
          currentProfitabilityDetails={currentProfitabilityDetails}
          currentFundPosition={currentFundPosition}
          currentBorrowingDetails={currentBorrowingDetails}
          setPercent={setRatiosPercent}
          setProgress={setRatiosCompleted}
        />
      </Grid>

      <Grid sx={{display: 'flex', justifyContent: 'flex-end'}} item xs={12}>
        <Button variant='contained' type='button' onClick={() => handleGenerateReport()}>Generate Report</Button>
      </Grid>
    </Grid>
  );
}

FinancialDetailsMain.propTypes = {
  percent: PropTypes.func,
  currentFinancialRatios: PropTypes.object,
  currentCapitalDetails: PropTypes.object,
  currentProfitabilityDetails: PropTypes.object,
  currentFundPosition: PropTypes.object,
  currentBorrowingDetails: PropTypes.array,
  currentFinancialStatements: PropTypes.array,
};
