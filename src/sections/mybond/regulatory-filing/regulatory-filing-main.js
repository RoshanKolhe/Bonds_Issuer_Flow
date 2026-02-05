import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import PAS4 from './pas4';
import TermSheet from './term-sheet';
import InformationMemorandum from './information-memorandum';
import InPrincipleApproval from './in-principle';
import TrusteeDueDiligence from './trustee-due-diligence';
import PAS5 from './pas5';
import GID from './gid';

export default function RegulatoryFilingMain({
  currentPAS4Regulatory,
  currentPAS5Regulatory,
  currentGIDRegulatory,
  currentTermSheetRegulatory,
  currentInformationMemorandumRegulatory,
  currentInPrincipleRegulatory,
  currentTrusteeDueDiligenceRegulatory,
  saveStepData,
  percent,
  setActiveStepId,
}) {
  const { enqueueSnackbar } = useSnackbar();

  /* ---------------- SECTION PERCENTS ---------------- */
  const [pas4Percent, setPas4Percent] = useState(0);
  const [pas5Percent, setPas5Percent] = useState(0);
  const [gidPercent, setGidPercent] = useState(0);
  const [termSheetPercent, setTermSheetPercent] = useState(0);
  const [memorandumPercent, setMemorandumPercent] = useState(0);

  /* ---------------- COMPLETION FLAGS ---------------- */
  const [pas4Completed, setPas4Completed] = useState(false);
  const [pas5Completed, setPas5Completed] = useState(false);
  const [gidCompleted, setGidCompleted] = useState(false);
  const [termSheetCompleted, setTermSheetCompleted] = useState(false);
  const [memorandumCompleted, setMemorandumCompleted] = useState(false);

  /* ---------------- TOTAL PERCENT ---------------- */
  useEffect(() => {
    const total =
      pas4Percent +
      pas5Percent +
      gidPercent +
      termSheetPercent +
      memorandumPercent;

    percent?.(Math.round(total));
  }, [
    pas4Percent,
    pas5Percent,
    gidPercent,
    termSheetPercent,
    memorandumPercent,
  ]);

  /* ---------------- NEXT ---------------- */
  const handleNextClick = () => {
    if (!termSheetCompleted) {
      enqueueSnackbar('Please complete Term Sheet section', {
        variant: 'warning',
      });
      return;
    }

    if (!pas4Completed) {
      enqueueSnackbar('Please complete PAS-4 section', {
        variant: 'warning',
      });
      return;
    }

    if (!pas5Completed) {
      enqueueSnackbar('Please complete PAS-5 section', {
        variant: 'warning',
      });
      return;
    }

    if (!gidCompleted) {
      enqueueSnackbar('Please complete GID section', {
        variant: 'warning',
      });
      return;
    }

    if (!memorandumCompleted) {
      enqueueSnackbar(
        'Please complete Prospectus / Information Memorandum section',
        { variant: 'warning' }
      );
      return;
    }

    setActiveStepId?.('trustee_due_diligence');
  };

  return (
    <Grid container spacing={3}>
      {/* ---------------- TERM SHEET ---------------- */}
      <Grid item xs={12}>
        <TermSheet
          currentData={currentTermSheetRegulatory}
          setPercent={setTermSheetPercent}
          setProgress={setTermSheetCompleted}
          saveStepData={(data) => saveStepData({ sebiApprovals: data })}
        />
      </Grid>

      {/* ---------------- PAS-4 ---------------- */}
      <Grid item xs={12}>
        <PAS4
          currentData={currentPAS4Regulatory}
          setPercent={setPas4Percent}
          setProgress={setPas4Completed}
          saveStepData={(data) => saveStepData({ pas4: data })}
        />
      </Grid>

      {/* ---------------- PAS-5 ---------------- */}
      <Grid item xs={12}>
        <PAS5
          currentData={currentPAS5Regulatory}
          setPercent={setPas5Percent}
          setProgress={setPas5Completed}
          saveStepData={(data) => saveStepData({ pas5: data })}
        />
      </Grid>

      {/* ---------------- GID ---------------- */}
      <Grid item xs={12}>
        <GID
          currentData={currentGIDRegulatory}
          setPercent={setGidPercent}
          setProgress={setGidCompleted}
          saveStepData={(data) => saveStepData({ gid: data })}
        />
      </Grid>

      {/* ---------------- INFORMATION MEMORANDUM ---------------- */}
      <Grid item xs={12}>
        <InformationMemorandum
          currentData={currentInformationMemorandumRegulatory}
          setPercent={setMemorandumPercent}
          setProgress={setMemorandumCompleted}
          saveStepData={(data) => saveStepData({ memorandum: data })}
        />
      </Grid>

      {/* ---------------- NEXT BUTTON ---------------- */}
      <Grid item xs={12}>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton variant="contained" onClick={handleNextClick}>
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}

RegulatoryFilingMain.propTypes = {
  currentRegulatory: PropTypes.object,
  saveStepData: PropTypes.func,
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
};
