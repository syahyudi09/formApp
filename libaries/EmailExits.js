import User from "../model/UserModel.js";

const EmailExits = async (email) => {
    const user = await User.findOne({email:email})
    if(user) { return true}
    return false
}

export default EmailExits;