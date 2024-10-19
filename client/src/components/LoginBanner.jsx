import React from "react";

const LoginBanner = ({loginType}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-secondary rammetto text-shadow">
        Login
      </h1>
      <span className="font-bold text-accent pt-6">hi there!</span>
      <span className="text-accent pb-5">login as {loginType}</span>
    </div>
  );
};

export default LoginBanner;
