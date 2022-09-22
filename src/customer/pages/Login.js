import React, { useEffect, useState } from "react";
import Input from "../components/Input";

const Login = (e) => {
  // const state = { message: "" };
  const [message, setMessage] = useState("");
  const userNameRef = React.useRef();
  const pwdRef = React.useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // console.log("form submit");
    const username = userNameRef.current.value;
    const password = pwdRef.current.value;
    console.log(username);
    console.log(password);
    if (username === "admin" && password === "123") {
      setMessage("OK");
    } else {
      setMessage("Fail");
    }
  };

  useEffect(() => {
    userNameRef.current.focus();
  }, []);
  return (
    <>
      <div className="container h-100">
        <div style={{ height: "10rem" }}></div>
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-sm-8 col-lg-5">
            <div className="card bg-primary">
              <div className="card-header text-white">
                <h4 className="card-title mb-0">
                  <i className="bi-grid-3x3-gap-fill" /> Login
                </h4>
              </div>
              <div className="card-body bg-white rounded-bottom">
                <p className="text-center text-danger">{message}</p>
                <form onSubmit={handleFormSubmit}>
                  <Input
                    inputRefs={userNameRef}
                    id="textUserName"
                    label="User Name"
                    placeholder="Enter Username"
                    labelSize="3"
                  />
                  <Input
                    inputRefs={pwdRef}
                    labelSize="3"
                    id="textPwd"
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                  />
                  {/* <Input id="txtNote" row="2" /> */}
                  <div className="row">
                    <div className="offset-sm-3 col-auto">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
