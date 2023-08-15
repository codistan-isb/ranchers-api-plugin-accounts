import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyOtpViaEmail(
  parents,
  { otp, email },
  context,
  info
) {
  const {
    collections: { users },
  } = context;
  const UserData = await users.findOne({ "emails.address": email });
  if (!UserData) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
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
