import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "./UserContextProvider";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setmyName,initializeWebSocket } = useContext(UserContext);

  const signinPressed = () => {
    initializeWebSocket();
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.text}>Name</h2>
      <input style={styles.input} onChange={(e) => setmyName(e.target.value)} />
      <button style={styles.signinButton} onClick={signinPressed}>
        Sign In
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "gray",
    width: 200,
    borderRadius: 30,
    height: 40,
    padding: 10,
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  signinButton: {
    width: 100,
    height: 50,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "#25D366",
  },
};

export default SignInPage;
