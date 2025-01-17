import ObjectID from "mongodb";
import ReactionError from "@reactioncommerce/reaction-error";
export default async function branchInfo(parent, args, context, info) {
    // console.log(parent)
    // console.log("Have Branch", parent.UserRole)
    if (parent) {
       if (parent.UserRole === 'dispatcher' || parent.UserRole === 'rider' ) {
        if (parent.branches) {
            const BranchID = parent.branches
            if (BranchID) {
                // console.log("BranchID", BranchID)
                const { BranchData } = context.collections;
                const branchDataResponse = await BranchData.find({ _id: { $in: BranchID.map(id => ObjectID.ObjectId(id)) } }).toArray();
                return branchDataResponse
            }
            else {
                return []
            }
        }
    }
    else {
        return []
    } 
    }
    else{
        return []
    }
    



}
