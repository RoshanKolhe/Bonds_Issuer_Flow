import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import ProfitabilityDetails from './profitable-details';
import FinancialDetails from './financial-details';
import FundPosition from './fundPosition';
import CapitalDetails from './capital-details';
import AuditedFinancial from './audited-financial';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import axiosInstance from 'src/utils/axios';

export default function FinancialProfitableMainFile({
  percent,
  setActiveStepId,
}) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const { stepData: financialDetailsData } = useGetBondApplicationStepData(applicationId, 'financial_details');
  const { stepData: fundPositionData } = useGetBondApplicationStepData(applicationId, 'fund_position');
  const { stepData: capitalDetailsData } = useGetBondApplicationStepData(applicationId, 'capital_details');
  const { stepData: borrowingDetailsData } = useGetBondApplicationStepData(applicationId, 'borrowing_details');
  const [financialPercent, setFinancialPercent] = useState(0);
  const [fundPositionPercent, setFundPositionPercent] = useState(0);
  const [capitalPercent, setCapitalPercent] = useState(0);
  const [profitabilityPercent, setProfitabilityPercent] = useState(0);
  const [auditedFinancialPercent, setAuditedFinancialPercent] = useState(0);
  const [financialCompleted, setFinancialCompleted] = useState(false);
  const [fundPositionCompleted, setFundPositionCompleted] = useState(false);
  const [capitalCompleted, setCapitalCompleted] = useState(false);
  const [profitabilityCompleted, setProfitabilityCompleted] = useState(false);
  const [auditedFinancialCompleted, setAuditedFinancialCompleted] = useState(false);

  useEffect(() => {
    const normalizedTotal =
      (Math.min(100, financialPercent * 2) +
        Math.min(100, fundPositionPercent * 2) +
        Math.min(100, capitalPercent * 2) +
        Math.min(100, profitabilityPercent * 2) +
        auditedFinancialPercent) /
      5;

    const allCompleted =
      financialCompleted &&
      fundPositionCompleted &&
      capitalCompleted &&
      profitabilityCompleted &&
      auditedFinancialCompleted;

    percent?.(allCompleted ? 100 : Math.round(normalizedTotal));
  }, [
    financialPercent,
    fundPositionPercent,
    capitalPercent,
    profitabilityPercent,
    auditedFinancialPercent,
    financialCompleted,
    fundPositionCompleted,
    capitalCompleted,
    profitabilityCompleted,
    auditedFinancialCompleted,
    percent,
  ]);

  const handleNextClick = () => {
    if (!financialCompleted) {
      enqueueSnackbar('financial ratios are not filled', {
        variant: 'warning',
      });
      return;
    }

    if (!fundPositionCompleted) {
      enqueueSnackbar('Fund position details are not filled', {
        variant: 'warning',
      });
      return;
    }

    if (!capitalCompleted) {
      enqueueSnackbar('Capital details are not filled', {
        variant: 'warning',
      });
      return;
    }

    if (!profitabilityCompleted) {
      enqueueSnackbar('Profitability details are not filled', {
        variant: 'warning',
      });
      return;
    }

    if (!auditedFinancialCompleted) {
      enqueueSnackbar('3-year financial statement is not filled', {
        variant: 'warning',
      });
      return;
    }

    setActiveStepId('credit_rating');
  };

  useEffect(() => {
    const fetchRatios = async () => {
      try {
        const response = await axiosInstance.get(`/bonds-pre-issue/financial-ratios/${applicationId}`);

        if (response.data.success) {
          setData({
            financialRatios: response.data.details?.financialRatios,
            profitabilityDetails: response.data.details?.profitabilityDetails,
            financialStatements: response.data.details?.financialStatements || [],
          });
        }
      } catch (error) {
        console.error('Error while fetching the ratios :', error);
      }
    };

    fetchRatios();
  }, [applicationId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AuditedFinancial
          currentFinancialStatements={financialDetailsData?.financialStatements || []}
          setPercent={setAuditedFinancialPercent}
          setProgress={setAuditedFinancialCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <FundPosition
          currentFundPosition={fundPositionData}
          setPercent={setFundPositionPercent}
          setProgress={setFundPositionCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <CapitalDetails
          currentCapitalDetails={capitalDetailsData}
          setPercent={setCapitalPercent}
          setProgress={setCapitalCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentDetails={data?.profitabilityDetails}
          setPercent={setProfitabilityPercent}
          setProgress={setProfitabilityCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <FinancialDetails
          currentDetails={data?.financialRatios}
          currentCapitalDetails={capitalDetailsData}
          currentProfitabilityDetails={data?.profitabilityDetails}
          currentFundPosition={fundPositionData}
          currentBorrowingDetails={borrowingDetailsData}
          setPercent={setFinancialPercent}
          setProgress={setFinancialCompleted}
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
  setActiveStepId: PropTypes.func,
  percent: PropTypes.func,
};
