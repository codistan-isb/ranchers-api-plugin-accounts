import sendResetPasswordOTP from "../../util/sendResetPasswordOTP";

export default async function verificationWithOTP(_, { email }, context) {
    // console.log(email)
    const {
        collections: { users },
    } = context;
    const UserData = await users.findOne({ "emails.address": email })
    if (!UserData) {
        // The user document does not exist, throw an error or handle it as needed
        throw new ReactionError("not-found", "Account not found");
    }

    // console.log("User Response :- ", UserData._id)
    const data = await sendResetPasswordOTP(context, email, UserData._id);
    // console.log("Data: ", data)
    if (data) {
        return true
    } else {
        return false
    }
}