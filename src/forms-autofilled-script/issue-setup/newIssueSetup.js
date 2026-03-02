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

export function NewIssueDocuments() {
    const data = {
        certificate_of_incorporation: {
            "id": "de80f905-32b2-4ea7-a012-44531fbe6aea",
            "fileOriginalName": "certificate_of_incorporation.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044038881Z_certificate_of_incorporation.docx"
        },
        board_resolution: {
            "id": "669336e6-77f6-47dd-a88e-b988c34ca438",
            "fileOriginalName": "board_resolution.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044045249Z_board_resolution.docx"
        },
        moa: {
            "id": "ea29252e-ea69-45e4-99ea-ba3c0b5a8227",
            "fileOriginalName": "MOA.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044050385Z_MOA.docx"
        },
        aoa: {
            "id": "b494e41d-e540-45ab-bb67-c92e344cd7fc",
            "fileOriginalName": "AOA.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044053598Z_AOA.docx"
        },
        special_resoltion_u_s_42: {
            "id": "3b1be849-ea76-47ac-aff1-923e76bbefca",
            "fileOriginalName": "Shareholder_resolution.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044101126Z_Shareholder_resolution.docx"
        },
        mgt_14: {
            "id": "f15faa5a-1c2e-48f7-a382-8f4bfda10350",
            "fileOriginalName": "MGT-14.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044105529Z_MGT-14.docx"
        }
    };
    return data;
};

export function NewFinancialStatements() {
    const data = {
        "fs-0": {
            "id": "de80f905-32b2-4ea7-a012-44531fbe6aea",
            "fileOriginalName": "financial-statement-2023-2024.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044038881Z_certificate_of_incorporation.docx"
        },
        "fs-1": {
            "id": "669336e6-77f6-47dd-a88e-b988c34ca438",
            "fileOriginalName": "financial-statement-2024-2025.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044045249Z_board_resolution.docx"
        },
        "fs-2": {
            "id": "ea29252e-ea69-45e4-99ea-ba3c0b5a8227",
            "fileOriginalName": "financial-statement-2025-2026.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044050385Z_MOA.docx"
        },
    };
    return data;
};

export function NewITR() {
    const data = {
        "itr-0": {
            "id": "de80f905-32b2-4ea7-a012-44531fbe6aea",
            "fileOriginalName": "ITR-2023-2024.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044038881Z_certificate_of_incorporation.docx"
        },
        "itr-1": {
            "id": "669336e6-77f6-47dd-a88e-b988c34ca438",
            "fileOriginalName": "ITR-2024-2025.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044045249Z_board_resolution.docx"
        },
        "itr-2": {
            "id": "ea29252e-ea69-45e4-99ea-ba3c0b5a8227",
            "fileOriginalName": "ITR-2025-2026.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044050385Z_MOA.docx"
        },
    };
    return data;
};

export function NewGSTR() {
    const data = {
        "gstr9-0": {
            "id": "de80f905-32b2-4ea7-a012-44531fbe6aea",
            "fileOriginalName": "GSTR-2023-2024.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044038881Z_certificate_of_incorporation.docx"
        },
        "gstr9-1": {
            "id": "669336e6-77f6-47dd-a88e-b988c34ca438",
            "fileOriginalName": "GSTR-2024-2025.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044045249Z_board_resolution.docx"
        },
        "gstr9-2": {
            "id": "ea29252e-ea69-45e4-99ea-ba3c0b5a8227",
            "fileOriginalName": "GSTR-2025-2026.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044050385Z_MOA.docx"
        },
    };
    return data;
};

export function NewGST3B() {
    const data = {
        auditorName: 'Karan & Associates',
        documents: [
            {
                id: 'gst3b-jan',
                month: 'jan',
                file: {
                    id: 'de80f905-32b2-4ea7-a012-44531fbe6aea',
                    fileOriginalName: 'GST3B-jan.pdf',
                    fileUrl: 'http://localhost:3034/files/file/20260207T044038881Z_GST3B-jan.pdf'
                },
                status: 'Uploaded',
                reportDate: new Date('2025-01-10'),
                auditedType: 'audited',
            }
        ],
    };
    return data;
};

export function NewRegulatoryFiling() {
    const data = {
        "": {
            "id": "de80f905-32b2-4ea7-a012-44531fbe6aea",
            "fileOriginalName": "ITR-2023-2024.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044038881Z_certificate_of_incorporation.docx"
        },
        "": {
            "id": "669336e6-77f6-47dd-a88e-b988c34ca438",
            "fileOriginalName": "ITR-2024-2025.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044045249Z_board_resolution.docx"
        },
        "": {
            "id": "ea29252e-ea69-45e4-99ea-ba3c0b5a8227",
            "fileOriginalName": "ITR-2025-2026.docx",
            "fileUrl": "http://localhost:3034/files/file/20260207T044050385Z_MOA.docx"
        },
    };
    return data;
}

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

// For ISIN Application
export function NewISINApplication() {
    const data = {
        depository: 'NSDL',
        isinApplicationDate: new Date('2025-01-22'),
        isinCode: 'INE123A01001',
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

// For Trustee Due Diligence
export function NewTrusteeDueDiligence() {
    const data = {
        trusteeApproved: true,
        trusteeRemarks: 'Trustee due diligence completed and issue approved for further processing.',
    };
    return data;
}

// For Execute Documents
export function NewExecuteDocuments() {
    const data = {
        debentureTrusteeDeed: {
            id: 'ed3d9f2a-9dfb-4a12-bd26-df4eac302f11',
            fileOriginalName: 'debenture-trustee-deed.pdf',
            fileUrl: 'http://localhost:3034/files/file/20260207T044038881Z_debenture-trustee-deed.pdf',
        },
        securityDocument: {
            id: 'f93d70d2-2f8a-4c2c-b3ba-4ac7b0f7d8a9',
            fileOriginalName: 'security-document.pdf',
            fileUrl: 'http://localhost:3034/files/file/20260207T044045249Z_security-document.pdf',
        },
        escrowAgreement: {
            id: 'f9dc86fe-8d4e-485e-94cf-6a0db8d3d218',
            fileOriginalName: 'escrow-agreement.pdf',
            fileUrl: 'http://localhost:3034/files/file/20260207T044050385Z_escrow-agreement.pdf',
        },
    };
    return data;
}

// For Escrow Account
export function NewEscrowAccount() {
    const data = {
        bankName: 'Axis Bank',
        accountNumber: '917203456789',
        ifsc: 'UTIB0000123',
        referenceId: 'DCENTRO_ESCROW_123',
        provider: 'DCENTRO',
        status: 'ACTIVE',
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
