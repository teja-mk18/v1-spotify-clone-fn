import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- FIXED
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
// Remove: import { Navbar } from "../components/navbar";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // <-- FIXED

    const handleRegister = async () => {
        try {
            if (!email || !password) {
                ErrorToast("Email & password are required!");
                return;
            }

            const dataObj = {
                email,
                password,
            };

            const result = await axiosInstance.post("/auth/login", dataObj);

            if (result.status === 200) {
                SuccessToast(result.data.message);
                window.open("/", "_self");
            } else {
                ErrorToast(result.data.message);
            }
        } catch (err) {
            ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
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
                    <h2 className="text-xl font-semibold text-white mb-2">Login to your account</h2>
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
                                autoComplete="current-password"
                            />
                        </div>
                        <button
                            className="w-full py-2 mt-2 rounded-lg text-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition shadow"
                            onClick={handleRegister}
                        >
                            Login
                        </button>
                    </div>
                    <p className="text-neutral-400 text-sm mt-2">Don't have an account?{' '}
                        <Link to="/signup" className="text-green-400 hover:underline">Signup here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { LoginPage };