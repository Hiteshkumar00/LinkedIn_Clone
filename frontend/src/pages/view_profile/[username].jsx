import React from 'react';

import { useSearchParams } from 'next/navigation';

import { clientServer } from "@/config";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

function viewProfilePage({userProfile}) {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>{userProfile.userId.username}</div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default viewProfilePage;


export async function getServerSideProps(context){
  console.log(context);

  const response = await clientServer.get("/user/getUserByUsername",{
    params: {
      username: context.query.username,
    }
  });

  console.log(response.data);

  return {props: {userProfile: response.data}};
};