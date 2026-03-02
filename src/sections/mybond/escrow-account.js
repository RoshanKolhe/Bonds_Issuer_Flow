import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  Alert,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import InstructionModal from 'src/components/instruction-modal/instruction-modal';
import { NewEscrowAccount } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';

/* ---------------- SCHEMA ---------------- */

const Schema = Yup.object().shape({
  bankName: Yup.string().required('Bank name is required'),
  accountNumber: Yup.string().required('Account number is required'),
  ifsc: Yup.string().required('IFSC is required'),
});

/* ---------------- COMPONENT ---------------- */

export default function EscrowAccountConfirmation({
  currentEscrow,
  saveStepData,
  percent,
  setActiveStepId,
}) {
  const [openInstructions, setOpenInstructions] = useState(false);
  const [status, setStatus] = useState(
    currentEscrow?.status || 'NOT_CREATED'
  );
  const [loading, setLoading] = useState(false);

  const instructionTitle = 'Escrow Account Flow';
  const instructionItems = [
    "Click 'Create Escrow Account' to initiate escrow setup through Dcentro.",
    'Wait until escrow status becomes ACTIVE and confirm bank/account details are populated.',
    'Escrow must be active before proceeding to ISIN Activation.',
    "If creation fails, retry and verify integration inputs before moving ahead.",
  ];

  const defaultValues = {
    bankName: '',
    accountNumber: '',
    ifsc: '',
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { reset } = methods;

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (currentEscrow && Object.keys(currentEscrow).length > 0) {
      reset({
        bankName: currentEscrow.bankName,
        accountNumber: currentEscrow.accountNumber,
        ifsc: currentEscrow.ifsc,
      });

      setStatus(currentEscrow.status);
      percent?.(currentEscrow.status === 'ACTIVE' ? 100 : 0);
    }
  }, [currentEscrow, reset, percent]);

  /* ---------------- CREATE ESCROW ---------------- */

  const handleCreateEscrow = async () => {
    try {
      setLoading(true);
      setStatus('PENDING');

      // 🔗 CALL DCENTRO API HERE
      // const response = await createEscrowViaDcentro(issueId)

      // MOCK RESPONSE (replace later)
      const response = {
        bankName: 'Axis Bank',
        accountNumber: '917203456789',
        ifsc: 'UTIB0000123',
        referenceId: 'DCENTRO_ESCROW_123',
      };

      reset({
        bankName: response.bankName,
        accountNumber: response.accountNumber,
        ifsc: response.ifsc,
      });

      setStatus('ACTIVE');
      percent?.(100);

      saveStepData?.({
        provider: 'DCENTRO',
        ...response,
        status: 'ACTIVE',
      });

      enqueueSnackbar('Escrow account created successfully', {
        variant: 'success',
      });
    } catch (error) {
      setStatus('FAILED');
      enqueueSnackbar('Failed to create escrow account', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    const data = NewEscrowAccount();

    reset({
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
    });

    setStatus(data.status);
    percent?.(100);

    saveStepData?.({
      provider: data.provider,
      referenceId: data.referenceId,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      status: data.status,
    });
  };

  /* ---------------- NEXT ---------------- */

  const handleNext = () => {
    if (status !== 'ACTIVE') {
      enqueueSnackbar('Escrow account must be active before proceeding', {
        variant: 'warning',
      });
      return;
    }

    setActiveStepId?.('isin_activation');
  };

  return (
    <FormProvider methods={methods}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Escrow Account Creation & Confirmation
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Escrow account is created via Dcentro and is mandatory before ISIN
            activation and opening the issue for subscription.{' '}
            <Link
              component="button"
              type="button"
              underline="always"
              onClick={() => setOpenInstructions(true)}
              sx={{ fontWeight: 600 }}
            >
              View flow instructions
            </Link>
          </Alert>

          {/* STATUS */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight={600} mb={1}>
              Escrow Status
            </Typography>
            <Label
              color={
                status === 'ACTIVE'
                  ? 'success'
                  : status === 'PENDING'
                  ? 'warning'
                  : status === 'FAILED'
                  ? 'error'
                  : 'default'
              }
            >{status}</Label>
          </Box>

          {/* DETAILS */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="bankName"
                label="Bank Name"
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="accountNumber"
                label="Escrow Account Number"
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="ifsc"
                label="IFSC Code"
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* ACTIONS */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'end',
              gap: 2,
            }}
          >
            {status !== 'ACTIVE' ? <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleCreateEscrow}
            >
              Create Escrow Account
            </LoadingButton> : 

            <LoadingButton
              variant="soft"
              color="success"
              onClick={handleNext}
            >
              Continue to ISIN Activation
            </LoadingButton>}
          </Box>
        </Card>
      </Container>

      <InstructionModal
        open={openInstructions}
        onClose={() => setOpenInstructions(false)}
        title={instructionTitle}
        instructions={instructionItems}
      />
    </FormProvider>
  );
}
