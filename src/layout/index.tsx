import React from "react";
import { Outlet } from "react-router-dom";

const IndexLayout = () => {
    return (
        <div className="app-container">
            <Outlet />
        </div>
    );
};

export default IndexLayout;
