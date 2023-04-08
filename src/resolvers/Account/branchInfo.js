import ObjectID from "mongodb";

export default async function branchInfo(parent, args, context, info) {
    const BranchID = parent.branches[0]
    const { BranchData } = context.collections;
    const branchDataResponse = await BranchData.findOne({ _id: ObjectID.ObjectId(BranchID) });
    console.log("Branch Data ", branchDataResponse)
    // if (!branchDataResponse) {
    //     throw new Error('Branch not found');
    // }
    return branchDataResponse
}
