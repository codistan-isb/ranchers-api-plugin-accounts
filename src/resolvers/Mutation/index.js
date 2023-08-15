import addAccountAddressBookEntry from "./addAccountAddressBookEntry.js";
import addAccountEmailRecord from "./addAccountEmailRecord.js";
import addAccountToGroup from "./addAccountToGroup.js";
import createAccount from "./createAccount.js";
import createAccountGroup from "./createAccountGroup.js";
import grantAdminUIAccess from "./grantAdminUIAccess.js";
import inviteShopMember from "./inviteShopMember.js";
import removeAccountAddressBookEntry from "./removeAccountAddressBookEntry.js";
import removeAccountEmailRecord from "./removeAccountEmailRecord.js";
import removeAccountGroup from "./removeAccountGroup.js";
import removeAccountFromGroup from "./removeAccountFromGroup.js";
import revokeAdminUIAccess from "./revokeAdminUIAccess.js";
import sendResetAccountPasswordEmail from "./sendResetAccountPasswordEmail.js";
import setAccountDefaultEmail from "./setAccountDefaultEmail.js";
import ReactionError from "@reactioncommerce/reaction-error";
import updateAccount from "./updateAccount.js";
import updateAccountAddressBookEntry from "./updateAccountAddressBookEntry.js";
import updateAccountGroup from "./updateAccountGroup.js";
import updateAdminUIAccess from "./updateAdminUIAccess.js";
import updateGroupsForAccounts from "./updateGroupsForAccounts.js";
import updateUserRole from "./updateUserRole.js";
import sendResetPasswordOTP from "../../util/sendResetPasswordOTP.js";
import updatePasswordWithOTP from "./updatePasswordWithOTP.js";
import verifyOtpViaEmail from "./verifyOtpViaEmail.js";
import updateRiderAccountPassword from "./updateRiderAccountPassword.js";
import verifyEmailVerificationViaOTP from "./verifyEmailVerificationViaOTP.js";

export default {
  updateRiderAccountPassword,
  verifyOtpViaEmail,
  addAccountAddressBookEntry,
  addAccountEmailRecord,
  addAccountToGroup,
  createAccount,
  createAccountGroup,
  grantAdminUIAccess,
  inviteShopMember,
  removeAccountAddressBookEntry,
  removeAccountEmailRecord,
  removeAccountFromGroup,
  removeAccountGroup,
  revokeAdminUIAccess,
  sendResetAccountPasswordEmail,
  setAccountDefaultEmail,
  updateAccount,
  updateAccountAddressBookEntry,
  updateAccountGroup,
  updateAdminUIAccess,
  updateGroupsForAccounts,
  updateUserRole,
  async verificationWithOTP(_, { email }, context) {
    // console.log(email)
    const {
      collections: { users },
    } = context;
    const UserData = await users.findOne({ "emails.address": email });
    if (!UserData) {
      // The user document does not exist, throw an error or handle it as needed
      throw new ReactionError("not-found", "Account not found");
    }
    // console.log("User Response :- ", UserData._id)
    const data = await sendResetPasswordOTP(context, email, UserData?._id);
    // console.log("Data: ", data)
    if (data) {
      return true;
    } else {
      return false;
    }
  },
  async ResetPasswordWithOTP(_, { email }, context) {
    // console.log(email)
    const {
      collections: { users },
    } = context;
    const UserData = await users.findOne({ "emails.address": email });
    if (!UserData) {
      // The user document does not exist, throw an error or handle it as needed
      throw new ReactionError("not-found", "Account not found");
    }
    // console.log("User Response :- ", UserData._id)
    const data = await sendResetPasswordOTP(context, email, UserData?._id);
    // console.log("Data: ", data)
    if (data) {
      return true;
    } else {
      return false;
    }
  },
  updatePasswordWithOTP,
  verifyEmailVerificationViaOTP,
};
