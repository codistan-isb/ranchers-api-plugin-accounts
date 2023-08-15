import ReactionError from "@reactioncommerce/reaction-error";
import { bcryptPassword } from "../../util/encryption.js";

export default async function updatePasswordWithOTP(
  parent,
  { otp, newPassword, email },
  context,
  info
) {
  // console.log("New Password:- ", newPassword)
  // console.log("otp:- ", typeof (parseInt(otp)))
  const { users, Accounts } = context.collections;

  const UserData = await users.findOne({ "emails.address": email });
  if (!UserData) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
  // console.log("User Response :- ", UserData._id)
  const UserID = UserData._id;
  const accountResp = await users.findOne({ _id: UserID });
  if (!accountResp) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
  // console.log("account Resp : ", accountResp)
  // console.log("Expiry Time :- ", new Date(accountResp.expirationTime))
  // console.log("Current TIme :- ", new Date())
  // console.log("OTP :- ", typeof (accountResp.otp));
  const DBOTP = accountResp.otp;
  const expirationTime = new Date(accountResp.expirationTime).getTime();
  const currentTime = new Date().getTime();
  if (parseInt(accountResp.otp) === parseInt(otp)) {
    if (expirationTime > currentTime) {
      // console.log('The expiration time is in the future.');
      const hasedPass = await bcryptPassword(newPassword);
      // console.log("hased Pass:-", hasedPass)
      const userUpdate = await users.updateOne(
        { _id: UserID },
        { $set: { "services.password.bcrypt": hasedPass } }
      );
      // console.log("user Update :- ", userUpdate.modifiedCount)
      if (userUpdate.modifiedCount === 1) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new ReactionError("invalid-parameter", "OTP is expired.");
    }
  } else {
    throw new ReactionError("invalid-parameter", "Invalid OTP");
  }
}
