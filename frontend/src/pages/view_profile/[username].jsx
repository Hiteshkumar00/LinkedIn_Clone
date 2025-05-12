import React, {use, useEffect, userEffect, useState} from 'react';

import { useSearchParams } from 'next/navigation';

import { clientServer } from "@/config";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import styles from "./index.module.css";

import { baseURL } from '@/config';

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/router';

import { getAllPosts } from '@/config/redux/action/postAction';
//import { getConnectionsRequest } from '@/config/redux/action/authAction';

function viewProfilePage({userProfile}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userPosts, setUserPosts] = useState([]);

  const [currentUserInConnection, setCurrentUserInConnection] = useState(false);

  const getUserPosts = async () => {
    await dispatch(getAllPosts(userProfile.userId._id));
    //await dispatch(getConnectionsRequest(localStorage.getItem("token")));
  };

  useEffect(() => {
    const posts = postState.posts.filter((post) => post.userId.username === router.query.username);
    setUserPosts(posts);
  }, [postState.posts]);

  useEffect(() => {
    console.log(authState.connections);
    if(authState.connections.some((connection) => connection.userId._id === userProfile.userId._id)){
      setCurrentUserInConnection(true);
    }

  }, [authState.connections]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={baseURL + "/" + userProfile.userId.profilePicture} alt="Profile Img" />
          </div>

          <div className={styles.profileContainer__details}>

            <div className={styles.profileContainer__details__first}>

              <div className={styles.profileContainer__details__first_right}>
                <div className={styles.profileContainer__details__first_right__name}>
                  <h2>{userProfile.userId.name}</h2>
                  <p>@{userProfile.userId.username}</p>
                </div>
                {currentUserInConnection ?
                  <button className={styles.connectedBtn}>Connected</button> : 
                  <button className={styles.connectBtn}
                    onClick={()=>{
                      //dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id}));
                    }}
                  >Connect</button>
                }

                <div>
                  <p>{userProfile.bio}</p>
                </div>

              </div>
              <div className={styles.profileContainer__details__first_left}>

              </div>
              
            </div>

          </div>

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default viewProfilePage;


export async function getServerSideProps(context){

  const response = await clientServer.get("/user/getUserByUsername",{
    params: {
      username: context.query.username,
    }
  });

  console.log(response.data);

  return {props: {userProfile: response.data}};
};