import { Helmet } from 'react-helmet-async';
// sections
import { UBODetailsView } from 'src/sections/UBO/view';

// ----------------------------------------------------------------------

export default function UBODetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: UBO Details</title>
      </Helmet>

      <UBODetailsView />
    </>
  );
}
