import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // ❌ 未登录
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // ❌ 不是admin
    if (role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    // ✅ 通过
    return <Outlet />;
}