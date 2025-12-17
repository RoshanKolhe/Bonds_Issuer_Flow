import { useState } from 'react';
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tab,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom } from 'src/components/table';

import { DEBENTURE_TRUSTEES } from '../../intermediates-dummy-date';
import LeadManagerTableToolbar from '../lead-manager-table-toolbar';
import LeadManagerTableRow from '../lead-manager-table-row';

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

export default function LeadManagerListView() {
  const settings = useSettingsContext();
  const [tab, setTab] = useState('debenture_trustee');
  const [filterName, setFilterName] = useState('');

  const filteredData = DEBENTURE_TRUSTEES.filter((item) =>
    item.legalEntityName.toLowerCase().includes(filterName.toLowerCase())
  );

  const handleView = (id) => {
    console.log('View Debenture Trustee:', id);
  };

  const handleSendRequest = (id) => {
    console.log('Send Request to Debenture Trustee:', id);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>

      <Card>
        {/* Search */}
        <LeadManagerTableToolbar
          filterName={filterName}
          onFilterName={setFilterName}
        />

        {/* Table */}
        <TableContainer>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {filteredData.map((row) => (
                  <LeadManagerTableRow
                    key={row.id}
                    row={row}
                    onView={() => handleView(row.id)}
                    onSendRequest={() => handleSendRequest(row.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}
