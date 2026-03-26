// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSignatorie } from 'src/api/signatories';
import UBOViewDetailsForm from '../ubo-view-details-form';

// ----------------------------------------------------------------------

export default function UBODetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { signatorie } = useGetSignatorie(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ultimate Beneficiary Owners (UBO)', href: paths.dashboard.ubo.list },
          { name: signatorie?.fullName || '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UBOViewDetailsForm currentUBO={null} />
    </Container>
  );
}
