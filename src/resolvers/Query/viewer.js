import optimizeIdOnly from "@reactioncommerce/api-utils/graphql/optimizeIdOnly.js";
import ReactionError from "@reactioncommerce/reaction-error";
/**
 * @name Query/viewer
 * @method
 * @memberof Accounts/GraphQL
 * @summary query the Accounts collection and return user account data for the current user
 * @param {Object} _ - unused
 * @param {Object} __ - unused
 * @param {Object} context - an object containing the per-request state
 * @param {Object} info - an object of all arguments that were sent by the client
 * @returns {Object} user account object
 */
export default async function viewer(_, __, context, info) {
  if (!context.accountId) throw new ReactionError("access-denied", "please login first");
  // console.log(context.queries.userAccount)
  // console.log()
  const Data_Viewer = await optimizeIdOnly(context.accountId, info, context.queries.userAccount)(context, context.accountId)
  // console.log(Data_Viewer)
  return optimizeIdOnly(context.accountId, info, context.queries.userAccount)(context, context.accountId);
}
