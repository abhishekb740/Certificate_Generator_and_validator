import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider, StyledEngineProvider } from "@mui/material"

export default function ThemeProvider({ children }) {
    const theme = createTheme({
        palette: {
            type: 'dark',
            primary: {
                main: '#F4CE14',
                contrastText: '#45474B',
            },
            background: {
                default: '#2e2e2e',
                paper: '#45474B',
            },
            text: {
                primary: '#F5F7F8',
                secondary: '#F5F7F8',
            },
        },
        typography: {
            fontFamily: "Inter, sans-serif"
        }
    })
    return (
        <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </StyledEngineProvider>
    )
}