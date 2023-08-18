import ReactionError from "@reactioncommerce/reaction-error";

export default async function verifyAccountEmail(parents, args, context, info) {
  const accountsResp = await context.mutations.verifyAccountEmail(
    context,
    args
  );
  //   console.log("accountsResp", accountsResp);
  return accountsResp;
}
