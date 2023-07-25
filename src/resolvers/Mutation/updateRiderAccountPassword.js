import ReactionError from "@reactioncommerce/reaction-error";
import { bcryptPassword } from "../../util/encryption.js";
import _ from "lodash";

export default async function updateRiderAccountPassword(
  parent,
  { input },
  context,
  info
) {
  console.log("New Password:- ", input);

  // console.log("otp:- ", typeof (parseInt(otp)))
  const { users, Accounts, Shops } = context.collections;
  if (
    context.user === undefined ||
    context.user === null ||
    context.user === ""
  ) {
    throw new ReactionError("access-denied", "please login first");
  }
  const { newPassword, passwordString, riderId, riderEmail } = input;
  const now = new Date();
  const UserData = await users.findOne({ "emails.address": riderEmail });
  if (!UserData) {
    // The user document does not exist, throw an error or handle it as needed
    throw new ReactionError("not-found", "Account not found");
  }
  console.log("User Response :- ", UserData);
  const UserID = UserData._id;
  const hashedPass = await bcryptPassword(newPassword);
  console.log("hashedPass :- ", hashedPass);
  const userUpdate = await users.updateOne(
    { _id: UserID },
    { $set: { "services.password.bcrypt": hashedPass, updatedAt: now } }
  );
  console.log("userUpdate ", userUpdate);
  const shop = await Shops.findOne({ shopType: "primary" });
  if (!shop) throw new ReactionError("not-found", "Shop not found");

  const dataForEmail = {
    // Reaction Information
    contactEmail: _.get(shop, "emails[0].address"),
    homepage: _.get(shop, "storefrontUrls.storefrontHomeUrl", null),
    copyrightDate: new Date().getFullYear(),
    legalName: _.get(shop, "addressBook[0].company"),
    physicalAddress: {
      address: `${_.get(shop, "addressBook[0].address1")} ${_.get(
        shop,
        "addressBook[0].address2"
      )}`,
      city: _.get(shop, "addressBook[0].city"),
      region: _.get(shop, "addressBook[0].region"),
      postal: _.get(shop, "addressBook[0].postal"),
    },
    shopName: shop.name,
    // confirmationUrl: REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL.replace("TOKEN", token),
    confirmationUrl: passwordString,
    userEmailAddress: riderEmail,
  };
  console.log("dataForEmail ", dataForEmail);
  const account = await Accounts.findOne({ _id: UserData._id });
  const bodyTemplate = "accounts/newPassword";
  const language =
    (account.profile && account.profile.language) || shop.language;
  const webEmail = await context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop: shop,
    templateName: bodyTemplate,
    language,
    to: riderEmail,
  });
  console.log("webEmail ", webEmail);
  if (webEmail) {
    return true;
  } else {
    return null;
  }
}
