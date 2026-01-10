import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

export function useGetBondEstimationReport(applicationId) {
    const URL = applicationId ? endpoints.bondReportGenrating.list(applicationId) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            bondEstimationReport: data || [],
            bondEstimationReportLoading: isLoading,
            bondEstimationReportError: error,
            bondEstimationReportValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
