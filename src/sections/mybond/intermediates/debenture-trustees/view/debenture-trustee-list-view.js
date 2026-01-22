import { useEffect, useState } from 'react';
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Button,
  Stack,
  Grid,
  Typography,
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom } from 'src/components/table';

import { DEBENTURE_TRUSTEES } from '../../intermediates-dummy-date';
import DebentureTrusteeTableToolbar from '../debenture-trustee-table-toolbar';
import DebentureTrusteeTableRow from '../debenture-trustee-table-row';
import { useParams, useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import DebentureTrusteeCardView from './debenture-trustee-card';
import Iconify from 'src/components/iconify';
import DebentureTrusteeViewForm from '../debenture-trustee-view-form';

// ------------------------------------------------------

const TABLE_HEAD = [
  { id: 'legalEntityName', label: 'Debenture Trustee' },
  { id: 'experience', label: 'Experience' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'fees', label: 'Fees' },
  { id: 'responseTime', label: 'Response Time' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

// ------------------------------------------------------

export default function DebentureTrusteeListView() {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const router = useRouter();
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [currentTrustee, setCurrentTrustee] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`debenturee_trustee_request_${applicationId}`);

    if (stored) {
      const parsed = JSON.parse(stored);
      setRequestSent(parsed.requestSent);
      setSelected(parsed.selected || []);
    }
  }, [applicationId]);


  const filteredData = DEBENTURE_TRUSTEES.filter((item) =>
    item.legalEntityName.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleSelectRow = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Select all
  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelected(filteredData.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleCompare = () => {
    router.push(`/dashboard/mybond/compare?type=trustee&ids=${selected.join(',')}`);
  };

  const isSendDisabled = selected.length === 0;

  const handleView = (id) => {
    const trustee = DEBENTURE_TRUSTEES.find((item) => item.id === id);
    setCurrentTrustee(trustee);
    setOpenView(true);
  };
  const handleCloseView = () => {
    setOpenView(false);
    setCurrentTrustee(null);
  };


  const handleSendRequest = async (id) => {
    try {
      const trusteeData = DEBENTURE_TRUSTEES.find((trustee) => trustee.id === id);

      const response = await axiosInstance.post(`/bonds-pre-issue/save-intermediaries/${applicationId}`, {
        debentureTrustee: trusteeData
      });

      if (response?.data?.success) {
        enqueueSnackbar('Request send successfully', { variant: 'success' });
        setRequestSent(true);
        localStorage.setItem(
          `debenturee_trustee_request_${applicationId}`,
          JSON.stringify({
            requestSent: true,
            selected,
          })
        );
      }
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to send request', { variant: 'error' });
      console.error('error while sending request to debenture trustee :', error);
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} disableGutters sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2 }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Iconify icon="solar:shield-check-bold" width={22} />
            Debenture Trustee's
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={selected.length < 2}
              sx={{ textTransform: 'none' }}
              onClick={handleCompare}
            >
              Compare
            </Button>

            <Button
              variant="contained"
              disabled={requestSent}
              onClick={() => handleSendRequest(selected[0])}
            >
              Send Request
            </Button>
          </Stack>
        </Stack>

        {/* <Card> */}
        {/* Search */}
        <Stack spacing={3}>
          <DebentureTrusteeTableToolbar filterName={filterName} onFilterName={setFilterName} />

          {/* Table */}
          {/* <TableContainer>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                rowCount={filteredData.length}
                numSelected={selected.length}
                onSelectAllRows={(checked) => handleSelectAllRows(checked)}
                isCheckedBoxVisible
              />

              <TableBody>
                {filteredData.map((row) => (
                  <DebentureTrusteeTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={handleSelectRow}
                    onView={() => handleView(row.id)}
                    onSendRequest={() => handleSendRequest(row.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer> */}
          {/* </Card> */}

          <Grid container spacing={3}>
            {filteredData.map((row) => (
              <DebentureTrusteeCardView
                key={row.id}
                row={row}
                selected={selected.includes(row.id)}
                onSelectRow={handleSelectRow}
                onView={() => handleView(row.id)}
                onSendRequest={() => handleSendRequest(row.id)}
                requestSent={requestSent}
              />
            ))}
          </Grid>
        </Stack>
      </Container>

      <DebentureTrusteeViewForm
        open={openView}
        data={currentTrustee}
        onClose={handleCloseView}
      />
    </>
  );
}
