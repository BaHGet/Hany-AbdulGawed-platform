import * as React from 'react';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import logoCroped from '../photos/logo croped.png'
import LoginBtn from '../Essential/login'
import LogoutBtn from '../Essential/logout'
import ErrorPopup from '../Essential/ErrorPopup.jsx';
require('../../utilities/console.js');

const Header = ({user,show,currentUser,userPayingSystem,isAdmin, redirect_url}) =>{
    
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const StyledMenu = styled((props) => (
        <Menu
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          {...props}
        />
      ))(() => ({
        '& .css-6hp17o-MuiList-root-MuiMenu-list': {
            display:'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(90px)'
        },
        '& .css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
            margin:'auto'
        },
        '& .css-1x7jfmm-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
            borderRadius:'10px',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(90px)'
            
        },
      }));

    const navber_name =[
        {
            'id' :0,
            'EngName' : '#main',
            'arbicName' : 'الرئيسية'
        },
        
        {
            'id' :2,
            'EngName' : '#payingsystem',
            'arbicName' : 'نظام اشتراكك'
        },
        {
            'id' :3,
            'EngName' : '#help',
            'arbicName' : 'مساعدة'
        },
        {
            'id' :4,
            'EngName' : '#admin',
            'arbicName' : 'admin'
        },
        {
            'id' :5,
            'EngName' : '#account',
            'arbicName' : 'حسابي',
            'dropDown' : [
                {
                    'id' :0,
                    'EngName' : '#profile',
                    'arbicName' : 'صفحتي الشخصيه',
                },
                {
                    'id' :1,
                    'EngName' : '#payingsystem',
                    'arbicName' : ':نوع الاشتراك',
                },
                {
                    'id' :3,
                    'EngName' : '#logout',
                    'arbicName' : 'تسجيل الخروج',
                }
            ]
        }
    ]
    return(
        <>
            <header>
                <img id='logo' src={logoCroped} alt='logo' />
                {
                    redirect_url === 'http://localhost:3000/' ?
                    <h1>change redirect url</h1>
                    :
                    ''
                }
                
                <ul className='nav-bar'>
                    {navber_name.map((obj) =>{
                        if(obj.id ===5){
                            if(currentUser.name !=='' || user){
                                return(  
                                    <div>
                                        <Button
                                            id="fade-button"
                                            aria-controls={open ? 'fade-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                            className='dropdown-span'
                                        >
                                            حسابي
                                        </Button>
                                        <StyledMenu
                                            id="demo-customized-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'demo-customized-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            >
                                            <MenuItem onClick={handleClose}>
                                                <div key={'dropdown-menu-info'} className='dropdown-menu-info'>
                                                    <img src={currentUser.picture} alt='profile'/>
                                                    <h2 className='dropdownitem-user-name' key={'dropdonwitem'}>{currentUser.name}</h2>
                                                </div>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <p className={'dropdonwitem'} key={'dropdonwitem'}>{
                                                    userPayingSystem === undefined ||  userPayingSystem ==='none' ||  userPayingSystem ===null || userPayingSystem.length === 0?
                                                    'غير محدد'
                                                    :
                                                    userPayingSystem + ':نوع الاشتراك'
                                                }</p>
                                            </MenuItem>
                                            <MenuItem >
                                                    <button onClick={() => {setOpenError(true); setAnchorEl(null);}}>
                                                        الأبلاغ عن مشكلة
                                                    </button>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}><LogoutBtn redirect_url={redirect_url}/></MenuItem>
                                        </StyledMenu>
                                    </div> 
                                )
                            }else{
                                return(<LoginBtn />)   
                            }
                        }else{
                                if(obj.EngName ==='#main'){
                                    return(<li className={'item'+obj.id} key={'item'+obj.id}>
                                    <Link to={'/Hany-AbdulGawed-platform/'}>{obj.arbicName}</Link>
                                    </li>)
                                }
                                if(obj.EngName ==='#payingsystem'){
                                    return(<li className={'item'+obj.id} key={'item'+obj.id}>
                                    <Link to={'/Hany-AbdulGawed-platform/PayingSystem'}>{obj.arbicName}</Link>
                                    </li>)
                                }
                                if(obj.EngName ==='#admin'){
                                    return(
                                        isAdmin ?
                                        <li className={'item'+obj.id} key={'item'+obj.id}>
                                            <Link to={'/dashboard'}>{obj.arbicName}</Link>
                                            </li>
                                        :
                                        ''
                                    )
                                }
                            }
                        })}
                </ul>
            </header>
            {
                openError && 
                <ErrorPopup isShown={openError} setIsShown={setOpenError}/>
            }
        </>
    )
}

export default Header;