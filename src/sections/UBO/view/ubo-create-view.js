// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import UBONewEditForm from '../ubo-new-edit-form';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function UBOCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction='column' spacing={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <CustomBreadcrumbs
          heading="Create a New Ultimate Beneficiary Owner (UBO)"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Ultimate Beneficiary Owners (UBO)',
              href: paths.dashboard.ubo.list,
            },
            { name: 'New UBO' },
          ]}
        />

        <Typography sx={{ maxWidth: 800 }} variant="body1" color="text.secondary" gutterBottom>
          Define the natural person(s) who ultimatly own or control the legal entity to comply with global anti-money laundering regulations.
        </Typography>
      </Stack>

      <UBONewEditForm />
    </Container>
  );
}
