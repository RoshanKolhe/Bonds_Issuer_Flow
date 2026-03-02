import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import BorrowingDetails from './borrowing-details';

export default function MainFile({ setActiveStepId, currentBorrowingDetails, percent }) {
  const [borrowingDetailsPercent, setBorrowingDetailsPercent] = useState(0);

  useEffect(() => {
    percent?.(borrowingDetailsPercent);
  }, [borrowingDetailsPercent, percent]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BorrowingDetails
          currentBorrowingDetails={currentBorrowingDetails}
          setPercent={setBorrowingDetailsPercent}
          setProgress={setActiveStepId}
        />
      </Grid>
    </Grid>
  );
}

MainFile.propTypes = {
  setActiveStepId: PropTypes.func,
  currentBorrowingDetails: PropTypes.array,
  percent: PropTypes.func,
};
