import React, {useEffect} from 'react'

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import { useSelector } from "react-redux";

import { useRouter } from 'next/router';

import { getAllUsers } from '@/config/redux/action/authAction';
import { useDispatch } from "react-redux";

import styles from './style.module.css';

import { baseURL } from '@/config';

export default function Discover() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if(!authState.allUsersFetched) {
      dispatch(getAllUsers());
    }
  }, []);

  console.log("all users", authState.all_users);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.discoverContainer}>
          <h1>Discover</h1>
          <div className={styles.allUserProfile}>
            {
              authState.allUsersFetched && authState.all_users.map((user, index) => 
                <div key={user.userId._id} className={styles.userCard}
                  onClick={()=>{
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                >
                  <img className={styles.userCard__image} width={"40px"} src={`${baseURL}/${user.userId.profilePicture}`} alt="Profile" />
                  <div>
                    <h1>{user.userId.name}</h1>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
};
