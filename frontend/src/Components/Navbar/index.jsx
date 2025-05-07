import React, {useState} from 'react'
import { useRouter } from 'next/router'

import styles from './styles.module.css'

import { useDispatch, useSelector } from 'react-redux'

import { reset as userReset } from '@/config/redux/reducer/authReducer';
import { reset as postReset } from '@/config/redux/reducer/postReducer';

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()

  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}> 
        <h1
          onClick={()=>{
            router.push('/');
          }}
        >Pro Connect</h1>

        
        
          <div className={styles.navBarOptionContainer}>
            {
              authState.profileFetched &&
                <>
                <div>
                  <p className={styles.navBarOption}
                    onClick={()=>{
                      localStorage.removeItem("token");
                      dispatch(userReset());
                      dispatch(postReset());
                      router.push('/login');
                    }}
                  >
                    Logout
                  </p>
                </div>
                <div>
                  <p className={styles.navBarOption}>
                    Profile
                  </p>
                </div>
              </>
            }

            {!authState.profileFetched &&
              <div 
                className={styles.navBarOption + ' ' + styles.buttonJoin}
                onClick={()=>{
                  router.push('/login');
                }}
              >
                <p>Be a part!</p>
              </div>
            }
          </div>
        
      </nav>
    </div>
  )
}
