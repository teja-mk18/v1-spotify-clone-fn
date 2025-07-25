import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- FIXED
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
// Remove: import { Navbar } from "../components/navbar";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (isOtpSent) {
            try {
                if (!email || !password || !otp) {
                    ErrorToast("Email, password & otp are required!");
                    return;
                }

                const dataObj = {
                    email,
                    password,
                    otp,
                };

                const result = await axiosInstance.post("/auth/signup", dataObj);

                if (result.status === 201) {
                    SuccessToast(result.data.message);
                    navigate("/login");
                } else {
                    ErrorToast(result.data.message);
                }
            } catch (err) {
                ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
            }
        } else {
            ErrorToast(`Cannot signup before sending otp`);
        }
    };

    const handleSendOtp = async () => {
        try {
            const resp = await axiosInstance.post("/auth/send-otp", {
                email,
            });
            if (resp.data.isSuccess) {
                SuccessToast(resp.data.message);
                setIsOtpSent(true);
            } else {
                SuccessToast(resp.data.message);
            }
        } catch (err) {
            console.log(err);
            ErrorToast(`Cannot send otp: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Remove: <Navbar /> */}
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md p-8 flex flex-col items-center gap-6 bg-[#181818] border border-neutral-800 rounded-xl shadow-lg animate-fade-in">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <img src="/Spotify_Primary_Logo_RGB_Green.png" alt="Spotify Logo" className="h-12 drop-shadow-lg" />
                        <span className="text-2xl font-bold text-white tracking-wide">Spotify Clone</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Create your account</h2>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-neutral-300 text-sm" htmlFor="user-email">Email</label>
                            <input
                                id="user-email"
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                autoComplete="email"
                            />
                        </div>
                        {isOtpSent && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-neutral-300 text-sm" htmlFor="user-otp">OTP</label>
                                    <input
                                        id="user-otp"
                                        type="text"
                                        name="otp"
                                        required
                                        className="bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-neutral-300 text-sm" htmlFor="user-password">Password</label>
                                    <input
                                        id="user-password"
                                        type="password"
                                        name="password"
                                        required
                                        className="bg-zinc-900 border border-zinc-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </>
                        )}
                        <button
                            className="w-full py-2 mt-2 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition shadow"
                            onClick={isOtpSent ? handleRegister : handleSendOtp}
                        >
                            {isOtpSent ? 'Register' : 'Send OTP'}
                        </button>
                    </div>
                    <p className="text-neutral-400 text-sm mt-2">Already have an account?{' '}
                        <Link to="/login" className="text-green-400 hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { SignupPage };
