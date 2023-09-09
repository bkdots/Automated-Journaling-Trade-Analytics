import React, {useContext, useState} from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { AccountContext } from "../../context/Account";

interface SessionResult {
    user: any;
    [key: string]: any;
}

interface SettingsProps {
    mode: "password" | "email";
}

const UserDetailsChangeForm: React.FC<SettingsProps> = ({ mode }) => {
    const [password, setPassword] = useState("");
    const [newDetail, setNewDetail] = useState("");

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

            if (mode === "password") {
                user.changePassword(password, newDetail, (err: any, result: any) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(result);
                    }
                });
            } else if (mode === "email") {
                authenticate(email, password).then(() => {
                    const attributes = [
                        new CognitoUserAttribute({ Name: "email", Value: newDetail })
                    ];

                    user.updateAttributes(attributes, (err: any, results: any) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(results);
                        }
                    });
                });
            }
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>{mode === "password" ? "New password" : "New email"}</label>
                <input value={newDetail} onChange={(event) => setNewDetail(event.target.value)}/>

                <label>Current password</label>
                <input value={password} onChange={(event) => setPassword(event.target.value)}/>

                <button type="submit">{mode === "password" ? "Change password" : "Change email"}</button>
            </form>
        </div>
    )
}

export default UserDetailsChangeForm;