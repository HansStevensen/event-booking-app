import { Navigate } from "react-router-dom";

export default function AdminRoutes({children}: any){
    const role = localStorage.getItem('role');
    
    if(role !== 'admin'){
        return <Navigate to="/login" replace/>
    }

    return children;
}