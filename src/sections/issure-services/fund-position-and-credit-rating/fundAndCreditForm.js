import PropTypes from "prop-types";
import CreditRating from "./creditRatings";
import FundPosition from "./fundPosition";
import { useEffect, useState } from "react";

export default function FundAndCreditForm({ currentFundPosition, currentCreditRatings, percent, setActiveStepId }) {
    const [fundPositionPercent, setFundPositionPercent] = useState(0);
    const [creditRatingPercent, setCreditRatingPercent] = useState(0);

    useEffect(() => {
        const total = fundPositionPercent + creditRatingPercent;
        percent?.(total);
    }, [fundPositionPercent, creditRatingPercent, percent]);

    return (
        <>
            <FundPosition currentFundPosition={currentFundPosition} setPercent={setFundPositionPercent} />
            <CreditRating currentCreditRatings={currentCreditRatings} setPercent={setCreditRatingPercent} />
        </>
    )
}

FundAndCreditForm.propTpes = {
    currentFundPosition: PropTypes.object,
    currentCreditRatings: PropTypes.array
}