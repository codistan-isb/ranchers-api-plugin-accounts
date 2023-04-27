import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyOtp(
    parents,
    { otp, email },
    context,
    info
) {
    // console.log("Input Otp:- ", otp);
    // console.log("Input Email:- ", email);
    const {
        collections: { users },
    } = context;
    const UserData = await users.findOne({ "emails.address": email });
    if (!UserData) {
        // The user document does not exist, throw an error or handle it as needed
        throw new ReactionError("not-found", "Account not found");
    }
    // console.log("User Response :- ", UserData);
    // console.log("Expiry Time :- ", new Date(UserData.expirationTime));
    // console.log("Current Time :- ", new Date());
    // console.log("OTP :- ", UserData.otp);
    const expirationTime = new Date(UserData.expirationTime).getTime();
    const currentTime = new Date().getTime();
    if (UserData.otp == otp) {
        if (expirationTime > currentTime) {
            return true;
        } else {
            return false;
        }
    } else {
        throw new ReactionError("invalid-parameter", "Invalid OTP");
    }
}
