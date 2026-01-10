import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Box,
  Grid,
  Stack,
  Typography,
  Slider,
  Paper,
  Divider,
} from '@mui/material';
import Chart, { useChart } from 'src/components/chart';
import BondIssueParameters from '../bond-estimation-report/issue-parameter';
import IssueInvestmentMatrics from '../bond-estimation-report/issue-investement-matrics';
import ScenarioComparison from '../bond-estimation-report/scenario-comparison';
import CostsBreakdown from '../bond-estimation-report/costs-breakdown';
import MarketComparisons from '../bond-estimation-report/market-comparisons';
import { useParams } from 'src/routes/hook';
import { useGetBondEstimationReport } from 'src/api/bondEstimationReport';


// ----------------------------------------------------------------------
const mockBonds = [
  {
    asin_code: "INE08X507Q82",
    asapl: "12.00%",
    company_name: "Satya microcapital ltd.",
    issue_date: "14-Jun-2024",
    isin_code: "INE08X507Q82",
    price: "10,00,000",
    coupon_rate_percent: "8.25",
    ytm_percent: "8.40",
    interest_payment_frequency: "Quarterly",
    maturity_date: "14-Jun-2034",
    issuer_type: "Corporate",
    ratings: [{ rating: "AAA" }],
  },
  {
    asin_code: "INE12X307P62",
    asapl: "10.75%",
    company_name: "Satya microcapital ltd",
    issue_date: "10-Apr-2023",
    isin_code: "INE12X307P62",
    price: "10,00,000",
    coupon_rate_percent: "7.80",
    ytm_percent: "8.00",
    interest_payment_frequency: "Half-Yearly",
    maturity_date: "10-Apr-2033",
    issuer_type: "Corporate",
    ratings: [{ rating: "AA+" }],
  },
  {
    asin_code: "INE98X102K81",
    asapl: "9.50%",
    company_name: "Satya microcapital ltd",
    issue_date: "20-Jan-2022",
    isin_code: "INE98X102K81",
    price: "5,00,000",
    coupon_rate_percent: "7.25",
    ytm_percent: "7.40",
    interest_payment_frequency: "Monthly",
    maturity_date: "20-Jan-2032",
    issuer_type: "Government",
    ratings: [{ rating: "AAA" }],
  },
  {
    asin_code: "INE01X107L91",
    asapl: "11.20%",
    company_name: "Satya microcapital ltd",
    issue_date: "05-Mar-2025",
    isin_code: "INE01X107L91",
    price: "8,00,000",
    coupon_rate_percent: "9.00",
    ytm_percent: "9.25",
    interest_payment_frequency: "Quarterly",
    maturity_date: "05-Mar-2035",
    issuer_type: "Corporate",
    ratings: [{ rating: "AA" }],
  },
];

const estimationResponse = {
  financial_metrics: {
    dscr: 6.25,
    dscr_rating: 'EXCELLENT',
    debt_equity_ratio: 0.67,
    leverage_rating: 'CONSERVATIVE',
  },
  recommendations: {
    issue_size: 100000000,
    coupon_rate: 8.5,
    tenure_years: 10,
    security_type: 'UNSECURED',
  },
  cost_breakdown: {
    professional_advisory_fees: 500000,
    regulatory_statutory_costs: 250000,
    placement_distribution_costs: 525000,
    documentation_printing: 102000,
    security_creation_compliance: 50000,
    ongoing_compliance_costs: 1000000,
    miscellaneous_costs: 200000,
  },
  total_estimated_cost: 2627000,
  cost_as_percentage: 2.63,
};

export default function BondIssuePage() {

  const params = useParams();

  const { applicationId } = params;

  const [estimationData, setEstimationData] = useState(null);

  const { bondEstimationReport } = useGetBondEstimationReport(applicationId)

  console.log('BondsEstimation Data', bondEstimationReport)

  useEffect(() => {
    setEstimationData(bondEstimationReport);
  }, []);

  if (!estimationData) return null;

  const {
    userInputs,
    systemRecommendedInputs,
    costBreakdown,
    subscriptionTarget,
    proposedTarget,
  } = estimationData;


  return (
    <Box sx={{ p: 3 }} >
      <Stack spacing={3}>
        <BondIssueParameters
          issueSize={systemRecommendedInputs?.issueAmount}
          couponRate={systemRecommendedInputs?.couponRate}
          tenure={systemRecommendedInputs?.tenure}
        />

        <IssueInvestmentMatrics subscriptionTarget={subscriptionTarget} proposedTarget={proposedTarget} />
        <ScenarioComparison systemRecommendedInputs={systemRecommendedInputs} userInputs={userInputs}  />
        <CostsBreakdown breakdown={costBreakdown} />
        <MarketComparisons bonds={mockBonds} />

      </Stack>
    </Box>
  );
}
