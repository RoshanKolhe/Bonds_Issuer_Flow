import React from 'react';
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
import BondIssueParameters from '../afterAllSteps/issue-parameter';
import IssueInvestmentMatrics from '../afterAllSteps/issue-investement-matrics';
import ScenarioComparison from '../afterAllSteps/scenario-comparison';


// ----------------------------------------------------------------------

export default function BondIssuePage() {
  // Example state values (you can replace with form or API data)
  const [issueSize, setIssueSize] = React.useState(5000000);
  const [couponRate, setCouponRate] = React.useState(7.5);
  const [tenure, setTenure] = React.useState(10);

  // Donut chart (total investment)
  const totalAmountOptions = useChart({
    labels: ['Investor A', 'Investor B', 'Investor C'],
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
  });

  const totalAmountSeries = [1200000, 900000, 600000];

  // Cost Breakdown chart
  const costBreakdownOptions = useChart({
    labels: [
      'Underwriting Fees',
      'Legal Fees',
      'Advisory Fees',
      'Listing Fees',
      'Other Charges',
    ],
    legend: { position: 'right' },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
  });

  const costBreakdownSeries = [400000, 250000, 150000, 100000, 50000];

  return (
    <Box sx={{ p: 3 }} >
      <Stack spacing={3}>
        <BondIssueParameters />
        <IssueInvestmentMatrics />
        <ScenarioComparison />
      </Stack>
    </Box>
  );
}
