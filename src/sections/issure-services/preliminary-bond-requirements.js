import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  Card,
  Typography,
  TextField,
  Grid,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Icon } from '@iconify/react';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function PreliminaryBondRequirements({ currentFund }) {
  const [security, setSecurity] = useState('secured');
  const [investorCategory, setInvestorCategory] = useState('retail');
  const [paymentCycle, setPaymentCycle] = useState('monthly');
  const [issueAmount, setIssueAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [roi, setRoi] = useState('');

  // Collateral Asset Verification State
  const [collateralType, setCollateralType] = useState('');
  const [chargeType, setChargeType] = useState('');
  const [assetDescription, setAssetDescription] = useState('Land Parcel At Pune SEZ');
  const [estimatedValue, setEstimatedValue] = useState('50,00,00,000');
  const [valuationDate, setValuationDate] = useState('18/10/2025');
  const [ownershipType, setOwnershipType] = useState('Owned / Leased / Pledged');
  const [securityDocRef, setSecurityDocRef] = useState('4576/2024');
  const [trustName, setTrustName] = useState('Axis Trustee Service');
  const [remarks, setRemarks] = useState('Collateral For Series -A Secured Bonds');

  const FundSchema = Yup.object().shape({
    creditRatingLetter: Yup.mixed().required('Credit Rating Letter is required'),
    valuationReport: Yup.mixed().required('Valuation Report is required'),

    issueAmount: Yup.number()
      .typeError('Issue Amount is required')
      .positive('Must be positive')
      .required('Issue Amount is required'),
    tenure: Yup.number()
      .typeError('Tenure must be a number')
      .positive('Must be positive')
      .required('Tenure is required'),
    roi: Yup.number()
      .typeError('ROI must be a number')
      .min(0, 'Must be at least 0%')
      .max(100, 'Cannot exceed 100%')
      .required('ROI is required'),

    collateralType: Yup.string().required('Collateral Type is required'),
    chargeType: Yup.string().required('Charge Type is required'),
    assetDescription: Yup.string().required('Asset Description is required'),
    estimatedValue: Yup.string().required('Estimated Value is required'),
    securityDocRef: Yup.string().required('Security Document Ref is required'),
    valuationDate: Yup.string().required('Valuation Date is required'),
    ownershipType: Yup.string().required('Ownership Type is required'),
    securityDocRef: Yup.string().required('Security Document Ref is required'),
    trustName: Yup.string().required('Trust Name is required'),
    remarks: Yup.string().required('Remarks are required'),
  });

  const defaultValues = useMemo(
    () => ({
      creditRatingLetter: currentFund?.creditRatingLetter
        ? {
            fileUrl: currentFund.creditRatingLetter.fileUrl,
            preview: currentFund.creditRatingLetter.fileUrl,
          }
        : { fileUrl: '', preview: '' },
      valuationReport: { fileUrl: '', preview: '' },
      issueAmount: '',
      tenure: '',
      roi: '',
      collateralType: '',
      chargeType: '',
      assetDescription: '',
      estimatedValue: '',
      valuationDate: '',
      ownershipType: '',
      securityDocRef: '',
      trustName: '',
      remarks: '',
    }),
    [currentFund]
  );

  const methods = useForm({
    resolver: yupResolver(FundSchema),
    defaultValues,
  });
  console.log('🟣 React Hook Form methods:', methods);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log('✅ Submitted Data:', {
      ...data,
      security,
      investorCategory,
      paymentCycle,
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          minHeight: '100vh',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            mt: 5,
            p: 5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
                Preliminary Bond Requirements
              </Typography>

              {/* Issue Amount */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Issue Amount (₹)
                  <Tooltip title="Whether the bond is backed by collateral or not" arrow>
                    <Icon
                      icon="mdi:information-outline"
                      width={18}
                      height={18}
                      style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                    />
                  </Tooltip>
                </Typography>
                <RHFTextField
                  name="issueAmount"
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="₹ 500,00,000"
                  variant="outlined"
                  label="Issue Amount"
                />
              </Box>

              {/* Security */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Security
                  <Tooltip
                    title="Decide on an investment structure - whether by equity investors or any lenders"
                    arrow
                  >
                    <Icon
                      icon="mdi:information-outline"
                      width={18}
                      height={18}
                      style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                    />
                  </Tooltip>
                </Typography>
                <ToggleButtonGroup
                  value={security}
                  exclusive
                  onChange={(e, val) => val && setSecurity(val)}
                  fullWidth
                >
                  {['Secured', 'Unsecured'].map((option) => (
                    <ToggleButton key={option} value={option.toLowerCase()}>
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Tenure */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Tenure
                  <Tooltip title="Enter tenure for your bond (e.g., 5 for 5 years)" arrow>
                    <Icon
                      icon="mdi:information-outline"
                      width={18}
                      height={18}
                      style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                    />
                  </Tooltip>
                </Typography>
                <RHFTextField
                  name="tenure"
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="3.5"
                  variant="outlined"
                />
              </Box>

              {/* Preferred ROI */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Preferred ROI (%)
                </Typography>
                <RHFTextField
                  name="roi"
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="8.5"
                  variant="outlined"
                />
              </Box>

              {/* Investor Category */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Preferred Investor Category
                  <Tooltip title="Select the type of investors you need to target" arrow>
                    <Icon
                      icon="mdi:information-outline"
                      width={18}
                      height={18}
                      style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                    />
                  </Tooltip>
                </Typography>
                <ToggleButtonGroup
                  value={investorCategory}
                  exclusive
                  onChange={(e, val) => val && setInvestorCategory(val)}
                  fullWidth
                  sx={{ flexWrap: 'wrap', border: '1px #C0C0C0' }}
                >
                  {[
                    { label: 'Retail', value: 'retail' },
                    { label: 'QIB', value: 'qib' },
                    { label: 'HNIs', value: 'hnwi' },
                    { label: 'Mutual Funds', value: 'mutual' },
                  ].map((option) => (
                    <ToggleButton
                      key={option.value}
                      value={option.value}
                      sx={{ flex: '1 0 48%', m: 0.5 }}
                    >
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Payment Cycle */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Preferred Interest Payment Cycle
                </Typography>
                <ToggleButtonGroup
                  value={paymentCycle}
                  exclusive
                  onChange={(e, val) => val && setPaymentCycle(val)}
                  fullWidth
                >
                  {['Monthly', 'Quarterly', 'Annually'].map((option) => (
                    <ToggleButton key={option} value={option.toLowerCase()}>
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src="/assets/images/roi/preliminary.png"
                alt="Bond Illustration"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </Grid>
          </Grid>
        </Card>

        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 5,
            mt: '50px',
          }}
        >
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
            Collateral & Asset Verification
          </Typography>

          <Grid container spacing={3}>
            {/* Collateral Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Collateral Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <FormControl fullWidth>
                    <RHFSelect name="collateralType" label="Collateral Type" defaultValue="">
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="property">Property</MenuItem>
                      <MenuItem value="equipment">Equipment</MenuItem>
                      <MenuItem value="inventory">Inventory</MenuItem>
                    </RHFSelect>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Charge Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Charge Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <FormControl fullWidth>
                    <RHFSelect name="chargeType" label="Charge Type" defaultValue="">
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="first">First Charge</MenuItem>
                      <MenuItem value="second">Second Charge</MenuItem>
                      <MenuItem value="pari-passu">Pari Passu</MenuItem>
                    </RHFSelect>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Asset Description */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Asset Description
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="assetDescription" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Security Document File */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Security Document
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={
                      <Icon
                        icon="mdi:upload"
                        width={18}
                        height={18}
                        style={{ cursor: 'pointer', color: '#000' }}
                      />
                    }
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    Choose File / Drop files here
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block', color: '#1976d2', fontStyle: 'italic' }}
                  >
                    Maximum size: 10MB / Supported: PDF, XLS, DOCX, JPEG
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Estimated Value */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Estimated Value
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="estimatedValue" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Security Document Ref */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Security Document Ref
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="securityDocRef" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Valuation Date */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Valuation Date
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="valuationDate" fullWidth placeholder="DD/MM/YYYY" />
                </Grid>
              </Grid>
            </Grid>

            {/* Trust Name */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Trust Name
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="trustName" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Ownership Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Ownership Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="ownershipType" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Remarks
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name="remarks" fullWidth />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <Typography sx={{ pb: '20px' }}>Asset Cover Certificate</Typography>
        <RHFFileUploadBox
          name="creditRatingLetter"
          label="Upload Credit Rating Letter"
          icon="mdi:file-document-outline"
        />
        <Typography sx={{ py: '20px' }}>Valuation Report</Typography>
        <RHFFileUploadBox
          name="creditRatingLetter"
          label="Upload Credit Rating Letter"
          icon="mdi:file-document-outline"
        />
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent="flex-end"
        sx={{ maxWidth: 400, ml: 'auto', mt: 5 }}
      >
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" color="inherit">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          >
            Calculate ROI
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
