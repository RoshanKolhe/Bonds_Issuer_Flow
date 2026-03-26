import { Helmet } from 'react-helmet-async';
// sections
import { UBOEditView } from 'src/sections/UBO/view';

// ----------------------------------------------------------------------

export default function UBOEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: UBO Edit</title>
      </Helmet>

      <UBOEditView />
    </>
  );
}
