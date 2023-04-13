import sendResetPasswordOTP from "../../util/sendResetPasswordOTP";

export default async function ResetPasswordWithOTP(_, { email }, context) {
    console.log(email)
    const { id } = context.user 

    const data = await sendResetPasswordOTP(context, email, id);
    console.log("Data:- ", data)
    if (data) {
        return true
    } else {
        return false
    }
}