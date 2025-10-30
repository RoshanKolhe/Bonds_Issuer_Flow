import React, { useState, useRef } from 'react';
import { Box, Card, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Icon } from '@iconify/react';

export default function FileUploadBox({
  label = 'Upload File',
  icon = 'mdi:file-document-outline',
  color = '#1976d2',
  acceptedTypes = '.pdf,.xls,.xlsx,.jpg,.jpeg,.docx',
  maxSizeMB = 10,
  onFileSelect,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // mobile breakpoint

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const uploadContent = (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        height: '100%',
        borderRadius: 0,
        backgroundColor: isDragging ? '#CFE4FF' : '#CFE4FF',
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // column for mobile, row for desktop
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: 1.5,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Icon icon="mdi:cloud-upload-outline" color={color} width="24" height="24" />

        <Box>
          <Typography variant="body2">
            <Typography
              component="span"
              variant="body2"
              color="primary"
              fontWeight={500}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Select file...
            </Typography>{' '}
            Drop files here to upload
          </Typography>
          <Typography variant="caption" color="primary" display="block" mt={0.5} fontStyle="italic">
            Maximum allowed file size is {maxSizeMB}MB / Supported types: {acceptedTypes}
          </Typography>
        </Box>
      </Box>

      {selectedFile && (
        <Card
          sx={{
            mt: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'grey.300',
            backgroundColor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            <strong>Selected file:</strong> {selectedFile.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </Typography>
        </Card>
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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

  // --- Desktop layout ---
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          height: 110,
          border: 2,
          borderColor: isDragging ? '#CFE4FF' : '#CFE4FF',
          borderRadius: 0,
          cursor: 'pointer',
        }}
      >
        {uploadContent}
      </Box>
    </Box>
  );
}
