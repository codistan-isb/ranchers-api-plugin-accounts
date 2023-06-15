import pkg from 'bcryptjs';
const { genSalt, hash } = pkg;
export const bcryptPassword = async (password) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
};