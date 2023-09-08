import React, {useContext, useState} from "react";
import { AccountContext } from "../../context/Account";

interface SessionResult {
    user: any;
    [key: string]: any;
}

export default () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const contextValue = useContext(AccountContext);

    if (!contextValue) {
        throw new Error("Settings must be used within an AccountProvider");
    }

    const { getSession } = contextValue;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        getSession().then((sessionResult) => {
            const result = sessionResult as SessionResult;
            const { user } = result;
            user.changePassword(password, newPassword, (err: any, result: any) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(result);
                }
            })
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>Current password</label>
                <input value={password} onChange={(event) => setPassword(event.target.value)}/>

                <label>New password</label>
                <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>

                <button type="submit">Change password</button>
            </form>
        </div>
    )
}