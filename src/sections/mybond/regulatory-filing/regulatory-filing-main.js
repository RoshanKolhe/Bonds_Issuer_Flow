import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import { useGetBondRegulatoryFilingDocuments } from 'src/api/bond-regulatory-filing';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useParams } from 'src/routes/hook';
import RegulatoryFilingCard from './regulatory-filing-card';

export default function RegulatoryFilingMain({
  percent,
  setActiveStepId,
}) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const { documents, documentsLoading } = useGetBondRegulatoryFilingDocuments(applicationId);
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'regulatory_filings');
  const [documentValues, setDocumentValues] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [documentCompletionStatus, setDocumentCompletionStatus] = useState({});

  /* ---------------- TOTAL PERCENT ---------------- */
  useEffect(() => {

    const totalDocs = Object.keys(documentCompletionStatus).length;

    if (totalDocs === 0) return;

    const completedDocs = Object.values(documentCompletionStatus)
      .filter(status => status === true).length;

    const percentValue = Math.round(
      (completedDocs / totalDocs) * 100
    );

    percent?.(percentValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentCompletionStatus]);

  /* ---------------- NEXT ---------------- */
  const handleNextClick = () => {

    const totalDocs = Object.keys(documentCompletionStatus).length;

    if (!totalDocs) {
      enqueueSnackbar('No documents found', { variant: 'warning' });
      return;
    }

    const incompleteDocs = Object.values(documentCompletionStatus)
      .filter(status => status === false);

    if (incompleteDocs.length > 0) {
      enqueueSnackbar(
        'Please upload all required documents before continuing',
        { variant: 'warning' }
      );
      return;
    }

    // All done ✅
    setActiveStepId?.('trustee_due_diligence');
  };

  useEffect(() => {
    if (documents && !documentsLoading) {
      setDocumentList(documents);
      if (documents.length > 0) {
        const completetionStatus = documents.reduce((acc, doc) => {
          acc[doc.id] = false;
          return acc;
        }, {});

        setDocumentCompletionStatus(completetionStatus);
      }
    }
  }, [documents, documentsLoading, setDocumentCompletionStatus]);

  useEffect(() => {
    if(stepData && !stepDataLoading){
      setDocumentValues(stepData);
    }
  }, [stepData, stepDataLoading]);

  console.log('documentValues', documentValues);

  return (
    <Grid container spacing={3}>
      {/* ---------------- Documents ---------------- */}
      {
        documentList.map((doc) => (
          <Grid item xs={12}>
            <RegulatoryFilingCard
              document={doc}
              setStatus={() => setDocumentCompletionStatus((prev) => ({ ...prev, [doc.id]: true }))}
              currentValue={documentValues.find((innerDoc) => innerDoc?.documentId === doc.id)?.document || null}
            />
          </Grid>
        ))
      }

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
