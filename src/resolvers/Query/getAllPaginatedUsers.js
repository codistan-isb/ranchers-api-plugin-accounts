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
  // console.log(context.collections);
  // console.log(args);
  // console.log(context.user);
  const { ...connectionArgs } = args;
  if (
    context.user === undefined ||
    context.user === null ||
    context.user === ""
  ) {
    throw new ReactionError("Authentication Error", "Login First");
  }
  // console.log(context.user)
  const { Accounts } = context.collections;
  const CurrentUserRole = context.user.UserRole;
  const CurrentUserBranch = context.user.branches;
  // console.log(CurrentUserRole)
  if (CurrentUserRole === "dispatcher") {
    const queryData = await Accounts.find({
      UserRole: { $ne: "customer" },
      branches: CurrentUserBranch,
    }).sort({ createdAt: -1 });
    // .toArray();
    // console.log("dispatcher queryData", queryData);
    // return queryData;
    return getPaginatedResponse(queryData, connectionArgs, {
      includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
      includeHasPreviousPage: wasFieldRequested(
        "pageInfo.hasPreviousPage",
        info
      ),
      includeTotalCount: wasFieldRequested("totalCount", info),
    });
  }
  // const UserPermissionResp = canCreateUser(context.user.userRole.toLowerCase())
  // console.log(UserPermissionResp)
  if (CurrentUserRole === "admin") {
    const queryData = await Accounts.find({
      UserRole: { $ne: "customer" },
    }).sort({ createdAt: -1 });
    // .toArray();
    // console.log("admin queryData", queryData);
    // return queryData;
    return getPaginatedResponse(queryData, connectionArgs, {
      includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
      includeHasPreviousPage: wasFieldRequested(
        "pageInfo.hasPreviousPage",
        info
      ),
      includeTotalCount: wasFieldRequested("totalCount", info),
    });
  } else {
    throw new ReactionError("Authentication Error", "Login First");
  }

  // const { groupIds: opaqueGroupIds, notInAnyGroups, ...connectionArgs } = args;

  // let groupIds;
  // if (opaqueGroupIds) {
  //     groupIds = opaqueGroupIds.map((opaqueGroupId) => decodeGroupOpaqueId(opaqueGroupId)); { groupIds, notInAnyGroups }
  // }

  // const query = await context.queries.accounts(context);
  // console.log(query)
  // return getPaginatedResponse(query, connectionArgs, {
  //     includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
  //     includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
  //     includeTotalCount: wasFieldRequested("totalCount", info)
  // });
}
