"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.authLogin = exports.authSignup = void 0;
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSignup = async (data, session) => {
    const { email, mobile } = data;
    const existUser = await auth_model_1.authModel.findOne({
        $or: [{ email }, { mobile }]
    });
    if (existUser)
        throw new Error("User already exists with this email or mobile");
    const payload = {
        fullname: data.fullname,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: data.role
    };
    const user = await auth_model_1.authModel.create([payload], { session });
    return user;
};
exports.authSignup = authSignup;
const authLogin = async (data) => {
    const { email, password } = data;
    const user = await auth_model_1.authModel.findOne({ email });
    if (!user)
        throw new Error("Invalid User pleace try Again");
    const isMatchPaaword = await bcrypt_1.default.compare(password, user.password);
    if (!isMatchPaaword)
        throw new Error("Invalid email or password");
    const payload = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        mobile: user.mobile,
        role: user.role
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
    };
};
exports.authLogin = authLogin;
const logout = async () => {
    try {
        return {
            message: "Logout successful",
        };
    }
    catch (error) {
        throw error;
    }
};
exports.logout = logout;
