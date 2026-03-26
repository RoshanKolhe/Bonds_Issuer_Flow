// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSignatorie } from 'src/api/signatories';
import UBONewEditForm from '../ubo-new-edit-form';

// ----------------------------------------------------------------------

export default function UBOEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { signatorie: currentSignatoy } = useGetSignatorie(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Ultimate Beneficiary Owners (UBO)',
            href: paths.dashboard.ubo.list,
          },
          {
            name: currentSignatoy?.fullName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 3 },
        }}
      />

      <UBONewEditForm currentUBO={currentSignatoy} />
    </Container>
  );
}
