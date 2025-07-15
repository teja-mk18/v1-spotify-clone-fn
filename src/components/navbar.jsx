import { Link } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";

const Navbar = () => {
    const { user = {} } = useAppContext();

    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            //todo
            window.location.reload();
        } catch (err) {
            // todo
        }
    };

    return (
        <div className="p-6 flex items-center justify-between bg-amber-200">
            <div>My App</div>
            <div></div>
            <div className="flex gap-4 ">
                <Link to="/">Home</Link>
                {!isAuthenticated ? (
                    <div className="flex gap-4 items-center">
                        <Link to="/login" className="text-blue-500 underline">
                            Login
                        </Link>
                        <Link to="/signup" className="text-blue-500 underline">
                            Signup
                        </Link>
                    </div>
                ) : (
                    <>
                        <button
                            className="py-1 px-2 border-1 border-blue-600 bg-blue-200 rounded-md"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <p>{user?.email}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export { Navbar };
