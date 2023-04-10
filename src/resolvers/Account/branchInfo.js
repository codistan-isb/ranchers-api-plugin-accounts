import ObjectID from "mongodb";

export default async function branchInfo(parent, args, context, info) {
    const BranchID = parent.branches
    console.log("BranchID", BranchID)
    const { BranchData } = context.collections;
    const branchDataResponse = await BranchData.find({ _id: { $in: BranchID.map(id => ObjectID.ObjectId(id)) } }).toArray();

    // const branchDataResponse = await BranchData.find({ _id: ObjectID.ObjectId(BranchID) }).toArray();
    console.log("Branch Data : ", branchDataResponse)
    // if (!branchDataResponse) {
    //     throw new Error('Branch not found');
    // }

    return branchDataResponse
    // return {
    //     name: branchDataResponse.name,
    //     address: branchDataResponse.address,
    //     phoneNumber1: branchDataResponse.phoneNumber1,
    //     phoneNumber2: branchDataResponse.phoneNumber2,
    //     phoneNumber3: branchDataResponse.phoneNumber3,
    //     latitude: branchDataResponse.Latitude,
    //     longitude: branchDataResponse.Longitude,
    //     city: branchDataResponse.City,
    //     description: branchDataResponse.Description,
    //     sector: branchDataResponse.Sector,
    //     timing: branchDataResponse.Timing,
    //     deliveryArea: branchDataResponse.deliveryArea,
    // }
}
