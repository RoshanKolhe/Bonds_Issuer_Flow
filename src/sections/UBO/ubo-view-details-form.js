import PropTypes from 'prop-types';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

export const defaultUBOData = {
    id: 'UBO-2023-99230',
    fullName: 'Vikram Singh Malhotra',
    email: 'v.malhotra@ind-fin.com',
    phone: '+91 98XXX X0221',
    designationValue: 'Lead Signatory',
    ownershipPercent: 38,
    submittedDateOfBirth: '1988-10-24',
    createdAt: '2023-10-24T14:32:00+05:30',
    updatedAt: '2023-10-24T14:32:00+05:30',
    submittedPanFullName: 'Vikram Singh Malhotra',
    submittedPanNumber: 'ABCDE1234F',
    aadharInfo: {
        aadharNumber: '123412341234',
    },
    panCardFile: {
        id: 'file-pan-card',
        fileOriginalName: 'PAN_Card_Copy.pdf',
        fileUrl: '#',
    },
    boardResolutionFile: {
        id: 'file-board-resolution',
        fileOriginalName: 'Board_Resolution.pdf',
        fileUrl: '#',
    },
};

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'U';

const formatDateTime = (value) => {
    if (!value) return null;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed);
};

const formatDate = (value) => {
    if (!value) return null;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
};

const maskValue = (value, visibleCount = 4) => {
    if (!value || typeof value !== 'string') return null;
    if (value.length <= visibleCount) return value;

    return `${'*'.repeat(Math.max(value.length - visibleCount, 0))}${value.slice(-visibleCount)}`;
};

function DetailItem({ label, value, icon, multiline = false }) {
    if (!value) return null;

    return (
        <Box
            sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: 'common.white',
                border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                minHeight: multiline ? 132 : 'auto',
            }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
                        {label}
                    </Typography>
                    {icon ? <Iconify icon={icon} width={18} sx={{ color: 'success.main' }} /> : null}
                </Stack>

                <Typography variant="subtitle1" sx={{ whiteSpace: multiline ? 'pre-line' : 'normal' }}>
                    {value}
                </Typography>
            </Stack>
        </Box>
    );
}

DetailItem.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function DocumentTile({ file, icon, color = 'primary.main' }) {
    if (!file?.fileUrl && !file?.fileOriginalName) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                height: '100%',
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color,
                    flexShrink: 0,
                }}
            >
                <Iconify icon={icon} width={22} />
            </Box>

            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>
                    {file.fileOriginalName || 'Document'}
                </Typography>
                {file.fileUrl ? (
                    <Link href={file.fileUrl} target="_blank" rel="noreferrer" underline="hover" variant="body2">
                        Open file
                    </Link>
                ) : null}
            </Box>
        </Card>
    );
}

DocumentTile.propTypes = {
    color: PropTypes.string,
    file: PropTypes.object,
    icon: PropTypes.string.isRequired,
};

export default function UBOViewDetailsForm({ currentUBO }) {
    const hasIncomingData = Boolean(currentUBO && Object.keys(currentUBO).length);
    const uboData = hasIncomingData ? currentUBO : defaultUBOData;

    const { fullName, email, phone, id, updatedAt, createdAt, ownershipPercent } = uboData;
    const designation =
        uboData.designationValue || uboData.designation || uboData.roleValue || uboData.designationType;
    const submittedDateOfBirth = uboData.submittedDateOfBirth || uboData.dob;

    const panNumber =
        uboData?.panInfo?.panNumber || uboData?.submittedPanNumber || uboData?.extractedPan?.extractedPanNumber;
    const panFullName =
        uboData?.panInfo?.fullNameAsPerPan ||
        uboData?.submittedPanFullName ||
        uboData?.extractedPan?.extractedPanHolderName;
    const aadhaarNumber =
        uboData?.aadharInfo?.aadharNumber || uboData?.aadhaarInfo?.aadhaarNumber || uboData?.aadharNumber;

    const details = [
        { label: 'Full Legal Name', value: fullName, icon: 'solar:verified-check-bold' },
        { label: 'Email Address', value: email },
        { label: 'Contact Number', value: phone },
        { label: 'Designation', value: designation },
        {
            label: 'Ownership Percentage',
            value: ownershipPercent || ownershipPercent === 0 ? `${ownershipPercent}%` : null,
        },
        { label: 'Date of Birth', value: formatDate(submittedDateOfBirth) },
        { label: 'PAN Holder Name', value: panFullName },
    ].filter((item) => item.value);

    const verifiedItems = [
        {
            label: 'PAN Number',
            value: maskValue(panNumber),
            helper: panNumber ? 'Available in record' : null,
            icon: 'solar:shield-check-bold',
        },
        {
            label: 'Aadhaar ID',
            value: maskValue(aadhaarNumber),
            helper: aadhaarNumber ? 'Available in record' : null,
            icon: 'solar:shield-check-bold',
        },
    ].filter((item) => item.value);

    const documents = [
        {
            file: uboData.panCardFile || uboData.panCard,
            icon: 'solar:file-text-bold',
            color: 'error.main',
        },
        {
            file: uboData.boardResolutionFile || uboData.boardResolution,
            icon: 'solar:document-bold',
            color: 'primary.main',
        },
    ].filter((item) => item.file);

    const metaPoints = [
        { icon: 'solar:calendar-date-bold', label: 'Verified On', value: formatDateTime(updatedAt || createdAt) },
        { icon: 'solar:user-id-bold', label: 'Record ID', value: id },
    ].filter((item) => item.value);

    return (
        <Stack spacing={3}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            p: { xs: 3, md: 4 },
                            overflow: 'hidden',
                            position: 'relative',
                            maxHeight: '100%',
                            hight: '100%',
                            background: (theme) =>
                                `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${theme.palette.common.white} 45%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -60,
                                right: -80,
                                width: 240,
                                height: 240,
                                borderRadius: '50%',
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                            }}
                        />

                        <Stack spacing={3} sx={{ position: 'relative', maxHeight: '100%' }}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="space-between"
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                spacing={2}
                            >
                                <Box>
                                    <Label
                                        color="success"
                                        sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}
                                    >
                                        Verification Successful
                                    </Label>
                                    <Typography variant="h3" sx={{ mb: 1 }}>
                                        UBO Status: Compliant
                                    </Typography>
                                    {metaPoints.length ? (
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            spacing={2}
                                            divider={<Divider orientation="vertical" flexItem />}
                                        >
                                            {metaPoints.map((item) => (
                                                <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                                                    <Iconify icon={item.icon} width={18} sx={{ color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.label}: {item.value}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Details available from the current UBO record.
                                        </Typography>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        width: 88,
                                        height: 88,
                                        borderRadius: '50%',
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                                        color: 'success.main',
                                    }}
                                >
                                    <Iconify icon="solar:check-circle-bold" width={44} />
                                </Box>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Stack spacing={3} height="100%">
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
                                        color: 'primary.main',
                                        fontSize: 24,
                                        fontWeight: 700,
                                    }}
                                >
                                    {getInitials(fullName)}
                                </Avatar>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="h5" noWrap>
                                        {fullName || 'UBO Profile'}
                                    </Typography>
                                    {designation ? (
                                        <Typography variant="body2" color="text.secondary">
                                            {designation}
                                        </Typography>
                                    ) : null}
                                    {id ? (
                                        <Typography variant="body2" color="text.secondary">
                                            Bonds ID: {id}
                                        </Typography>
                                    ) : null}
                                </Box>
                            </Stack>

                            <Divider />

                            <Stack spacing={2}>
                                {email ? (
                                    <Box>
                                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
                                            Email Address
                                        </Typography>
                                        <Typography variant="subtitle1">{email}</Typography>
                                    </Box>
                                ) : null}

                                {phone ? (
                                    <Box>
                                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
                                            Contact Number
                                        </Typography>
                                        <Typography variant="subtitle1">{phone}</Typography>
                                    </Box>
                                ) : null}
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06), height: '100%' }}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Iconify icon="solar:user-id-bold" width={22} />
                                <Typography variant="h4">Section 01: Identity Details</Typography>
                            </Stack>

                            <Grid container spacing={2}>
                                {details.map((item) => (
                                    <Grid item xs={12} sm={item.label === 'PAN Holder Name' ? 12 : 6} key={item.label}>
                                        <DetailItem
                                            label={item.label}
                                            value={item.value}
                                            icon={item.icon}
                                            multiline={String(item.value).length > 50}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04), height: '100%' }}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Iconify icon="solar:shield-check-bold" width={22} />
                                <Typography variant="h4">Section 02: Verified Regulatory Data</Typography>
                            </Stack>

                            {verifiedItems.length ? (
                                <>
                                    <Grid container spacing={2}>
                                        {verifiedItems.map((item) => (
                                            <Grid item xs={12} sm={6} key={item.label}>
                                                <Box
                                                    sx={{
                                                        p: 2.5,
                                                        borderRadius: 2,
                                                        bgcolor: 'common.white',
                                                        borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                                                        boxShadow: (theme) => `0 0 0 1px ${alpha(theme.palette.grey[500], 0.12)}`,
                                                        minHeight: 156,
                                                    }}
                                                >
                                                    <Stack spacing={2}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
                                                                {item.label}
                                                            </Typography>
                                                            <Iconify icon={item.icon} width={20} sx={{ color: 'success.main' }} />
                                                        </Stack>

                                                        <Typography variant="h4">{item.value}</Typography>

                                                        {item.helper ? (
                                                            <Typography variant="body2" color="success.main">
                                                                {item.helper}
                                                            </Typography>
                                                        ) : null}
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2,
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            {submittedDateOfBirth ? (
                                                <Grid item xs={12} sm={6}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Iconify icon="solar:calendar-date-bold" width={22} color="primary.main" />
                                                        <Box>
                                                            <Typography variant="subtitle2">Date of Birth</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatDate(submittedDateOfBirth)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                            ) : null}

                                            {designation ? (
                                                <Grid item xs={12} sm={6}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Iconify icon="solar:badge-check-bold" width={22} color="primary.main" />
                                                        <Box>
                                                            <Typography variant="subtitle2">Verification Context</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {designation}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                            ) : null}
                                        </Grid>
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: 'common.white',
                                        border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.4)}`,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No verified PAN or Aadhaar data is available in the current record.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            {documents.length ? (
                <Card sx={{ p: 3 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="h4">Verified Documents Vault</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {documents.length} document{documents.length > 1 ? 's' : ''} securely stored
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        {documents.map((item, index) => (
                            <Grid item xs={12} md={6} key={`${item.file?.id || item.file?.fileOriginalName || 'doc'}-${index}`}>
                                <DocumentTile file={item.file} icon={item.icon} color={item.color} />
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            ) : null}
        </Stack>
    );
}

UBOViewDetailsForm.propTypes = {
    currentUBO: PropTypes.object,
};
