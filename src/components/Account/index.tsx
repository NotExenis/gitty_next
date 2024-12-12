import React from 'react';
import {VscAccount} from "react-icons/vsc";

const Account: React.FC = () => {
    // Determine the Icon component to use based on the `image` prop

    return (
        <div>
            <div className="text-white"></div>
            <VscAccount></VscAccount>
        </div>
    );
};

export default Account;