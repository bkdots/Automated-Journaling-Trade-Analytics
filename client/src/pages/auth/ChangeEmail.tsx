import React, {useContext, useState} from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { AccountContext } from "../../context/Account";

interface SessionResult {
    user: any;
    [key: string]: any;
}

export default () => {
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const contextValue = useContext(AccountContext);

    if (!contextValue) {
        throw new Error("Settings must be used within an AccountProvider");
    }

    const { getSession, authenticate } = contextValue;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        getSession().then((sessionResult) => {
            const result = sessionResult as SessionResult;
            const { user, email } = result;
            authenticate(email, password).then(() => {
                const attributes = [
                    new CognitoUserAttribute({ Name: "email", Value: newEmail})
                ];

                user.updateAttributes(attributes, (err: any, results: any) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(results);
                    }
                });
            });
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>New email</label>
                <input value={newEmail} onChange={(event) => setNewEmail(event.target.value)}/>

                <label>Current password</label>
                <input value={password} onChange={(event) => setPassword(event.target.value)}/>

                <button type="submit">Change email</button>
            </form>
        </div>
    )
}