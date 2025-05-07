import { loginUser, registerUser } from '@/config/redux/action/authAction'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { emptyMessage } from "@/config/redux/reducer/authReducer/index.js";

import UserLayout from "@/layout/UserLayout";

import styles from "./style.module.css";

function LoginComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if(authState.loggedIn) {
      router.push('/dashboard');
    }
  },[authState.loggedIn]);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      router.push('/dashboard');
    }
  }, []);

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(true);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    dispatch(emptyMessage());
  },[userLoginMethod]);

  const handleInputChange = (event) => {
    setUserData({...userData, [event.target.name]: event.target.value});
  };

  const handelRegister = () => {
    console.log("Registering user...");
    dispatch(registerUser(userData));
  };

  const handleLogin = () => {
    console.log("Logging in user...");
    dispatch(loginUser(userData));
  };

  return (
    <UserLayout>  
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? "Sign Up": "Sign In"}
            </p>

            <p style={{marginTop: "1rem", color: authState.isError? "red": "green"}}>{authState.message}</p>

            <div className={styles.inputContainers}>

              <input className={styles.inputField} type="text" name='username' placeholder='Username' 
                onChange={handleInputChange}
                value={userData.username} 
              />
             
             {userLoginMethod && 
                <>
                <input className={styles.inputField} type="text" name='name' placeholder='Name' 
                  onChange={handleInputChange}
                  value={userData.name} 
                />
                
                <input className={styles.inputField} type="email" name='email' placeholder='Email' 
                  onChange={handleInputChange}
                  value={userData.email} 
                />
                </>
              }
              
              <input className={styles.inputField} type="text" name='password' placeholder='Password' 
                onChange={handleInputChange}
                value={userData.password} 
              />
              
              <button className={styles.buttonWithOutline}
                onClick={() => userLoginMethod ? handelRegister() : handleLogin()}
              >
                {userLoginMethod ? "Sign Up": "Sign In"}
              </button>

              {userLoginMethod ? 
                <p>Already Have an Account? &nbsp;
                  <button className={styles.changeMethodButton}
                    onClick={() => setUserLoginMethod(false)}
                  >Sign In</button>
                </p>
                :
                <p>Don't Have an Account? &nbsp;
                  <button className={styles.changeMethodButton}
                    onClick={() => setUserLoginMethod(true)}
                  >Sign Up</button>
                </p>
              }
              
            
            </div> 
          </div>
          <div className={styles.cardContainer__right}>
            
          </div>
        </div>
      </div>

    </UserLayout>
  );
};

export default LoginComponent;