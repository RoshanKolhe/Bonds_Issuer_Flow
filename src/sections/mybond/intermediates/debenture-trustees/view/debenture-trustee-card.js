import {
  Card,
  Typography,
  Checkbox,
  Stack,
  Grid,
  Tooltip,
  IconButton,
  Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useParams } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';

export default function DebentureTrusteeCardView({
  row,
  selected,
  onSelectRow,
  onView,
  onSendRequest,
  disabled

}) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { applicationId } = params;

  const downloadDocx = (blobData, filename) => {
    const url = window.URL.createObjectURL(
      new Blob([blobData], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
    );

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const onDownload = async (id) => {
    try {
      const contextKeys = [
        { contextKey: "id", value: "860d941d-4cc9-451e-8342-df5a981f042e" },
        { contextKey: "bondIssueApplicationId", value: applicationId },
        { contextKey: "identifierId", value: "474d694f-2a0e-41c2-b6d5-8cde2a7c5e71" },
        { contextKey: "roleValue", value: "company" },
        { contextKey: "addressType", value: "registered" },
        { contextKey: "trusteeProfilesId", value: "f2b9e823-228e-4941-ac43-360a1329c838" }
      ];

      const response = await axiosInstance.post(
        '/document-drafting/auto/generate-document',
        {
          documentValue: 'debenture-trust-appointment-letter',
          contextKeys,
        },
        {
          responseType: 'blob',
        }
      );

      downloadDocx(response.data, 'appointment-letter.docx');
      enqueueSnackbar('Document generated successfully', { variant: 'success' });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch data';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        sx={{
          p: 2,
          mb: 2,
          border: selected ? '2px solid #1877F2' : '1px solid #e0e0e0',
          transition: '0.2s',
        }}
      >
        {/* ACTION BAR */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 1,
            px: 0.5,
          }}
        >

          {selected ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Label variant="soft" color="success">
                Appointed
              </Label>
            </Box>
          ) : (<Checkbox
            checked={selected}
            disabled={disabled}
            onChange={
              () => {
                if (disabled) return;
                onSelectRow(row.id);
              }}
          />)}

          {/* RIGHT → Actions */}
          <Stack direction="row" spacing={0.5}>
            {selected && <Tooltip title="Appointment letter">
              <IconButton
                size="small"
                onClick={() => onDownload(row.id)}
              >
                <Iconify icon="mdi:download" width={18} />
              </IconButton>
            </Tooltip>}

            <Tooltip title="View">
              <IconButton size="small" sx={{ p: 0.5 }} onClick={onView}>
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>

            {!disabled && <Tooltip title="Send Request">
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                color="primary"
                onClick={onSendRequest}
              >
                <Iconify icon="mdi:email-send" />
              </IconButton>
            </Tooltip>}
          </Stack>
        </Stack>

        {/* INFORMATION */}
        <Stack spacing={0.8} sx={{ px: 0.5 }}>
          <Typography variant="h6" fontWeight={600}>
            {row.legalEntityName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Experience: {row.experience} yrs
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Regulatory: {row.regulatory}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Fees: {row.fees}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Response Time: {row.responseTime}
          </Typography>
        </Stack>
      </Card>
    </Grid>
  );
}
