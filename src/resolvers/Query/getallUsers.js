import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import { canCreateUser } from "../../util/canCreateUser.js";
import { decodeGroupOpaqueId } from "../../xforms/id.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function getallUsers(_, args, context, info) {
  // console.log(context.collections);
  // console.log(args);
  // console.log(context.user);
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
    })
      .sort({ createdAt: -1 })
      .toArray();
    return queryData;
  }
  if (CurrentUserRole === "admin") {
    const queryData = await Accounts.find({ UserRole: { $ne: "customer" } })
      .sort({ createdAt: -1 })
      .toArray();
    return queryData;
  } else {
    throw new ReactionError("Authentication Error", "Login First");
  }
}
