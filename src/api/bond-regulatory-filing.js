import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBondRegulatoryFilingDocuments(applicationId) {
    let URL = null;

    if (applicationId) {
        URL = endpoints.bondRegulatoryFilingDocuments(applicationId);
    }

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            documents: data || [],
            documentsLoading: isLoading,
            documentsError: error,
            documentsValidating: isValidating,
            documentsEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}