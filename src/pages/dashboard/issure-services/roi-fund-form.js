import { Helmet } from 'react-helmet-async';
// sections
// import FundPositionForm from 'src/sections/issure-services/fund-positions';
import RoiStepper from 'src/sections/issure-services/stepper';
// ----------------------------------------------------------------------

export default function ROIFundFormPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: ROI Fund Form</title>
      </Helmet>

      <RoiStepper />
    </>
  );
}
