export default async function updateUserRole(parent, args, context, info) {
    console.log(args)
    // console.log(context.user.UserRole)
    // console.log(context.collections)
    if (
        context.user === undefined ||
        context.user === null ||
        context.user === ""
    ) {
        throw new Error("Unauthorized access. Please login first");
    }
    if (context.user.UserRole !== 'admin') {
        throw new Error("Unauthorized");
    }
    else {
        try {
            const { users, Accounts } = context.collections;
            const { UserRole, userId } = args
            // console.log(userId)
            const lowercaseUserRole = UserRole.toLowerCase();
            const updateOneresult = await users.findOneAndUpdate(
                { _id: userId },
                { $set: { UserRole: lowercaseUserRole } }
            );
            console.log("update One result ", updateOneresult.ok)

            const updateAccountsresult = await Accounts.findOneAndUpdate(
                { _id: userId },
                { $set: { UserRole: lowercaseUserRole } }
            );
            console.log("update Accounts result ", updateAccountsresult.ok)
            if (updateOneresult.ok === 1 && updateAccountsresult.ok === 1) {
                // const updatedUser = await users.findOne({ _id: userId });
                // console.log(updatedUser)
                return true;
            }
            else {
                return false
            }
            // throw new Error(`Failed to update user role for userId: ${userId}`);
        } catch (error) {
            throw new Error(`Failed to update user role: ${error.message}`);
        }
    }
}
