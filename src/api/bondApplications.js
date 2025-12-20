import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBondApplications(filter) {
    let URL = endpoints.bondApplications.list;

    if (filter) {
        URL = endpoints.bondApplications.filterList(filter);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            bondApplications: data?.applications || [],
            count: data?.count || 0,
            bondApplicationsLoading: isLoading,
            bondApplicationsError: error,
            bondApplicationsValidating: isValidating,
            bondApplicationsEmpty: !isLoading && !data?.applications?.length,
        }),
        [data?.applications, error, isLoading, isValidating]
    );

  
    console.log(memoizedValue?.bondApplications)

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBondApplication(applicationId) {
    const URL = applicationId ? endpoints.bondApplications.details(applicationId) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            bondApplication: data?.applications,
            bondApplicationLoading: isLoading,
            bondApplicationError: error,
            bondApplicationValidating: isValidating,
        }),
        [data?.applications, error, isLoading, isValidating]
    );

    return memoizedValue;
}
