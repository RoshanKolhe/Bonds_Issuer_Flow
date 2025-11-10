import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  useTheme,
  FormHelperText,
  LinearProgress,
  Grid,
  Stack,
} from '@mui/material';
import { Icon } from '@iconify/react';

function UploadBox({
  label,
  icon,
  color,
  acceptedTypes,
  maxSizeMB,
  onChange,
  value,
  error,
  helperText,
  onProgressChange,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ---- Safe file processing ----
  const processFile = (file) => {
    if (!file) return;

    setErrorMessage('');
    setUploadStatus('uploading');
    setProgress(0);

    const fileType = file?.type ? file.type.split('/')[1] : 'unknown';
    const allowedTypes = acceptedTypes ? acceptedTypes.split(',') : [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    let hasError = false;
    let tempErrorMsg = '';

    // ✅ Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
      hasError = true;
      tempErrorMsg = `Invalid file type. Allowed: ${acceptedTypes}`;
    }

    // ✅ Validate size
    if (file.size > maxSizeBytes) {
      hasError = true;
      tempErrorMsg = `File size exceeds ${maxSizeMB}MB limit.`;
    }

    // ✅ Simulate upload or error progress bar animation
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      onProgressChange?.(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);

        if (hasError) {
          setUploadStatus('error');
          setErrorMessage(tempErrorMsg);
          onChange(null);
        } else {
          setUploadStatus('success');
          setErrorMessage('');
          onChange(file);
        }
      }
    }, 120);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleClick = () => fileInputRef.current?.click();

  const getBackgroundColor = () => {
    if (uploadStatus === 'error') return '#FFEBEE'; // light red
    if (uploadStatus === 'success') return '#E1FFEC'; // green
    if (isDragging) return '#CFE4FF';
    return '#F5F7FA';
  };

  const uploadContent = (
    <Box
      sx={{
        textAlign: 'center',
        height: '100%',
        borderRadius: 0,
        backgroundColor: getBackgroundColor(),
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={acceptedTypes}
        style={{ display: 'none' }}
      />

      {/* ✅ Show this when no file selected */}
      {!value ? (
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 1.5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Icon icon="mdi:cloud-upload-outline" color={color} width="24" height="24" />
          <Box>
            <Typography
              component="span"
              variant="body2"
              color="primary"
              fontWeight={500}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Select file / Drop files here to upload
            </Typography>{' '}
            <Typography
              variant="caption"
              color="primary"
              display="block"
              mt={0.5}
              fontStyle="italic"
            >
              Maximum size: {maxSizeMB}MB / Supported: {acceptedTypes}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Grid container sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <Grid item md={12} sx={{ pb: '10px' }}>
            <Stack
              justifyContent="space-between"
              sx={{
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }}>
                <Grid xs={12} md={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon
                      icon={
                        uploadStatus === 'error'
                          ? 'mdi:alert-circle-outline'
                          : 'mdi:cloud-check-outline'
                      }
                      color={uploadStatus === 'error' ? '#d32f2f' : '#2e7d32'}
                      width="24"
                      height="24"
                    />
                    <Typography color={uploadStatus === 'error' ? 'error.main' : 'text.primary'}>
                      {uploadStatus === 'error'
                        ? 'Upload Failed'
                        : uploadStatus === 'success'
                        ? 'Uploaded'
                        : 'Upload'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography variant="body2" fontWeight={500}>
                    {value.name}
                  </Typography>
                </Grid>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={12}>
            <LinearProgress
              variant="determinate"
              value={progress}
              fullWidth
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: uploadStatus === 'error' ? '#d32f2f' : '#2e7d32',
                },
              }}
            />
            <Typography
              variant="caption"
              color={uploadStatus === 'error' ? 'error.main' : 'primary.main'}
              display="block"
              mt={0.5}
            >
              {uploadStatus === 'error'
                ? errorMessage
                : progress < 100
                ? `${progress}% Uploading...`
                : 'Upload Complete (100%)'}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              display="block"
              mt={0.5}
              fontStyle="italic"
              sx={{
                display: 'flex',
                mt: 0.5,
                fontStyle: 'italic',
                justifyContent: 'start',
              }}
            >
              Maximum size: {maxSizeMB}MB / Supported: {acceptedTypes}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  // --- Mobile layout ---
  if (isMobile) {
    return (
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          p: 3,
          border: 2,
          borderColor: '#b5b5b5ff',
          borderRadius: 2,
          cursor: 'pointer',
          width: '100%',
        }}
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon={icon} color={color} width="32" height="32" />
          <Typography variant="subtitle1" fontWeight={500}>
            {label}
          </Typography>
        </Box>
        {uploadContent}
      </Card>
    );
  }

  // --- Desktop layout (same structure, progress bar in same box) ---
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* Left Label */}
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 4,
          border: 2,
          borderRight: 'none',
          borderColor: '#b5b5b5ff',
          borderRadius: 0,
          height: 110,
        }}
      >
        <Icon icon={icon} color={color} width="32" height="32" />
        <Typography variant="subtitle1" fontWeight={500}>
          {label}
        </Typography>
      </Card>

      {/* Right Upload Area */}
      <Box
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          height: 110,
          border: 2,
          borderColor:
            uploadStatus === 'error'
              ? '#d32f2f'
              : uploadStatus === 'success'
              ? '#2e7d32'
              : '#b5b5b5ff',
          cursor: 'pointer',
        }}
      >
        {uploadContent}
      </Box>
    </Box>
  );
}

UploadBox.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  acceptedTypes: PropTypes.string,
  maxSizeMB: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.any,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

// --- Hook Form Integrated Wrapper ---
export default function RHFFileUploadBox({ name, ...props }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          {...props}
          value={field.value}
          onChange={(file) => {
            field.onChange(file);
            // store upload completion status as separate field
            if (file && file.progress === 100) {
              setValue(`${name}_status`, 'success');
            } else {
              setValue(`${name}_status`, 'incomplete');
            }
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}

RHFFileUploadBox.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.string,
};
