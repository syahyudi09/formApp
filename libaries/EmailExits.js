import User from "../model/user.js";

const EmailExits = async (email) => {
    const user = await User.findOne({email:email})
    if(user) { return true}
    return false
}

export default EmailExits;