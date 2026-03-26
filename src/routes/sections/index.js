import { Navigate, useRoutes } from 'react-router-dom';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
//
import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// Identity KYC Flow 
import { lazy, Suspense } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';

const IdentityKYCPage = lazy(() => import('src/pages/dashboard/identity-kyc/kyc'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // ----------------------------------------------------------------------

    // SET INDEX PAGE WITH HOME PAGE
    // {
    //   path: '/',
    //   element: (
    //     <MainLayout>
    //       <HomePage />
    //     </MainLayout>
    //   ),
    // },

    // Auth routes
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    {
      path: 'kyc/identity-kyc',
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <IdentityKYCPage />
        </Suspense>
      )
    },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
