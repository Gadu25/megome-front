// import LogoutButton from "@/components/logout-button";
// import ServerError from "@/components/server-error";
// import { authApi } from "@/lib/auth-api";
import ServerError from "@/components/ServerError";
import { authApi } from "@/lib/api/authApi";
import React from "react";

const Protected = async () => {
  try {
    const { verifyAccessToken } = authApi();
    await verifyAccessToken();

    /* Best practice for fetching data in server components
    const results = await Promise.all([
      asyncOperation1(),
      asyncOperation2(),
      asyncOperation3(),
      ]);
      */
   console.log("protected")

    return (
      <div>
        <p>Authenticated Server Component</p>
        {/* <LogoutButton /> */}
      </div>
    );
  } catch (error) {
    console.log("error", error)
    return <ServerError error={error} />;
  }
};

export default Protected;
