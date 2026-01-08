import { useGetBondEstimations } from "src/api/bondEstimations";
import ROIGuidance from "../roi-guidance";
import BondsEstimationListView from "./bond-estimations-list-view";
import { useState } from 'react';
import { buildFilter } from 'src/utils/filters';
import { useTable } from 'src/components/table';
import BondIssuePage from "./bond-isue-page";


const defaultFilters = {
    name: '',
    email: '',
    role: [],
    status: 'all',
};

export default function BondEstimationsInitialPageView() {
    const table = useTable();
    const [filters, setFilters] = useState(defaultFilters);

    const filter = buildFilter({
        page: table.page,
        rowsPerPage: table.rowsPerPage,
        order: table.order,
        orderBy: table.orderBy,

        validSortFields: ['id'],

        searchTextValue: filters.name?.trim() || undefined,
    })

    const filterList = encodeURIComponent(JSON.stringify(filter));

    const { bondEstimations, bondEstimationsLoading, count } = useGetBondEstimations(filterList);

    const isInitialLoad =
        !filters.name &&
        filters.status === 'all';


    return (
        <>
            {
                bondEstimations.length === 0 &&
                    !bondEstimationsLoading &&
                    isInitialLoad ? (
                    <ROIGuidance />
                ) : (
                    <BondsEstimationListView
                        bondEstimations={bondEstimations}
                        bondEstimationsLoading={bondEstimationsLoading}
                        count={count}
                        table={table}
                        filters={filters}
                        setFilters={setFilters}
                    />
                )
            }
            {/* <BondIssuePage/> */}
        </>
    );
}




