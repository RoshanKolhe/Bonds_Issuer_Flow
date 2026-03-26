import { Helmet } from 'react-helmet-async';
// sections
import { UBOCreateView } from 'src/sections/UBO/view';

// ----------------------------------------------------------------------

export default function UBOCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new UBO</title>
      </Helmet>

      <UBOCreateView />
    </>
  );
}
