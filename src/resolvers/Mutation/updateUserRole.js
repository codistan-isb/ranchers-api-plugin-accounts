export default async function updateUserRole(parent, args, context, info) {
    console.log(args)
    console.log(context.user.UserRole)
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
            const { users } = context.collections;
            const { UserRole, userId } = args
            const lowercaseUserRole = UserRole.toLowerCase();
            const updateOneresult = await users.updateOne(
                { _id: userId },
                { $set: { UserRole: lowercaseUserRole } }
            );
            console.log(updateOneresult.modifiedCount)
            if (updateOneresult.modifiedCount === 1) {
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
