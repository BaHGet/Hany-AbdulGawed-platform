import React from 'react';
import {useAuth0} from "@auth0/auth0-react";

const LogoutBtn =({show})=>{
    const { logout } =useAuth0();

    const hendleLogOut = () =>{
        logout({ logoutParams: { returnTo: 'https://bahget.github.io/Hany-AbdulGawed-platform/#/Hany-AbdulGawed-platform/' } })
        localStorage.removeItem("userEmail")
        localStorage.removeItem("userName")
        localStorage.removeItem("userPicture")
        localStorage.removeItem("userPayingSystem")
        
    }
    return(<button onClick={hendleLogOut}>Log Out</button>);
}

export default LogoutBtn