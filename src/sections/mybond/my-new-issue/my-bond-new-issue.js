import { Stack, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import IssueDocumentsCard from './issue-documents-card';
import IssueDetailsCard from './issue-details-card';

export default function MyBondNewIssue({
  currentIssueDetail,
  currentIssueDocument,
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [detailsPercent, setDetailsPercent] = useState(0);
  const [docsPercent, setDocsPercent] = useState(0);

  const [detailsCompleted, setDetailsCompleted] = useState(false);
  const [docsCompleted, setDocsCompleted] = useState(false);

  // ---------- NEXT ----------
  const handleNextClick = () => {
    if (!detailsCompleted) {
      enqueueSnackbar('Please complete issue details section');
      return;
    }

    if (!docsCompleted) {
      enqueueSnackbar('Please upload all required documents');
      return;
    }

    setActiveStepId('intermediaries');
  };

  // ---------- PERCENT ----------
  useEffect(() => {
    const total = detailsPercent + docsPercent; // SAME AS FUND POSITION
    percent?.(total);
  }, [detailsPercent, docsPercent, percent]);

  return (
    <>
      <Stack spacing={3}>
        <IssueDetailsCard
          currentIssueDetail={currentIssueDetail}
          setPercent={setDetailsPercent}
          setProgress={setDetailsCompleted}
          saveStepData={(data) => saveStepData('issueDetails', data)}
        />

        <IssueDocumentsCard
          currentIssueDocument={currentIssueDocument}
          setPercent={setDocsPercent}
          setProgress={setDocsCompleted}
          saveStepData={(data) => saveStepData('documentData', data)}
        />
      </Stack>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNextClick}>
          Next
        </Button>
      </Box>
    </>
  );
}
