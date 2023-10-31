import { Typography, useTheme } from "@mui/material";
import { tokens } from "../context/theme";
import React from "react";
import Grid from "@mui/material/Grid";

type HeaderProps = {
    title: string;
    subtitle: string;
    headerContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, headerContent }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Grid container alignItems="center" spacing={3}>
            <Grid item xs={8}>
                <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0" }}
                >
                    {title}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                    {subtitle}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                {headerContent}
            </Grid>
        </Grid>
    );
};

export default Header;