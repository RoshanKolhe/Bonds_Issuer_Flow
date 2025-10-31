import { Helmet } from 'react-helmet-async';
// sections

import { JobsListView } from 'src/sections/jobList/view';
import BorrowingDetails from 'src/sections/roi/stepThree/borrowing-details';
import CapitalDetials from 'src/sections/roi/stepThree/capital-details';
import FinancialDetails from 'src/sections/roi/stepFour/financial-details';
import MainFile from 'src/sections/roi/stepThree/main';
import ProfitabilityDetails from 'src/sections/roi/stepThree/profitable-details';
import StepFour from 'src/sections/roi/stepFour';
import RoiStepper from 'src/sections/roi/stepper';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      <MainFile />
      {/* <StepFour />
      <RoiStepper /> */}
    </>
  );
}
