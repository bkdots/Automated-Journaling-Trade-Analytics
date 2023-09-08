import React, {useState, useContext, useEffect} from "react";
import { AccountContext } from "../context/Account";

const Status = () => {
    const [status, setStatus] = useState(false);

    const contextValue = useContext(AccountContext);
    if (!contextValue) {
        throw new Error("Get session must be used within an AccountProvider");
    }
    const { getSession, logout } = contextValue;

    useEffect(() => {
        getSession()
            .then((session) => {
                console.log("Session: ", session);
                setStatus(true);
            })
            .catch(err => {
                console.error("Failed to get session: ", err);
            });
    }, []);

    return <div>{status ? <button onClick={logout}>Logout</button> : "Please login" }</div>;
};

export default Status;