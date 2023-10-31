import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-2_Qn2HdLzRk",
    ClientId: "mvs2d2b7821c0sceethjjg73c"
}

const userPool = new CognitoUserPool(poolData);

export default userPool;