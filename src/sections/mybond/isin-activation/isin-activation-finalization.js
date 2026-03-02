import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  Grid,
  Typography,
  Box,
  Alert,
  Link,
  MenuItem,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { NewISINActivation } from 'src/forms-autofilled-script/issue-setup/newIssueSetup';
import { AutoFill } from 'src/forms-autofilled-script/autofill';
import InstructionModal from 'src/components/instruction-modal/instruction-modal';

/* ---------------- SCHEMA ---------------- */

const IsinSchema = Yup.object().shape({
  depository: Yup.string()
    .oneOf(['NSDL', 'CDSL'])
    .required('Depository is required'),

  isin: Yup.string()
    .required('ISIN is required')
    .matches(/^INE[0-9A-Z]{9}$/, 'Invalid ISIN format'),

  activationDate: Yup.date()
    .nullable()
    .required('Activation date is required'),

  isinLetter: Yup.mixed()
    .required('ISIN confirmation letter is required'),
});

/* ---------------- COMPONENT ---------------- */

export default function IsinActivationFinalization({
  currentIsin,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const [openInstructions, setOpenInstructions] = useState(false);

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    depository: '',
    isin: '',
    activationDate: null,
    isinLetter: null,
  };

  const methods = useForm({
    resolver: yupResolver(IsinSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset, setValue } = methods;

  const watched = watch([
    'depository',
    'isin',
    'activationDate',
    'isinLetter',
  ]);

  const instructionTitle = 'ISIN Activation Flow';
  const instructionItems = [
    "If needed, click 'Generate Activation Draft' and submit it to NSDL/CDSL as applicable.",
    'Once ISIN is activated by the depository, capture the final ISIN and activation date here.',
    'Upload the ISIN confirmation letter received from the depository.',
    'Save this step to continue with listing and issue launch activities.',
  ];

  /* ---------------- PERCENT LOGIC (BINARY) ---------------- */
  useEffect(() => {
    const done =
      watched[0] &&
      watched[1] &&
      watched[2] &&
      watched[3];

    setPercent?.(done ? 100 : 0);
    setProgress?.(done);
  }, [watched, setPercent, setProgress]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentIsin && Object.keys(currentIsin).length > 0) {
      reset({
        ...defaultValues,
        ...currentIsin,
        activationDate: currentIsin.activationDate
          ? new Date(currentIsin.activationDate)
          : null,
      });

      setPercent?.(100);
      setProgress?.(true);
    }
  }, [currentIsin, reset, setPercent, setProgress]);

  const handleAutoFill = () => {
    const data = NewISINActivation();
    AutoFill({ setValue, fields: data });
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.({
      depository: data.depository,
      isin: data.isin,
      activationDate: data.activationDate,
      isinLetter: data.isinLetter,
    });

    setPercent?.(100);
    setProgress?.(true);

    enqueueSnackbar('ISIN Activation saved successfully', {
      variant: 'success',
    });
  };

  const handleGenerateDraft = () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" color='primary' fontWeight='bold' mb={2}>
          ISIN Activation & Finalization
        </Typography>

        {/* INFO MESSAGE */}
        <Alert severity="info" sx={{ mb: 3 }}>
          ISIN activation enables the allotted ISIN to be used for allotment,
          demat credit and listing of the bonds. Activation is permitted only
          after execution of debenture trust deed and security documents.{' '}
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

        <Card
          variant="outlined"
          sx={{ mb: 3, p: 2, backgroundColor: '#fafafa' }}
        >
          <Typography fontWeight={600} mb={1}>
            Generated Drafts
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>ISIN Activation Request Letter</Typography>
            <Button variant="outlined" onClick={handleGenerateDraft}>
              Generate Activation Draft
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary">
            This draft is generated for submission by the Issuer / RTA to the
            depository for ISIN activation.
          </Typography>
        </Card>


        <Grid container spacing={3}>
          {/* DEPOSITORY */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="depository"
              label="Depository"
              select
              fullWidth
            >
              <MenuItem value="NSDL">NSDL</MenuItem>
              <MenuItem value="CDSL">CDSL</MenuItem>
            </RHFTextField>
          </Grid>

          {/* ISIN */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="isin"
              label="ISIN"
              fullWidth
            />
          </Grid>

          {/* ACTIVATION DATE */}
          <Grid item xs={12} md={4}>
            <Controller
              name="activationDate"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Activation Date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* ISIN LETTER */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="isinLetter"
              label="Upload ISIN Confirmation Letter"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="isinLetter" />
          </Grid>

          {/* ACTION */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant='contained' onClick={() => handleAutoFill()}>Autofill</Button>
              <LoadingButton
                type="submit"
                variant="contained"
              >
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <InstructionModal
        open={openInstructions}
        onClose={() => setOpenInstructions(false)}
        title={instructionTitle}
        instructions={instructionItems}
      />
    </FormProvider>
  );
}
