import React, {useEffect, useState} from 'react';

import { useSearchParams } from 'next/navigation';

import { clientServer } from "@/config";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import styles from "./index.module.css";

import { baseURL } from '@/config';

import { connect, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function viewProfilePage({userProfile}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  console.dir(authState);
  console.dir(postState);

  const [userPosts, setUserPosts] = useState([]);

  const [currentUserInConnection, setCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest(localStorage.getItem("token")));
  };

  useEffect(() => {
    const posts = postState.posts.filter((post) => post.userId.username == router.query.username);

    setUserPosts(posts);
  }, [postState.posts]);

  useEffect(() => {
    if(authState.connections.some((connection) => connection.connectionId._id === userProfile.userId._id)){
      setCurrentUserInConnection(true);
    }
    const connection = authState.connections.find((connection) => connection.connectionId._id === userProfile.userId._id);
    if(connection && connection.stauts_accepted === true){
      setIsConnectionNull(false);
    };

  }, [authState.connections]);

  useEffect(() => {
    getUserPosts();
  },[]);


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
                <div className={styles.buttonContainer}>
                  {currentUserInConnection ?
                    <button className={styles.connectedBtn}>{isConnectionNull ? "Pending":"Connected"}</button> : 
                    <button className={styles.connectBtn}
                      onClick={()=>{
                        dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id}));
                      }}
                    >Connect</button>
                  }

                  <button className={styles.downloadResumeBtn}
                    //here stopped
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span> Download Resume</span>
                  </button>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>

              </div>
              <div className={styles.profileContainer__details__first_left}>

                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card__profileContainer}>
                        {post.media != "" ? <img src={baseURL + "/" + post.media} alt="Post" /> : <div height={"3.5rem"} width={"3.5rem"}></div>}
                      </div>
                    </div>  
                  </div>
                ))}

              </div>
              
            </div>

          </div>

          <div className={styles.workHistory}>
            <h4>Current Post</h4>

            <div className={styles.workHistoryContainer}>
              <div className={styles.workHistoryCard}>
                <p>{userProfile.currentPost}</p>
              </div>
            </div>

          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>
              {
                userProfile.pastWork.map((work) => (
                  <div key={work._id} className={styles.workHistoryCard}>
                      <p>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                  </div>
                ))
              }
            </div>

          </div>

          <div className={styles.workHistory}>
            <h4>Education</h4>

            <div className={styles.workHistoryContainer}>
              {
                userProfile.education.map((education) => (
                  <div key={education._id} className={styles.workHistoryCard}>
                      <p>Degree : {education.degree}</p>
                      <p>Field of Study : {education.fieldOfStudy}</p>
                      <p>From : {education.school}</p>
                  </div>
                ))
              }
            </div>

          </div>

        </div>
      </DashboardLayout>
    </UserLayout>
  )
};


export async function getServerSideProps(context){

  const response = await clientServer.get("/user/getUserByUsername",{
    params: {
      username: context.query.username,
    }
  });

  console.log(response.data);

  return {props: {userProfile: response.data}};
};