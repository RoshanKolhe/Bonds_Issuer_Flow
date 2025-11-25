import { Helmet } from 'react-helmet-async';
import FundPositionForm from 'src/sections/issure-services/fund-positions';


// ----------------------------------------------------------------------

export default function FundPositionPage() {
  return (
    <>
      <Helmet>
        <title> Roi: FundPositionForm</title>
      </Helmet>

      <FundPositionForm />
    </>
  );
}
