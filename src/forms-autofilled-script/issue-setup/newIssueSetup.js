// new issue setup...
export function NewIssueSetup(options = {}) {
    const issueType = options.issueType ?? 'public';

    const data = {
        issueType,
        securityType: 'secured',
        issueSize: 500000000,
        tenureYears: 5,
        preferedInvestorCategory: issueType === 'private' ? 'HNI' : '',
        preferedPaymentCycle: 'monthly',
        couponRate: 12,
        minimumInvestmentPrice: '100000',
        redemptionType: 'bullet',
        minimumPurchaseUnit: '10',
        totalUnit: '50000',
    };

    return data;
};

export function NewFundPosition() {
    const data = {
        cashBalance: '25000000',
        bankBalance: '75000000',
        cashBalanceDate: new Date('2025-01-10'),
        bankBalanceDate: new Date('2025-01-10'),
    };
    return data;
};

export function NewCapitalDetails() {
    const data = {
        shareCapital: 50000000,
        reserveSurplus: 30000000,
        netWorth: 80000000,
    };
    return data;
};

// For Borrowing Details
export function NewBorrowingDetails() {
    const data = {
        lenderName: 'Sample Bank Ltd',
        lenderAmount: 10000000,
        repaymentTerms: 'monthly',
        borrowingType: 'secured',
        interestPayment: 8,
        monthlyPrincipal: 500000,
        monthlyInterest: 70833,
    };
    return data;
}

// For Financial Ratios
export function NewFinancialRatios() {
    const data = {
        debtEquityRatio: '1.5',
        currentRatio: '1.8',
        netWorth: 80000000,
        quickRatio: '1.2',
        returnOnEquity: '15.5',
        returnOnAssets: '8.2',
        debtServiceCoverageRatio: '1.8',
    };
    return data;
}

// For Profitability Details
export function NewProfitabilityDetails() {
    const data = {
        netProfit: 5000000,
        ebidta: 12000000,
    };
    return data;
}

// For Collateral Assets (text fields only)
export function NewCollateralAsset() {
    const data = {
        description: 'Commercial property located in Mumbai',
        estimatedValue: 50000000,
        valuationDate: new Date('2025-01-15'),
        trustName: 'Sample Trust Name',
        securityDocRef: 'SEC-REF-2025-001',
        remark: '',
    };
    return data;
}

// For PAS-4
export function NewPAS4() {
    const data = {
        filingDatePas4: '2025-01-10',
        fileNamePas4: 'PAS4-Filing-2025-001',
        referenceNoPas4: 'REF-PAS4-2025-001',
        approvalNoPas4: 'APP-PAS4-2025-001',
    };
    return data;
}

// For Term Sheet
export function NewTermSheet() {
    const data = {
        sebiApprovalNo: 'SEBI/APP/2025/001',
        sebiDate: new Date('2025-01-12'),
    };
    return data;
}

// For Information Memorandum
export function NewInformationMemorandum() {
    const data = {
        filingDateMemorandum: '2025-01-15',
        fileNameMemorandum: 'IM-2025-001',
        referenceNoMemorandum: 'REF-IM-2025-001',
    };
    return data;
}

// For In-Principle Approval
export function NewInPrincipleApproval() {
    const data = {
        exchange: 'NSE',
        inPrincipleApprovalNo: 'NSE/IPA/2025/001',
        inPrincipleApprovalDate: new Date('2025-01-20'),
    };
    return data;
}

// For ISIN Activation
export function NewISINActivation() {
    const data = {
        depository: 'NSDL',
        isin: 'INE123A01001', // Sample format
        activationDate: new Date('2025-01-25'),
    };
    return data;
}

// For Launch Issue
export function NewLaunchIssue() {
    const today = new Date();
    const subscriptionStart = new Date(today);
    subscriptionStart.setDate(today.getDate() + 7);

    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setDate(subscriptionStart.getDate() + 15);

    const allotmentDate = new Date(subscriptionEnd);
    allotmentDate.setDate(subscriptionEnd.getDate() + 3);

    const maturityDate = new Date(allotmentDate);
    maturityDate.setFullYear(allotmentDate.getFullYear() + 5);

    const openingDate = new Date(subscriptionStart);
    const closingDate = new Date(subscriptionEnd);

    const data = {
        listingExchange: 'nse',
        subscriptionStartDateTime: subscriptionStart,
        subscriptionEndDateTime: subscriptionEnd,
        dateOfAllotment: allotmentDate,
        dateOfMaturity: maturityDate,
        depository: 'nsdl',
        issueOpeningDate: openingDate,
        issueClosingDate: closingDate,
    };
    return data;
}

// For PAS-5
export function NewPAS5() {
    const data = {
        filingDatePas5: '2025-02-05',
        fileNamePas5: 'PAS5-Filing-2025-001',
        referenceNoPas5: 'REF-PAS5-2025-001',
        approvalNoPas5: 'APP-PAS5-2025-001',
    };
    return data;
}

// For GID
export function NewGID() {
    const data = {
        filingDateGid: '2025-02-10',
        fileNameGid: 'GID-Filing-2025-001',
        referenceNoGid: 'REF-GID-2025-001',
        approvalNoGid: 'APP-GID-2025-001',
    };
    return data;
}
