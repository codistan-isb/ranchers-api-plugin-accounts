import sendResetPasswordOTP from "../../util/sendResetPasswordOTP";

export default async function verificationWithOTP(_, { email }, context) {
  // console.log(email)
  const {
    collections: { users },
  } = context;
  const UserData = await users.findOne({ "emails.address": email });
  if (!UserData) {
    throw new ReactionError("not-found", "Already Exist");
  } else {
    const data = await sendResetPasswordOTP(context, email, UserData._id);
    // console.log("Data: ", data)
    if (data) {
      return true;
    } else {
      return false;
    }
  }
}
