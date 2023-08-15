import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyEmailVerificationViaOTP(
  parents,
  { input },
  context,
  info
) {
  const {
    collections: { users, Accounts },
  } = context;
  const { email, otp } = input;
  const UserData = await users.findOne({ "emails.address": email });
  if (!UserData) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
  const response = await context.mutations.verifyEmailVerificationViaOTP(
    context,
    input
  );
  return true;
}
