import ObjectID from "mongodb";

export default async function branchInfo(parent, args, context, info) {
    const BranchID = parent.branches[0]
    const { BranchData } = context.collections;
    const branchData = await BranchData.findOne({ _id: ObjectID.ObjectId(BranchID) });
    if (!branchData) {
        throw new Error('Branch not found');
    }
    return branchData
}
