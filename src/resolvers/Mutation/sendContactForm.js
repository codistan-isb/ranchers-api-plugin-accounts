import ReactionError from "@reactioncommerce/reaction-error";

export default async function sendContactForm(_, { name, email, phoneNumber, message }, context, info) {
    // console.log(context)
    const {
        collections: { Shops },
    } = context;
    const shop = await Shops.findOne({ shopType: "primary" });
    console.log(shop)
    if (!shop) throw new ReactionError("not-found", "Shop not found");

    const emailBody = `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`;
    console.log("emailBody:- ", emailBody)
    // const dataForEmail = _.get(shop, "emails[0].address");

    console.log("shop email:- ", shop.emails[0].address)
    const sendEmailResult = await context.mutations.sendEmail(context, {
        to: shop.emails[0].address,
        data: emailBody,
        subject: "Contact Form Submission",
        fromShop: shop,
    })
    // const sendEmailResult = await dataSources.reaction.sendEmail(email, "Contact Form Submission", emailBody);
    console.log("sendEmailResult:- ", sendEmailResult)
    if (sendEmailResult) {
        return true;
    } else {
        throw new ReactionError("Failed", "Failed to send email. Try again later");
    }
}