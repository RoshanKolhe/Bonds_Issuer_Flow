import { useGetBondApplications } from 'src/api/bondApplications';
import MainFile from '../borrowing/main';
import FinancialDetails from '../financial-details/financial-details';
import IsinActivation from '../isin-activation';
import LaunchIssue from '../launch-issue';
import MyBondNewIssue from '../mybond-new-issue';
import MyBondStart from '../mybond-start';
import MyBondStar from '../mybond-start';
import PreliminaryBondRequirements from '../preliminary-bond-requirements';
import BondsApplicationListView from './bond-application-list-view';

export default function MyBondCreate() {

  const {bondApplications , count , bondApplicationsLoading}= useGetBondApplications();
  return (
    <>
      {/* <MyBondStart /> */}

      {
        (bondApplications.length === 0 && !bondApplicationsLoading) ? <MyBondStart /> : <BondsApplicationListView bondsApplication={bondApplications} bondApplicationsLoading={bondApplicationsLoading} count={count} />
      }
    </>
  );
}
