import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "../context/Account";
import ChangePassword from "./auth/ChangePassword";
import ChangeEmail from "./auth/ChangeEmail";

export default () => {
    const contextValue = useContext(AccountContext);

    if (!contextValue) {
        throw new Error("Settings must be used within an AccountProvider");
    }

    const { getSession } = contextValue;

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        getSession().then(() => {
            setLoggedIn(true);
        });
    }, []);

    return (
        <div>
            {loggedIn && (
                <>
                    <h2>Settings</h2>
                    <ChangePassword />
                    <ChangeEmail />
                </>
            )}
        </div>
    )
};