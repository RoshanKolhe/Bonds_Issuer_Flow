import { Helmet } from 'react-helmet-async';
// sections
import { UBOListView } from 'src/sections/UBO/view';

// ----------------------------------------------------------------------

export default function SignatoriesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: UBO List</title>
      </Helmet>

      <UBOListView />
    </>
  );
}
