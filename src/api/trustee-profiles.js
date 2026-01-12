import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetTrusteeProfiles() {
    const URL = endpoints.trusteeProfiles.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            trusteeProfiles: data?.data?.profiles || [],
            totalCount: data?.data?.count || [],
            trusteeProfilesLoading: isLoading,
            trusteeProfilesError: error,
            trusteeProfilesValidating: isValidating,
            trusteeProfilesEmpty: !isLoading && (!data?.data?.profiles?.length),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
