import {
    Card,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Button,
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ValuerViewForm({ data, open, onClose }) {
    if (!data) return null;



    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    color: '#1360C3',
                    fontWeight: 700,
                    textAlign: 'center',
                }}
            >
                Valuer Details
            </DialogTitle>

            <DialogContent>
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 'none',
                    }}
                >
                    <Grid container spacing={2}>

                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.legalEntityName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Experience (Years)
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.experience}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Past Issue
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.pastIssues}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Fee Structure
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.feeStructure}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Regulatory Status
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.regulatory}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Response Time
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.responseTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Tech Capability
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.techCapability}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography color="#272727">
                                Reputation/Rating
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={500} color={'#000000'}>
                                {data.rating}
                            </Typography>
                        </Grid>

                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={4}>
                        <Button
                            variant="soft"
                            onClick={onClose}
                            sx={{
                                px: 4,
                                textTransform: 'none',
                                borderRadius: 1,
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
