import { React, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Main/header";
import Main from "./components/Main/main";
import Lectures from "./components/Main/lectures";
import SpatialGeomatry from "./components/Branches/SpatialGeomatry";
import Algebra from "./components/Branches/Algebra";
import Calculus from "./components/Branches/Calculus";
import Revisiones from "./components/Branches/Revisiones";
import Dynamics from "./components/Branches/Dynamics";
import Statics from "./components/Branches/Statics";
import Footer from "./components/Main/footer";
import LessonPlayer from "./components/Essential/lessonPlayer";
import SetPayingSystem from "./components/Essential/SetPayingSystem";
import DashBoard from "./components/Main/Admin/adminDashboard";
import * as Api from "./API/UesrApi";
import { useAuth0 } from "@auth0/auth0-react";
import LessonView from "./components/Main/Admin/Lesson-View/lessonView";
import UserView from "./components/Main/Admin/User-View/userView";

require('./utilities/console.js');

function App({redirect_url}) {
  // show if the site should be in suspended
  const isDown = false
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    picture: "",
    payingSystem: "",
  });
  const [userCodes, setUserCodes] = useState();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin'))
  const [userPayingSystem, setPayingSystem] = useState("");
  const [videoId, setVideoId] = useState("");
  const [userExist, setUserExist] = useState(false);
  const { user } = useAuth0();

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  const handleUserexist = async (email) => {
    // if (isDown) return 1 // if the site is in suspended mode, return 1
    // Check if the user on server side exist or not
    let checkUserExist;
    checkUserExist = await Api.getSpecific(email);
    if(checkUserExist.admin){
      setIsAdmin(true)
    }else{
      setIsAdmin(false)
    }

    setTimeout(() => {
      if (checkUserExist.message !== "Account isn't exist") {
        localStorage.setItem("id", checkUserExist.id);
        localStorage.setItem("ServerToken", "exist");
        setUserExist(true);
        localStorage.setItem("userPayingSystem", checkUserExist.payingSystem);

        if (checkUserExist.payingSystem !== "") {
          setPayingSystem(checkUserExist.payingSystem);
        }
      } else {
        localStorage.setItem("ServerToken", "isn`t exist");
        handelUserCreation();
      }
    }, 100);
  };
  const handelUserCreation = async () => {
    await Api.createUser(name, email, userPayingSystem).then((res) => {
      if (res.message === "account created!") {
        localStorage.setItem("ServerToken", "exist");
      }
    });
  };
  const handelUserUpdating = async (value) => {
    if (userExist) {
      await Api.updateUserPayingsystem(email, value);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userPicture", user.picture);
      setCurrentUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        payingSystem:
          userPayingSystem || localStorage.getItem("userPayingSystem"),
      });
      handleUserexist(user.email);
    } else {
      if (localStorage.getItem("userName")) {
        setCurrentUser({
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("userEmail"),
          picture: localStorage.getItem("userPicture"),
          payingSystem:
            userPayingSystem || localStorage.getItem("userPayingSystem"),
        });
        handleUserexist(localStorage.getItem("userEmail"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.email, user, userExist]);

  // fetch user available codes
  useEffect(() => {
    let payingSystem = localStorage.getItem("userPayingSystem");
    if (currentUser) {
      if (currentUser.email) {
        if (payingSystem === "LPS" || payingSystem === "MPS") {
          const fetchUserAvailableCodes = async () => {
            let res = await Api.getAvailableCodes(currentUser.email).then(
              (data) => {
                return data;
              }
            );
            setUserCodes(res);
          };
          fetchUserAvailableCodes();
        }
      }
    }
  }, [currentUser, user, userPayingSystem]);


  return (
    isDown ?
    <h1>Temporarily Unavailable - Sorry for the inconvenience</h1>
    :
    <div>
      <Header
        user={user}
        currentUser={currentUser}
        userPayingSystem={userPayingSystem}
        isAdmin={isAdmin}
        redirect_url={redirect_url}
      />
      <Routes>
        <Route
          path="/Hany-AbdulGawed-platform"
          exact
          element={
            <div>
              <Main />
              <Lectures />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Main />
              <Lectures />
            </div>
          }
        />
        <Route
          path="/Hany-AbdulGawed-platform/spatialEngineering"
          element={
            <SpatialGeomatry
            setVideoId={setVideoId}
            user={email}
            userPayingSystem={userPayingSystem}
            userCodes={userCodes}
            setUserCodes={setUserCodes} 
            />
          }
        />
        <Route
          path="/Hany-AbdulGawed-platform/Algebra"
          element={
            <Algebra
              setVideoId={setVideoId}
              user={email}
              userPayingSystem={userPayingSystem}
              userCodes={userCodes}
              setUserCodes={setUserCodes}
            />
          }
        />
        <Route
          path="/Hany-AbdulGawed-platform/Calculus"
          element={
            <Calculus
              setVideoId={setVideoId}
              user={email}
              userPayingSystem={userPayingSystem}
              userCodes={userCodes}
              setUserCodes={setUserCodes} 
            />
          }
        />
        <Route
          path="/Hany-AbdulGawed-platform/Dynamics"
          element={<Dynamics
              setVideoId={setVideoId}
              user={email}
              userPayingSystem={userPayingSystem}
              userCodes={userCodes}
              setUserCodes={setUserCodes} 
            />}
        />
        <Route
          path="/Hany-AbdulGawed-platform/Statics"
          element={
            <Statics
              setVideoId={setVideoId}
              user={email}
              userPayingSystem={userPayingSystem}
              userCodes={userCodes}
              setUserCodes={setUserCodes} 
            />
          }
        />
        <Route
          path="/Hany-AbdulGawed-platform/Revisiones"
          element={<Revisiones />}
        />
        <Route
          path={`/Hany-AbdulGawed-platform/lessonView`}
          element={<LessonPlayer videoId={videoId} />}
        />
        <Route
          path={`/Hany-AbdulGawed-platform/PayingSystem`}
          element={
            <SetPayingSystem
              user={email}
              handelUserUpdating={handelUserUpdating}
              userPayingSystem={userPayingSystem}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashBoard
            currentUser={currentUser}
            />
          }
        />
        <Route
          path="/admin/lessons"
          element={<LessonView />}
        />
        <Route
          path="/admin/user"
          element={<UserView />}
        />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
