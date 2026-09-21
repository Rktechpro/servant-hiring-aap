import id from "zod/v4/locales/id.js";
import { LoginInput, SignupInput } from "./auth.dto";
import { authModel } from "./auth.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const authSignup = async (data: SignupInput) => {
    const { email, mobile } = data;

    const existUser = await authModel.findOne({
        $or: [{ email }, { mobile }]
    })

    if (existUser)
        throw new Error("User already exists with this email or mobile")

    const payload = {
        fullname: data.fullname,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: data.role
    }
    const user = await authModel.create(payload)
    return user
}
export const authLogin = async (data: LoginInput) => {
    const { email, password } = data
    const user = await authModel.findOne({ email })
    if (!user)
        throw new Error("Invalid User pleace try Again")

    const isMatchPaaword = await bcrypt.compare(password, user.password)
    if (!isMatchPaaword)
        throw new Error("Invalid email or password");

    const payload = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        mobile: user.mobile,
        role: user.role
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SCREAT!, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            mobile: user.mobile,
            role: user.role
        }
    }
}