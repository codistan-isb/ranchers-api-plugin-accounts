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
export default async function getAllRiders(_, args, context, info) {
  if (
    context.user === undefined ||
    context.user === null ||
    context.user === ""
  ) {
    throw new ReactionError("access-denied", "Please Login First");
  }
  // console.log("Current User Role : ", context.user);
  let { branches } = args;
  const { id } = context.user;
  const { Accounts } = context.collections;
  const CurrentUserRole = context.user.UserRole;
  const CurrentUserBranch = context.user.branches;
  let branchIds;
  const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds
  const currentTime = new Date();
  if (CurrentUserRole === "admin") {
    const RiderAccounts = await Accounts.find({
      UserRole: "rider",
      // currentStatus: "online",
    }).toArray();
    if (RiderAccounts.length === 0) {
      throw new ReactionError("not-found", "No online rider found");
    }
    console.log("currentTime ", currentTime);
    return RiderAccounts;
  } else {
    if (branches) {
      branchIds = Array.isArray(branches) ? branches : [branches];
    } else {
      branchIds = Array.isArray(CurrentUserBranch)
        ? CurrentUserBranch
        : [CurrentUserBranch];
    }
    const RiderAccounts = await Accounts.find({
      UserRole: "rider",
      branches: { $in: branchIds },
      // currentStatus: "online",
      currentStatus: { $ne: "offline" },
    }).toArray();
    if (RiderAccounts.length === 0) {
      throw new ReactionError("not-found", "No online rider found");
    }
    return RiderAccounts;
  }
}
