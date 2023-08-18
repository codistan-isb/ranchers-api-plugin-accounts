import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyAccountEmail(context, args) {
  const { users, Accounts } = context.collections;
  try {
    await Accounts.updateMany({}, { $set: { "emails.0.verified": true } });
    await users.updateMany({}, { $set: { "emails.0.verified": true } });
    return {
      success: true,
      message: "Email verification status updated successfully.",
    };
  } catch (error) {
    console.error("Error updating email verification status:", error);
    return {
      success: false,
      message: "An error occurred while updating email verification status.",
    };
  }
}
