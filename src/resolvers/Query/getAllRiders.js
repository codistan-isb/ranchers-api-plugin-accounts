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
  // console.log("Current User Role : ", context.user);
  // console.log("Current User : ", context.user)
  if (CurrentUserRole === "admin") {
    const RiderAccounts = await Accounts.find({
      UserRole: "rider",
      // currentStatus: "online",
    }).toArray();
    if (RiderAccounts.length === 0) {
      throw new ReactionError("not-found", "No online rider found");
    }
    console.log("currentTime ", currentTime);
    // const dateTimeObj = new Date(currentTime);
    // const milliseconds = dateTimeObj.getTime();
    // console.log("thirtyMinutesInMilliseconds ", thirtyMinutesInMilliseconds);
    // console.log("milliseconds ", milliseconds);

    // const dateTimeObj1 = new Date(thirtyMinutesInMilliseconds);
    // console.log("milliseconds ", dateTimeObj1);
    // console.log("RiderAccounts ", RiderAccounts[0]);
    // const updatedRiderAccounts = RiderAccounts.map((rider) => {
    //   // if (rider.updatedAt) {
    //   //   console.log("Updated at time ", rider.updatedAt);
    //   //   console.log("Updated at getTime() ", rider.updatedAt.getTime());
    //   //   console.log("current time line ", new Date().getTime());
    //   //   console.log(
    //   //     "Diff ",
    //   //     new Date().getTime() - rider.updatedAt.getTime() <
    //   //       thirtyMinutesInMilliseconds
    //   //   );

    //   //   // console.log(
    //   //   //   "rider ",
    //   //   //   dateTimeObj.getTime() - rider.updatedAt.getTime()
    //   //   // );
    //   // }
    //   // let currentTImeDiff = currentTime - rider.updatedAt;
    //   // console.log("currentTImeDiff ", currentTImeDiff);
    //   // console.log(
    //   //   "currentTime - rider.updatedAt < thirtyMinutesInMilliseconds ",
    //   //   currentTImeDiff < thirtyMinutesInMilliseconds
    //   // );
    //   console.log("rider.updatedAt.getTime() ", rider.updatedAt?.getTime());
    //   console.log("new Date().getTime() ", new Date().getTime());
    //   var timeValue = new Date().getTime() - rider.updatedAt?.getTime();
    //   console.log("timeValue ", timeValue);
    //   console.log("!rider.updatedAt ", !rider.updatedAt);
    //   if (
    //     !rider.updatedAt ||
    //     timeValue < thirtyMinutesInMilliseconds
    //     // currentTime - rider.updatedAt < thirtyMinutesInMilliseconds
    //   ) {
    //     rider.currentStatus = "offline";
    //   }
    //   return rider;
    // });
    // console.log("updatedRiderAccounts ", updatedRiderAccounts);
    return RiderAccounts;
  } else {
    if (branches) {
      branchIds = Array.isArray(branches) ? branches : [branches];
    } else {
      branchIds = Array.isArray(CurrentUserBranch)
        ? CurrentUserBranch
        : [CurrentUserBranch];
    }
    // console.log("branchIds: ", branchIds)
    // if (CurrentUserRole != 'rider') {
    // if (CurrentUserRole === "dispatcher" || CurrentUserRole === "admin") {
    const RiderAccounts = await Accounts.find({
      UserRole: "rider",
      branches: { $in: branchIds },
      // currentStatus: "online",
      currentStatus: { $ne: "offline" },
    }).toArray();
    // console.log(RiderAccounts)
    if (RiderAccounts.length === 0) {
      throw new ReactionError("not-found", "No online rider found");
    }
    // const updatedRiderAccounts = RiderAccounts.map((rider) => {
    //   // Check if updatedAt is null or less than 5 minutes from the current time
    //   if (
    //     !rider.updatedAt ||
    //     currentTime - rider.updatedAt < thirtyMinutesInMilliseconds
    //   ) {
    //     rider.currentStatus = "offline";
    //   }
    //   return rider;
    // });
    // console.log("RiderAccounts ", RiderAccounts);
    // return updatedRiderAccounts;
    return RiderAccounts;
  }
}
