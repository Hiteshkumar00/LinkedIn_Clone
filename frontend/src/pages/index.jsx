import React from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

import UserLayout from "@/layout/UserLayout";


export default function Home() {
  const router = useRouter();


  return (
    <UserLayout>
      <div className={`${styles.container}`}>
        <div className={`${styles.mainContainer}`}>
          <div className={`${styles.mainContainer__left}`}>
            <p>Connect with friends without exaggeration</p>
            <p>A true social media platform, with stories no blufs !</p>

            <div className={`${styles.buttonJoin}`}
              onClick={() => {
                router.push("/login");
              }}
            >
              <p>Join Now</p>
            </div>
          </div>
          <div className={`${styles.mainContainer__right}`}>
            <img src="images/main_connectoin.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
