import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import { canCreateUser } from "../../util/canCreateUser.js";
import { decodeGroupOpaqueId } from "../../xforms/id.js";
import ReactionError from "@reactioncommerce/reaction-error";
/**
 * @name Query/accounts
 * @method
 * @memberof Accounts/GraphQL
 * @summary query the Accounts collection and return a list of accounts
 * @param {Object} _ - unused
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {String} [args.groupIds] - Array of group IDs
 * @param {Boolean} [args.notInAnyGroups] - Return accounts that aren't part of any groups
 * @param {Object} context - an object containing the per-request state
 * @param {Object} info Info about the GraphQL request
 * @returns {Promise<Object>} Promise containing queried accounts
 */
export default async function getAllPaginatedUsers(_, args, context, info) {
  const { searchQuery, ...connectionArgs } = args;
  if (
    context.user === undefined ||
    context.user === null ||
    context.user === ""
  ) {
    throw new ReactionError("access-denied", "Please Login First");
  }
  const { Accounts } = context.collections;
  const CurrentUserRole = context.user.UserRole;
  const CurrentUserBranch = context.user.branches;
  let matchStage = [];
  if (CurrentUserRole === "dispatcher") {
    matchStage.push({ riderID: riderID });
  }
  if (CurrentUserRole === "dispatcher") {
    const queryData = await Accounts.find({
      UserRole: { $ne: "customer", $exists: true },
      branches: CurrentUserBranch,
    }).sort({ createdAt: -1 });
    return getPaginatedResponse(queryData, connectionArgs, {
      includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
      includeHasPreviousPage: wasFieldRequested(
        "pageInfo.hasPreviousPage",
        info
      ),
      includeTotalCount: wasFieldRequested("totalCount", info),
    });
  }
  if (CurrentUserRole === "admin") {
    const queryData = await Accounts.find({
      UserRole: { $ne: "customer", $exists: true },
    }).sort({ createdAt: -1 });

    return getPaginatedResponse(queryData, connectionArgs, {
      includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
      includeHasPreviousPage: wasFieldRequested(
        "pageInfo.hasPreviousPage",
        info
      ),
      includeTotalCount: wasFieldRequested("totalCount", info),
    });
  } else {
    throw new ReactionError("access-denied", "User not allowed");
  }
}
