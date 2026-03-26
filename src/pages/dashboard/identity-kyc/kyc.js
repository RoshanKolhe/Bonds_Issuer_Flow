import { Helmet } from 'react-helmet-async';
// sections
import { IdentityKycLayout } from 'src/sections/identity-kyc/view';

// ----------------------------------------------------------------------

export default function IdentityKYCPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Identity KYC Verification</title>
            </Helmet>

            <IdentityKycLayout />
        </>
    );
}
