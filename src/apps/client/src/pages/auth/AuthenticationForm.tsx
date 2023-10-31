import React, {useContext, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate} from 'react-router-dom';
import UserPool from "../../UserPool";
import {AccountContext} from "../../context/Account";

interface CopyrightProps {
    [key: string]: any;
}

// TODO add displaying if wrong or good
// TODO Add attributes
function Copyright(props: CopyrightProps) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
interface AuthProps {
    mode: "signup" | "login";
}

const AuthenticationForm: React.FC<AuthProps> = ({ mode }) => {
    const navigate = useNavigate();

    const contextValue = useContext(AccountContext);
    if (!contextValue && mode === "login") {
        throw new Error("Login must be used within an AccountProvider");
    }
    const { authenticate, session } = contextValue || {};

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (mode === "signup") {
            UserPool.signUp(email, password, [], [], (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.log(data);
                navigate('/dashboard');
            });
        } else if (mode === "login" && authenticate) {
            authenticate(email, password)
                .then(data => {
                    console.log("Logged in", data);
                    navigate('/dashboard');
                })
                .catch(err => {
                    console.error("Failed to login", err);
                })
        }
    }

    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        }
    }, [navigate, session]);

    return (
        <Container>
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {mode === "signup" ? "Sign up" : "Login"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        {mode === "signup" ? "Sign up" : "Login"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 8, mb: 4}}/>
        </Container>
    );
}

export default AuthenticationForm;