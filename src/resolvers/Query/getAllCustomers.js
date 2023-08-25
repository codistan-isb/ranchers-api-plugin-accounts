import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import { canCreateUser } from "../../util/canCreateUser.js";
import { decodeGroupOpaqueId } from "../../xforms/id.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function getAllCustomers(_, args, context, info) {
  let { collections, authToken, userId } = context;
  const { searchQuery, ...connectionArgs } = args;

  // console.log("CurrentUserRole ", CurrentUserRole);
  if (
    context.user === undefined ||
    context.user === null ||
    context.user === ""
  ) {
    throw new ReactionError("access-denied", "Please Login First");
  }
  const CurrentUserRole = context?.user?.UserRole;
  if (CurrentUserRole === "rider") {
    throw new ReactionError("access-denied", "Un authorized user");
  }

  const query = await context.queries.getAllCustomers(context, args);

  return getPaginatedResponse(query, connectionArgs, {
    includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
    includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
    includeTotalCount: wasFieldRequested("totalCount", info),
  });
}
