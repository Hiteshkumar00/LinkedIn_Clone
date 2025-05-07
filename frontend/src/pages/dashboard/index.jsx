import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';

import { getAllPosts, createPost, deletePost, incrementLikes, getAllComments, postComment
  , deleteComment
} from '@/config/redux/action/postAction';

import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';

import styles from './style.module.css';

import { baseURL } from '@/config';

import { setTokenIsThere , unsetTokenIsThere} from '@/config/redux/reducer/authReducer/index.js';
import { resetPostId } from '@/config/redux/reducer/postReducer/index.js';

export default function Dashboard() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);


  useEffect(() => {

    if(localStorage.getItem("token")){
      dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

    dispatch(getAllPosts());
    
  }, []);

  const [postContent, setPostContent] = useState({
    body: "",
    media: null,
  });

  const handleUpload = async () => {
    await dispatch(createPost(postContent));
    setPostContent({
      body: "",
      media: null,
    });
    dispatch(getAllPosts());
  };

  const handleDelete = async (post_id) => {
    await dispatch(deletePost(post_id));
    dispatch(getAllPosts());
  };

  const [comment, setComment] = useState("");



  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          {
            authState.profileFetched ?
              <div className={styles.createPostContainer}>
                <div>
                  <img className={styles.profilePic} width={100} src={`${baseURL}/${authState.user.userId.profilePicture}`} alt="Profile" />
                  <textarea name="" id="" placeholder="What's in your mind?"
                    value={postContent.body}
                    onChange={(e) => setPostContent({...postContent, body: e.target.value})}
                  ></textarea>
                  <div  className={styles.fab}>
                    <label htmlFor="upload">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                      </svg>
                    </label>
                  </div>
                  <input hidden type="file" name="" id="upload" accept="image/*"
                    onChange={(e) => setPostContent({...postContent, media: e.target.files[0]})}
                  />
                  
                </div>
                <div className={styles.createPostButton}>
                  
                  {
                    postContent.body.length > 0 &&
                    <button
                      onClick={handleUpload}
                    >Post</button>
                  }
                </div>
              </div>
              :
              <p>loading...</p>
            }

            <div className={styles.postContainer}>
              {
               postState.postFetched && authState.user.userId ?
                postState.posts.map((post, index) => {
                  return (
                    <div key={post._id} className={styles.singlePost}>
                      <div className={styles.postHeader}>
                        <img className={styles.profilePic} width={200} src={`${baseURL}/${post.userId.profilePicture}`} alt="Profile" />
                        <div className={styles.postHeaderText}>
                          <p>{post.userId.name}</p>
                          <p>@{post.userId.username}</p>
                        </div>
                        {  post.userId._id == authState.user.userId._id &&
                          <svg className={styles.postHeaderDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            onClick={() => handleDelete(post._id)}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        }
                      </div>
                      <div className={styles.postBody}>
                        <p>{post.body}</p>

                        {post.media && <img width={200} src={`${baseURL}/${post.media}`} alt="Post Media" />}
                      </div>

                      <div className={styles.optionsContainer}>
                        <div className={styles.single__optionsContainer}
                          onClick={async ()=>{
                            await dispatch(incrementLikes(post._id));
                            dispatch(getAllPosts())
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                          </svg>
                          <span>{post.likes}</span>
                        </div>
                       
                        <div className={styles.single__optionsContainer}
                          onClick={
                            async () => {
                              await dispatch(getAllComments(post._id));
                            }
                          }
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                          </svg>
                        </div>

                        <div className={styles.single__optionsContainer}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
                :
                <p>Posts loading...</p>
              }
            </div>
          </div>
          
          {
            postState.postId != null && (
              <div className={styles.commentsContainer}
                onClick={()=>{
                  dispatch(resetPostId());
                }}
              >
                <div className={styles.allCommentsContainer}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {postState.comments.length == 0 && <h3>No Commments</h3>}

                  {
                    postState.comments.length != 0 && 
                    <div className={styles.allCommentsContainer__comments}>
                      {postState.comments.map((comment, index) => 
                        <div className={styles.allCommentsContainer__singleComment} key={comment._id}>
                          <img src={`${baseURL}/${comment.userId.profilePicture}`} alt="img" />
                          <div>
                            <p>{comment.userId.username}</p>
                            <p>{comment.body}</p>
                          </div>
                          { authState.user.userId._id == comment.userId._id &&
                            <button
                              onClick={async ()=>{
                                await dispatch(deleteComment(comment._id));
                                await dispatch(getAllComments(postState.postId));
                              }}
                            >
                              DEL
                            </button>
                          }
                        </div>
                      )}
                    </div>
                  }
                  
                  <div className={styles.postCommentsContainer}>
                    <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder='Comment' />
                    <button className={styles.postCommentsContainer__commentBtn}
                      onClick={ async () =>{
                        await dispatch(postComment({post_id: postState.postId, body: comment}));
                        await dispatch(getAllComments(postState.postId));
                        setComment("");
                      }}

                      disabled={comment.trim() != ""? false: true}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                    </button>
                  </div>    
                </div>
              </div>
            )
          }
      </DashboardLayout>
    </UserLayout>
  )
};
