import { createContext, useContext, useState } from "react";


export const SnackbarContext = createContext()

export function useSnackBar() {
    return useContext(SnackbarContext)
}

export function useCreateAlert() {
    const { alerts, setAlerts } = useContext(SnackbarContext)
    if (alerts.length > 5) {
        setAlerts(prev => {
            prev = prev.splice(0, prev.length - 4).filter(e => Date.now() - (e.createdAt + 6000) > 0)
            return prev
        })
    }
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true) 
    const handleClose = (e, reason) => {
        if(reason === "clickaway") {
            return
        }
        setOpen(false)
    }
    return {
        createAlert: (level, message) => {
            setAlerts(prev => {
                prev.push({
                    level,
                    message,
                    createAt: Date.now(),
                    open,
                    setOpen,
                    handleClose
                })
                return prev
            })
            handleOpen()
        }
    }
}