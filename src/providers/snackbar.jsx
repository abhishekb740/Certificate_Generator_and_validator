import { SnackbarContext } from '@context/snackbar';
import MuiAlert from '@mui/material/Alert';
import MuiSnackbar from '@mui/material/Snackbar';
import { useState, forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function SnackbarProvider({ children }) {
    const [alerts, setAlerts] = useState([])

    return (
        <SnackbarContext.Provider value={{ alerts, setAlerts }}>
            {children}
            {alerts.map((e, i) => (
                <MuiSnackbar open={true} autoHideDuration={6000} onClose={e.handleClose} key={i}>
                    <Alert onClose={e.handleClose} severity={e.level} sx={{ width: '100%' }}>
                        {e.message}
                    </Alert>
                </MuiSnackbar>
            ))}
        </SnackbarContext.Provider>
    )
}