import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";
import config from "../config.js";
import generateOTPForResetPassword from "./generateOTPForResetPassword.js";

// const { REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL } = config;

/**
 * @method sendVerificationEmail
 * @summary Send an email with a link the user can use verify their email address.
 * @param {Object} context Startup context
 * @param {Object} input Input options
 * @param {String} input.userId - The id of the user to send email to.
 * @param {String} [input.bodyTemplate] Template name for rendering the email body
 * @returns {Job} - returns a sendEmail Job instance
 */

export default async function sendResetPasswordOTP(context, email, { bodyTemplate = "accounts/newEmail", userId }) {
    console.log("User ID", userId)
    // const { id } = context.user
    // if (userId === undefined) {
    //     userId = id
    // }
    const { otp, expirationTime } = await generateOTPForResetPassword();
    console.log(`Your OTP is: ${otp}`);
    console.log(`Expires at: ${new Date(expirationTime).toLocaleTimeString()}`);

    const {
        collections: { Accounts, Shops, users },
    } = context;
    const updateAccountResult = await users.updateOne(
        // { _id: userId },
        { "emails.address": email },

        { $set: { otp: otp, expirationTime: expirationTime } } // $set updates the fields with the new values
    );
    console.log("otp and expiry updated: ", updateAccountResult)

    // mutations: { startIdentityEmailVerification }
    //     mutations: { startIdentityEmailVerification }

    // if (typeof startIdentityEmailVerification !== "function") {
    //   throw new ReactionError("not-supported", "Password reset not supported");
    // }

    // const { email, token } = await startIdentityEmailVerification(context, { userId });
    const UserData = await users.findOne({ "emails.address": email })
    console.log("User Response :- ", UserData._id)
    const account = await Accounts.findOne({ _id: UserData._id });
    console.log("Account Resonse :-", account)
    if (!account) throw new ReactionError("not-found", "Account not found");

    // Account emails are always sent from the primary shop email and using primary shop
    // email templates.
    const shop = await Shops.findOne({ shopType: "primary" });
    if (!shop) throw new ReactionError("not-found", "Shop not found");

    const dataForEmail = {
        // Reaction Information
        contactEmail: _.get(shop, "emails[0].address"),
        homepage: _.get(shop, "storefrontUrls.storefrontHomeUrl", null),
        copyrightDate: new Date().getFullYear(),
        legalName: _.get(shop, "addressBook[0].company"),
        physicalAddress: {
            address: `${_.get(shop, "addressBook[0].address1")} ${_.get(shop, "addressBook[0].address2")}`,
            city: _.get(shop, "addressBook[0].city"),
            region: _.get(shop, "addressBook[0].region"),
            postal: _.get(shop, "addressBook[0].postal")
        },
        shopName: shop.name,
        // confirmationUrl: REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL.replace("TOKEN", token),
        confirmationUrl: otp,
        userEmailAddress: email,

    };
    const language = (account.profile && account.profile.language) || shop.language;

    // const EmailResponse = await context.mutations.sendEmail(context, {
    //   data: dataForEmail,
    //   fromShop: shop,
    //   templateName: bodyTemplate,
    //   language,
    //   to: email
    // });
    // console.log("Email Response :-", EmailResponse)


    return context.mutations.sendEmail(context, {
        data: dataForEmail,
        fromShop: shop,
        templateName: bodyTemplate,
        language,
        to: email
    });

}
