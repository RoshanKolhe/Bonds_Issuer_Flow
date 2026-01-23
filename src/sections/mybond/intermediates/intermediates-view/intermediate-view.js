import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DebentureTrusteeListView from '../debenture-trustees/view/debenture-trustee-list-view';
import RtaListView from '../registrar-and-transfer-agents/view/rta-list-view';
import LeadManagerListView from '../lead-mangers/view/lead-manager-list-view';
import LegalAdvisorListView from '../legal-advisor/view/legal-advisor-list-view';
import ValuerListView from '../valuer/view/valuer-list-view';
import AllIntermediariesView from '../all-intermediaries/all-intermediaries';
import CreditRatingAgency from '../credit-rating-agency/credit-rating-agency';
import { useParams, useRouter, useSearchParams } from 'src/routes/hook';
import { Box, Button } from '@mui/material';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';

// tabs pages

// ----------------------------------------------------------------------

const TABS = [
  // {
  //   value: 'all',
  //   label: 'Appointed',
  //   icon: <Iconify icon="solar:layers-bold" width={22} />,
  // },
  {
    value: 'debenture_trustee',
    label: 'Debenture Trustee',
    icon: <Iconify icon="solar:shield-check-bold" width={22} />,
  },
  {
    value: 'rta',
    label: 'RTA',
    icon: <Iconify icon="solar:document-text-bold" width={22} />,
  },
  // {
  //   value: 'lead_manager',
  //   label: 'Lead Manager',
  //   icon: <Iconify icon="solar:user-star-bold" width={22} />,
  // },
  // {
  //   value: 'legal_advisor',
  //   label: 'Legal Advisor',
  //   icon: <Iconify icon="solar:scale-bold" width={22} />,
  // },
  {
    value: 'valuer',
    label: 'Valuer',
    icon: <Iconify icon="solar:calculator-bold" width={22} />,
  },
  {
    value: 'credit_rating',
    label: 'Credit Rating Agency',
    icon: <Iconify icon="solar:chart-bold" width={22} />,
  },
];

// ----------------------------------------------------------------------


export default function IntermediariesView({ setActiveStepId, percent }) {
  const settings = useSettingsContext();
  const param = useParams();
  const { applicationId } = param;


  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab');

  const [currentTab, setCurrentTab] = useState(tab || 'debenture_trustee');
  const { stepData, stepDataLoading } =
    useGetBondApplicationStepData(applicationId, 'intermediary_appointments_pending');

// console.log('stepDATAAAAA', stepData)

  function isIntermediaryLocked(stepData, type) {
    if (!stepData) return false;

    switch (type) {
      case 'debenture_trustee':
        return !!stepData.debentureTrustee;

      case 'rta':
        return !!stepData.registrarAndTransferAgent;

      case 'valuer':
        return !!stepData.valuer;

      case 'credit_rating':
        return (stepData.creditRatingAgency?.length ?? 0) > 0;

      default:
        return false;
    }
  }


  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({ search: '?tab=' + newValue });
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading="Intermediaries"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Intermediaries' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>
      {/* {currentTab === 'all' && <AllIntermediariesView setActiveStepId={setActiveStepId} setCurrentTab={setCurrentTab} percent={percent}/>} */}
      {currentTab === 'debenture_trustee' && (
        <DebentureTrusteeListView
          isLocked={isIntermediaryLocked(stepData, 'debenture_trustee')}
          stepData={stepData}
        />
      )}

      {currentTab === 'rta' && (
        <RtaListView
          isLocked={isIntermediaryLocked(stepData, 'rta')}
          stepData={stepData}
        />
      )}

      {currentTab === 'valuer' && (
        <ValuerListView
          isLocked={isIntermediaryLocked(stepData, 'valuer')}
          stepData={stepData}
        />
      )}

      {currentTab === 'credit_rating' && (
        <CreditRatingAgency
          isLocked={isIntermediaryLocked(stepData, 'credit_rating')}
          stepData={stepData}
        />
      )}


      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => setActiveStepId('fund_position')}>
          Next
        </Button>
      </Box>
    </Container>
  );
}
