import { useGetBondEstimations } from "src/api/bondEstimations";
import ROIGuidance from "../roi-guidance";
import BondsEstimationListView from "./bond-estimations-list-view";
import { useState, useMemo } from 'react';
import { buildFilter } from 'src/utils/filters';
import { useTable } from 'src/components/table';


const defaultFilters = {
    name: '',
    email: '',
    role: [],
    status: 'all',
};

export default function BondEstimationsInitialPageView() {
    const table = useTable();
    const [filters, setFilters] = useState(defaultFilters);

    // 🔑 BUILD FILTER HERE (correct place)
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

    return (
        <>
            {
                (bondEstimations.length === 0 && !bondEstimationsLoading) ? <ROIGuidance /> : <BondsEstimationListView bondEstimations={bondEstimations}
                    bondEstimationsLoading={bondEstimationsLoading}
                    count={count}
                    table={table}
                    filters={filters}
                    setFilters={setFilters}
                />
            }
        </>
    )
}




