import {React, useState, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom'
import './App.css';
import Header from './components/header'
import Main from './components/main'
import Lectures from './components/lectures'
import SpatialEngineering from './components/spatialEngineering'
import Algebra from './components/Algebra'
import Calculus from './components/Calculus'
import Revisiones from './components/Revisiones'
import Dynamics from './components/Dynamics'
import Statics from './components/Statics'
import LessonPlayer from './components/lessonPlayer'
import SetPayingSystem from './components/SetPayingSystem'
import * as Api from './API/UesrApi'
import {useAuth0} from "@auth0/auth0-react";


function App() {
  const [currentUser, setCurrentUser] = useState({
    'name':'',
    'email':'',
    'picture':'',
    'payingSystem':''
  });
  const[userCodes, setUserCodes] = useState()

  
  const [userPayingSystem, setPayingSystem] = useState('');
  const [videoId, setVideoId] = useState('');
  const [userExist, setUserExist] = useState(false);
  const {user} = useAuth0();

  const name=localStorage.getItem("userName")
  const email=localStorage.getItem("userEmail")


  const handleUserexist = async (email)=>{
    // Check if the user on server side exist or not
    let checkUserExist;
    checkUserExist = await Api.getSpecific(email)
    
    setTimeout(()=>{
        if(checkUserExist.message !== "Account isn't exist"){
          localStorage.setItem("ServerToken", 'exist')
          setUserExist(true)
          localStorage.setItem("userPayingSystem", checkUserExist.payingSystem)
        
        if(checkUserExist.payingSystem !==''){
          setPayingSystem(checkUserExist.payingSystem)
        }
        }else{
          localStorage.setItem("ServerToken", 'isn`t exist')
          handelUserCreation()
        }
    }, 100)

  }

  const handelUserCreation = async () =>{   
    await Api.createUser(name,email,userPayingSystem)
    .then(res => {
      if(res.message === 'account created!'){
        localStorage.setItem("ServerToken", 'exist')
      }
    })

  }
  const handelUserUpdating = async (value) =>{
    if(userExist){
      await Api.updateUserPayingsystem(email,value)
    }
  }
  
  useEffect(()=>{
    if(user){
        localStorage.setItem("userEmail", user.email)
        localStorage.setItem("userName", user.name)
        localStorage.setItem("userPicture", user.picture)
        setCurrentUser({
            'name':user.name,
            'email':user.email,
            'picture':user.picture,
            'payingSystem':userPayingSystem||localStorage.getItem("userPayingSystem") 
        })
        handleUserexist(user.email);   
    }
    else{
      if(localStorage.getItem("userName")){
        setCurrentUser({
            'name':localStorage.getItem("userName"),
            'email':localStorage.getItem("userEmail"),
            'picture':localStorage.getItem("userPicture"),
            'payingSystem':userPayingSystem||localStorage.getItem("userPayingSystem") 
        })
        handleUserexist(localStorage.getItem("userEmail"));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentUser.email, user, userExist])

  // fetch user available codes
  useEffect(()=>{
    let payingSystem = localStorage.getItem("userPayingSystem");
    if(currentUser){
      if(currentUser.email){
          if(payingSystem === "LPS" || payingSystem === "MPS"){
            const fetchUserAvailableCodes = async() => {  
                let res = await Api.getAvailableCodes((currentUser.email)).then(data => {return data})
                setUserCodes(res)
            }
            fetchUserAvailableCodes()
          }
      }
    }
},[user, userPayingSystem])

  return(
    <div>
      <Header  user={user}  currentUser={currentUser} userPayingSystem={userPayingSystem}/>
      <Routes>
        <Route path='/Hany-AbdulGawed-platform' exact  element={
          <div>
            <Main />
            <Lectures  />
          </div>
        }/>
        <Route path='/' element={
          <div>
            <Main />
            <Lectures />
          </div>
        }/>
        <Route path='/Hany-AbdulGawed-platform/spatialEngineering' element={
          <SpatialEngineering setVideoId={setVideoId} user={email} userPayingSystem={userPayingSystem} />
        }/>
        <Route path='/Hany-AbdulGawed-platform/Algebra' element={
          <Algebra setVideoId={setVideoId} user={email} userPayingSystem={userPayingSystem} userCodes={userCodes} setUserCodes={setUserCodes} />
        }/>
        <Route path='/Hany-AbdulGawed-platform/Calculus' element={
          <Calculus  />
        }/>
        <Route path='/Hany-AbdulGawed-platform/Dynamics' element={
          <Dynamics  />
        }/>
        <Route path='/Hany-AbdulGawed-platform/Statics' element={
          <Statics  />
        }/>
        <Route path='/Hany-AbdulGawed-platform/Revisiones' element={
          <Revisiones  />
        }/>
        <Route path={`/Hany-AbdulGawed-platform/lessonView`} element={
          <LessonPlayer videoId={videoId} />
        }/>
        <Route path={`/Hany-AbdulGawed-platform/PayingSystem`} element={
          <SetPayingSystem user={email} handelUserUpdating={handelUserUpdating}  userPayingSystem={userPayingSystem}/>
        }/>
      </Routes>

    </div>
  )
  
}

export default App;