import React, { useRef, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Card,
  Button,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFUpload } from 'src/components/hook-form'; // ✅ your custom hook-form upload component
import { Icon } from '@iconify/react';
import FileUploadBox from 'src/components/custom-file-upload/file-upload';
import PropTypes from 'prop-types';

export default function FundPositionForm() {
  const [cashBalance, setCashBalance] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [hasCredit, setHasCredit] = useState('yes');
  const [selectedAgency, setSelectedAgency] = useState('agency2');
  const [selectedRating, setSelectedRating] = useState('A+');
  const [vault, setVault] = useState('');

  const methods = useForm({
    defaultValues: {
      creditRatingLetter: null,
    },
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  const agencies = [
    'CRISIL',
    'ICRA',
    'INDIA RATINGS & RESEARCH',
    'Rating Agency 4',
    'Rating Agency 5',
    'Rating Agency 6',
  ];

  const ratings = [
    { value: 'A+', label: 'A+' },
    { value: 'AAA', label: 'AAA' },
    { value: 'AA+', label: 'AA+' },
    { value: 'AA-', label: 'AA-' },
    { value: 'AA', label: 'AA' },
    { value: 'A-', label: 'A-' },
    { value: 'BBB+', label: 'BBB+' },
    { value: 'UNRATED', label: 'UNRATED' },
  ];

  const dummyCards = [
    {
      image: '/assets/images/roi/crisil.png',
      label: 'CRISIL',
    },
    {
      image: '/assets/images/roi/ICRA.png',
      label: 'ICRA',
    },
    {
      image: '/assets/images/roi/india-ratings.png',
      label: 'India Ratings',
    },
    {
      image: '/assets/images/roi/ICRA.png',
      label: 'Rating Agency 4',
    },
    {
      image: '/assets/images/roi/ICRA.png',
      label: 'Rating Agency 5',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 1. Fund Position Section */}
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              mb: 4,
            }}
          >
            <Typography variant="h3" sx={{ color: '#1565c0', fontWeight: 600 }}>
              Fund Position
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Add and manage your borrowing information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cash Balance as on Date"
                  placeholder="Enter Cash Balance"
                  value={cashBalance}
                  onChange={(e) => setCashBalance(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bank Balance as on Date"
                  placeholder="Enter Bank Balance"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Card>

          {/* 2. Credit Rating Question */}
          <Box sx={{ mb: '20px' }}>
            <FormControl>
              <FormLabel
                sx={{
                  fontWeight: 500,
                  color: 'black',
                  '&.Mui-focused': { color: 'black' },
                }}
              >
                Do You Already Have a Credit Rating? <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <RadioGroup
                row
                value={hasCredit}
                onChange={(e) => setHasCredit(e.target.value)}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="yes"
                  control={
                    <Radio
                      sx={{
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  }
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={
                    <Radio
                      sx={{
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  }
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* 3. Conditional rendering */}
          {hasCredit === 'yes' ? (
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                mb: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Credit Ratings Available
              </Typography>

              <Grid container spacing={4}>
                {/* Agency Selection */}
                <Grid item xs={12} md={4}>
                  <Select
                    value={selectedAgency}
                    onChange={(e) => setSelectedAgency(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Select the appropriate rating agency</MenuItem>
                    {agencies.map((agency, idx) => (
                      <MenuItem key={idx} value={`agency${idx + 1}`}>
                        {agency}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Rating Selection */}
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Rating
                  </Typography>
                  <Grid container spacing={2}>
                    {ratings.map((rating) => (
                      <Grid item xs={4} key={rating.value}>
                        <FormControlLabel
                          value={rating.value}
                          control={
                            <Radio
                              checked={selectedRating === rating.value}
                              onChange={(e) => setSelectedRating(e.target.value)}
                              sx={{
                                color: '#1976d2', // default (unchecked)
                                '&.Mui-checked': {
                                  color: '#1976d2', // checked
                                },
                              }}
                            />
                          }
                          label={rating.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          ) : (
            <Box
              sx={{
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                mb: 4,
                scrollbarWidth: { xs: 'none', md: 'thin' },
                msOverflowStyle: { xs: 'none', md: 'auto' },

                '&::-webkit-scrollbar': {
                  height: 8,
                  display: { xs: 'none', md: 'block' },
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ccc',
                  borderRadius: 4,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: 'fit-content',
                }}
              >
                {dummyCards.map((card, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: 250, // Fixed width for each card
                      flexShrink: 0, // Prevent cards from shrinking
                    }}
                  >
                    <CreditRatingCard
                      imageSrc={card.image}
                      title={card.label}
                      onClick={() => alert(`You clicked ${card.label}`)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <TextField
            label="Vault Till"
            placeholder="Enter Vault Till Data"
            value={vault}
            onChange={(e) => setVault(e.target.value)}
            fullWidth
            size="small"
            sx={{ pb: '30px' }}
          />

          <TextField
            label="Additional rating"
            placeholder="Enter Additional rating"
            value={vault}
            onChange={(e) => setVault(e.target.value)}
            fullWidth
            size="small"
            sx={{ pb: '30px' }}
          />

          {/* 5. Credit Rating Letter Upload */}
          <FileUploadBox />

          {/* 6. Action Buttons */}
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
                Next
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
}

const CreditRatingCard = ({ imageSrc, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      mb: '20px',
      borderRadius: 0,
      height: 150,
      cursor: 'pointer',
      minWidth: 250, // ensure consistent card width
    }}
  >
    <Box
      sx={{
        height: 150,
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: 1,
      }}
    >
      <img
        src={imageSrc}
        alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
  </Box>
);
