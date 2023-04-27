import ObjectID from "mongodb";
import ReactionError from "@reactioncommerce/reaction-error";
export default async function branchInfo(parent, args, context, info) {
    // console.log(parent)

    if (parent.branches) {
        // console.log("Have Branch")
        const BranchID = parent.branches
        // console.log("BranchID", BranchID)
        const { BranchData } = context.collections;
        const branchDataResponse = await BranchData.find({ _id: { $in: BranchID.map(id => ObjectID.ObjectId(id)) } }).toArray();
        // console.log("Branch Data : ", branchDataResponse)
        // if (!branchDataResponse) {
        //     throw new ReactionError("Branch not found");
        // }
        return branchDataResponse
    }
    else {
        console.log("No Branch")
        // return []
    }


}
