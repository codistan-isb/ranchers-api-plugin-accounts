import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyEmailVerificationViaOTP(context, input) {
  //   console.log("input ", input);
  const { otp, email } = input;
  const { users, Accounts } = context.collections;
  const UserData = await users.findOne({ "emails.address": email });
  if (!UserData) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
  const UserID = UserData?._id;
  const expirationTime = new Date(UserData?.expirationTime).getTime();
  const currentTime = new Date().getTime();
  if (parseInt(UserData?.otp) === parseInt(otp)) {
    if (expirationTime > currentTime) {
      //   console.log("The expiration time is in the future.");
      const userUpdate = await users.updateOne(
        { _id: UserID },
        { $set: { "emails.0.verified": true } }
      );
      //   console.log("userUpdate ", userUpdate);
      const accountUpdate = await Accounts.updateOne(
        { _id: UserID },
        { $set: { "emails.0.verified": true } }
      );
      if (accountUpdate) {
        return true;
      } else {
        return false;
      }
      //   console.log("accountUpdate ", accountUpdate);
    } else {
      throw new ReactionError("invalid-parameter", "OTP is expired.");
    }
  } else {
    throw new ReactionError("invalid-parameter", "Invalid OTP");
  }
}
