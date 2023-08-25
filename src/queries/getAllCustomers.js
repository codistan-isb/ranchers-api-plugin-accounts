export default async function getAllCustomers(context, args) {
  let { collections } = context;
  const { searchQuery } = args;

  const { Accounts } = collections;
  let matchStage = [];

  matchStage = [
    {
      $or: [{ UserRole: "customer" }, { UserRole: { $exists: false } }],
    },
  ];
  if (searchQuery) {
    const matchingRiderIDs = await collections.Accounts.distinct("_id", {
      $or: [
        {
          "emails.0.address": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "profile.firstName": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "profile.lastName": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "profile.phone": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          fullName: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
      ],
    });
    const matchingIDs = [...matchingRiderIDs];
    matchStage.push({
      _id: { $in: matchingIDs },
    });
  }
  //   console.log("searchQuery ", searchQuery);
  //   console.log("matchStage ", matchStage);
  return await Accounts.find({ $and: matchStage }).sort({
    createdAt: -1,
  });
}
