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
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ---- Safe file processing ----
  const processFile = (file) => {
    if (!file) return;

    const fileType = file?.type ? file.type.split('/')[1] : 'unknown';
    const allowedTypes = acceptedTypes ? acceptedTypes.split(',') : [];

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
      alert(`Invalid file type. Allowed types: ${acceptedTypes}`);
      return;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    // Simulate upload progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 10;
      });
    }, 150);

    onChange(file);
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

  const uploadContent = (
    <Box
      sx={{
        textAlign: 'center',
        height: '100%',
        borderRadius: 0,
        backgroundColor:
          progress === 100
            ? '#E1FFEC' // ✅ after upload complete
            : isDragging
            ? '#E1FFEC' // optional: keep same greenish color when dragging
            : '#CFE4FF',
        cursor: 'pointer',
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
                  <Stack direction={'row'}>
                    <Icon icon="mdi:cloud-check-outline" color="#2e7d32" width="24" height="24" />
                    <Typography sx={{ pl: '10px' }}>Uploaded</Typography>
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
            <LinearProgress variant="determinate" value={progress} fullWidth />
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                display: 'flex',
                mt: 0.5,
                fontStyle: 'italic',
                justifyContent: 'start',
              }}
            >
              {progress < 100 ? `${progress}% Uploading...` : 'Upload Complete (100%)'}
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
          borderColor: progress === 100 ? '#E1FFEC' : isDragging ? '#CFE4FF' : '#CFE4FF',
          borderRadius: 0,
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
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          {...props}
          value={field.value}
          onChange={(file) => field.onChange(file)}
          error={!!error}
        />
      )}
    />
  );
}

RHFFileUploadBox.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.string,
};
