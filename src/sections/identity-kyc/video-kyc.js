import PropTypes from 'prop-types';
import {
    alpha,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

const checklistItems = [
    {
        title: 'Identity Document',
        description: 'Keep your Passport or National ID ready for physical inspection.',
        checked: true,
    },
    {
        title: 'Stable Internet',
        description: 'Ensure you have at least 5Mbps upload speed for clear video.',
        checked: true,
    },
    {
        title: 'Good Lighting',
        description: 'Sit facing a light source so your face is clearly visible.',
        checked: false,
    },
    {
        title: 'Quiet Environment',
        description: 'Minimal background noise ensures your voice is recorded clearly.',
        checked: false,
    },
];

function ChecklistRow({ title, description, checked }) {
    return (
        <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    mt: 0.5,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    border: (theme) =>
                        `2px solid ${checked ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.28)}`,
                    color: checked ? 'primary.main' : 'transparent',
                    flexShrink: 0,
                }}
            >
                <Iconify icon="solar:check-read-bold" width={18} />
            </Box>

            <Box>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {description}
                </Typography>
            </Box>
        </Stack>
    );
}

ChecklistRow.propTypes = {
    checked: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default function VideoKYC() {
    return (
        <Box sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}>
            <Stack spacing={5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={3}>
                            <Box sx={{ maxWidth: 860 }}>
                                <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3 }}>
                                    Step 3 of 3: Video KYC
                                </Typography>
                                <Typography variant="h1" sx={{ mb: 2 }}>
                                    Video Verification
                                </Typography>
                                <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                                    To complete your account setup, please join a live session with a certified
                                    verification officer. This process takes approximately 3-5 minutes.
                                </Typography>
                            </Box>

                            <Stack direction="row" justifyContent="flex-end">
                                <Box
                                    sx={{
                                        px: 2.5,
                                        py: 1.25,
                                        borderRadius: 2,
                                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                                        color: 'text.primary',
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                bgcolor: 'success.main',
                                            }}
                                        />
                                        <Typography variant="subtitle2" sx={{ letterSpacing: 2 }}>
                                            Officers Online
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>

                            <Card
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: (theme) => theme.customShadows?.card || theme.shadows[8],
                                    background:
                                        'linear-gradient(135deg, rgba(28,37,46,0.96) 0%, rgba(43,54,65,0.98) 55%, rgba(57,70,84,0.95) 100%)',
                                }}
                            >
                                <Stack spacing={3}>
                                    <Box
                                        sx={{
                                            minHeight: 420,
                                            borderRadius: 3,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background:
                                                'radial-gradient(circle at 72% 78%, rgba(140,190,220,0.5) 0%, rgba(104,135,160,0.08) 18%, transparent 28%), linear-gradient(180deg, rgba(24,31,38,0.35) 0%, rgba(24,31,38,0.55) 100%)',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                background:
                                                    'linear-gradient(180deg, rgba(16,22,29,0.24) 0%, rgba(16,22,29,0.66) 100%)',
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '18%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 148,
                                                height: 148,
                                                borderRadius: '50%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                bgcolor: 'rgba(255,255,255,0.14)',
                                                backdropFilter: 'blur(10px)',
                                                color: 'common.white',
                                            }}
                                        >
                                            <Iconify icon="solar:videocamera-record-bold" width={56} />
                                        </Box>

                                        <Typography
                                            variant="h2"
                                            sx={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '58%',
                                                transform: 'translateX(-50%)',
                                                color: 'common.white',
                                                textAlign: 'center',
                                                width: '100%',
                                                px: 2,
                                            }}
                                        >
                                            Ready to start your verification?
                                        </Typography>

                                        <Card
                                            sx={{
                                                position: 'absolute',
                                                left: '50%',
                                                bottom: 28,
                                                transform: 'translateX(-50%)',
                                                px: 2.5,
                                                py: 1.75,
                                                borderRadius: 3,
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                boxShadow: '0 24px 40px rgba(9, 19, 29, 0.28)',
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                {['solar:microphone-3-bold', 'solar:videocamera-record-bold', 'solar:monitor-smartphone-bold'].map((icon) => (
                                                    <Box
                                                        key={icon}
                                                        sx={{
                                                            width: 52,
                                                            height: 52,
                                                            borderRadius: '50%',
                                                            display: 'grid',
                                                            placeItems: 'center',
                                                            bgcolor: 'common.white',
                                                            boxShadow: (theme) => `0 0 0 1px ${alpha(theme.palette.grey[500], 0.14)}`,
                                                        }}
                                                    >
                                                        <Iconify icon={icon} width={24} />
                                                    </Box>
                                                ))}

                                                <Divider flexItem orientation="vertical" />

                                                <Box
                                                    sx={{
                                                        width: 58,
                                                        height: 58,
                                                        borderRadius: '50%',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        bgcolor: '#b5453f',
                                                        color: 'common.white',
                                                    }}
                                                >
                                                    <Iconify icon="solar:end-call-bold" width={24} />
                                                </Box>
                                            </Stack>
                                        </Card>

                                        <Card
                                            sx={{
                                                position: 'absolute',
                                                right: 28,
                                                bottom: 28,
                                                width: 240,
                                                height: 132,
                                                borderRadius: 2.5,
                                                bgcolor: 'rgba(196, 224, 241, 0.28)',
                                                border: '2px solid rgba(83, 92, 104, 0.42)',
                                                backdropFilter: 'blur(8px)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 12,
                                                    px: 1.2,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: 'rgba(53, 63, 74, 0.78)',
                                                    color: 'common.white',
                                                }}
                                            >
                                                <Typography variant="subtitle2">YOU</Typography>
                                            </Box>
                                        </Card>
                                    </Box>

                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: 54,
                                                        height: 54,
                                                        borderRadius: '50%',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                                        color: 'primary.main',
                                                    }}
                                                >
                                                    <Iconify icon="solar:shield-check-bold" width={28} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5">End-to-End Encrypted</Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Your data and session are secured using 256-bit encryption.
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box>
                                                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
                                                    Session ID
                                                </Typography>
                                                <Typography variant="h5" color="primary.main">
                                                    #BK-9902-XJ
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}` }}>
                                <Stack spacing={3}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Iconify icon="solar:checklist-minimalistic-bold" width={24} sx={{ color: 'primary.main' }} />
                                        <Typography variant="h3">Pre-call Checklist</Typography>
                                    </Stack>

                                    {checklistItems.map((item) => (
                                        <ChecklistRow
                                            key={item.title}
                                            title={item.title}
                                            description={item.description}
                                            checked={item.checked}
                                        />
                                    ))}

                                    <Divider />

                                    <Box
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2.5,
                                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                            <Iconify icon="solar:headphones-round-sound-bold" width={24} sx={{ color: 'text.secondary' }} />
                                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                                Having trouble? <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>Chat with support</Box> or schedule a call for later.
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Card>

                            <Card
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: 'none',
                                }}
                            >
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    Estimated Wait Time
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="flex-end">
                                    <Typography variant="h1" sx={{ lineHeight: 1 }}>
                                        2
                                    </Typography>
                                    <Typography variant="h3" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Minutes
                                    </Typography>
                                </Stack>

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -18,
                                        bottom: -18,
                                        width: 84,
                                        height: 84,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(103, 128, 191, 0.16)',
                                    }}
                                />
                            </Card>

                            <Button variant="contained" size="large">
                                Join Session
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
