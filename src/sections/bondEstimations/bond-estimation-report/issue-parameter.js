import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    Grid,
    Slider,
    Stack,
    Typography,
    TextField,
} from "@mui/material";
import ApexChart from "react-apexcharts";

export default function BondIssueParameters({
    issueSize: issueSizeProp,
    couponRate: couponRateProp,
    tenure: tenureProp,
}) {
    const [issueSize, setIssueSize] = useState(issueSizeProp ?? 0);
    const [couponRate, setCouponRate] = useState(couponRateProp ?? 0);
    const [tenure, setTenure] = useState(tenureProp ?? 0);



    useEffect(() => {
        if (issueSizeProp !== undefined) setIssueSize(issueSizeProp);
        if (couponRateProp !== undefined) setCouponRate(couponRateProp);
        if (tenureProp !== undefined) setTenure(tenureProp);
    }, [issueSizeProp, couponRateProp, tenureProp]);


    const totalReturn = issueSize * Math.pow(1 + couponRate / 100, tenure);
    const interestPayment = totalReturn - issueSize;
    const totalInvestment = issueSize;

    const totalAmountSeries = [totalInvestment, interestPayment];
    const totalAmountOptions = {
        chart: {
            type: "donut",
            toolbar: { show: false },
        },
        labels: ["Total Investment", "Interest Payment"],
        legend: {
            show: false,
        },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: { show: false },
                },
            },
        },
        colors: ["#f9a825", "#1976d2"],
    };

    // Reusable slider rendering
    const renderSlider = (
        label,
        value,
        setValue,
        min,
        max,
        step,
        unit,
        minText,
        maxText
    ) => (
        <Box>
            {/* Top with text field */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
            >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {label}
                </Typography>
                <TextField
                    value={unit === "%" ? `${value}${unit}` : value?.toLocaleString()}
                    size="small"
                    sx={{ width: 130 }}
                    inputProps={{
                        readOnly: true,
                        style: { textAlign: "center" },
                    }}
                />
            </Stack>

            {/* Slider */}
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e, val) => setValue(val)}
                sx={{ flexGrow: 1, color: "#1976d2" }}
            />

            {/* Bottom min-max labels */}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">{minText}</Typography>
                <Typography variant="caption">{maxText}</Typography>
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ p: 3, mb: 3 }}>
            <Typography
                variant="h3"
                gutterBottom
                sx={{

                    color: "#1976d2",
                    fontWeight: 600,
                }}
            >
                Bond Issue Parameters
            </Typography>

            <Grid container spacing={4} alignItems="center">
                {/* Left Side - Sliders */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={4}>
                        {renderSlider(
                            "Issue Size (₹)",
                            issueSize,
                            setIssueSize,
                            10000000,
                            5000000000,
                            10000000,
                            "",
                            "Min ₹1 Cr",
                            "Max ₹500 Cr"
                        )}
                        {renderSlider(
                            "Coupon rate (%)",
                            couponRate,
                            setCouponRate,
                            1,
                            25,
                            1,
                            "%",
                            "Min 1%",
                            "Max 25%"
                        )}
                        {renderSlider(
                            "Tenure (Year)",
                            tenure,
                            setTenure,
                            1,
                            30,
                            1,
                            "",
                            "Min 1 year",
                            "Max 30 Years"
                        )}
                    </Stack>
                </Grid>

                {/* Right Side - Chart */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            p: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "none",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                            Your Total Amount
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            color="primary"
                            sx={{ fontWeight: 600, mb: 2, color: "#1976d2" }}
                        >
                            ₹ {totalReturn?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>

                        {/* Donut Chart */}
                        <Box sx={{ width: "100%", maxWidth: 220 }}>
                            <ApexChart
                                type="donut"
                                series={totalAmountSeries}
                                options={totalAmountOptions}
                                height={220}
                            />
                        </Box>

                        {/* Custom Legend with Amounts Side by Side */}
                        {/* Custom Legend with Amounts Side by Side (label top, amount bottom) */}
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={5}
                            sx={{ mt: 2 }}
                        >
                            {/* Total Investment */}
                            <Stack direction="column" alignItems="center" spacing={0.5}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "#172030",

                                        }}
                                    />
                                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                        Total Investment
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    ₹ {totalInvestment?.toLocaleString()}
                                </Typography>
                            </Stack>

                            {/* Interest Payment */}
                            <Stack direction="column" alignItems="center" spacing={0.5}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "#97C4FF",
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                        Interest Payment
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    ₹ {interestPayment?.toLocaleString()}
                                </Typography>
                            </Stack>
                        </Stack>

                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}





