import ReactionError from "@reactioncommerce/reaction-error";

export default async function updatePasswordWithOTP(parent, { otp, newPassword }, context, info) {
    console.log(newPassword)
    console.log(otp)
    console.log("Login User Details: ", context.userId)
    const {
        users,
    } = context.collections;
    // console.log("context.collections", context.collections)
    if (!context.userId) {
        throw new ReactionError("access-denied", "Please Login First");
    }
    const { userId: UserID } = context
    // if (!id) {
    //     id = "64195b188a75120149ddc0c0"
    // }
    console.log(UserID);
    const accountResp = await users.findOne({ _id: UserID });
    // const accountResp1 = await users.findOneAndUpdate({
    //     query: { _id: UserID },
    //     update: {
    //         $pull: {
    //             'services.password.reset': {
    //                 token: otp,
    //                 when: { $lt: new Date().getTime() },
    //                 when: { $lt: new Date(accountResp.expirationTime).getTime() },
    //             },
    //         },
    //         $set: {
    //             'services.password.bcrypt': newPassword,
    //         },
    //     },
    //     new: true,
    // });
    // const accountResp1 = await users.findOneAndUpdate(
    //     { _id: UserID },
    //     {
    //         $pull: {
    //             'services.password.reset': {
    //                 token: otp,
    //                 when: { $lt: new Date().getTime() },
    //                 when: { $lt: new Date(accountResp.expirationTime).getTime() },
    //             },
    //         },
    //         $set: {
    //             'services.password.bcrypt': newPassword,
    //         },
    //     },
    //     { new: true }
    // );
    console.log("account Resp : ", accountResp)
    console.log("Expiry Time :- ", new Date(accountResp.expirationTime))
    console.log("Current TIme :- ", new Date())
    console.log("OTP :- ", accountResp.otp)
    const expirationTime = new Date(accountResp.expirationTime).getTime();
    const currentTime = new Date().getTime();
    if (expirationTime > currentTime) {
        console.log('The expiration time is in the future.');
        const userUpdate = await users.updateOne(
            { _id: UserID },
            { $set: { "services.password": newPassword } }
        );
        console.log(userUpdate)
    } else {
        throw new ReactionError("Invalid OTP", "OTP is expired.");
    }






    // if (accountResp) {
    //     const resetObj = accountResp.services.password.reset.find((obj) => obj.token === otp && obj.when < Date.now());
    //     console.log("reset Obj:- ", resetObj)
    // }
}
