import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faCamera,
  faPlus,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import ChatsList from "./ChatList";
import NavBar from "./BottomNavBar";
import PrivateChat from "./PrivateChat";

import {UserContext} from "./UserContextProvider";

const HomePage = () => {
  const { myName, setPrivateMessages,setMoodScore,setmyEmojiRatings,myEmojiRatings,ws,connectedUsers,initializeWebSocket,setConnectedUsers } =
    useContext(UserContext);

  const [showPrivateChat, setShowPrivateChat] = useState(false);
  const [privateUser, setPrivateUser] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    if (ws == null){
      initializeWebSocket();
    }
  },[])


  const logout = () => {
    ws.send(JSON.stringify({ type: "logout", name: myName }));
    ws.close();
    setConnectedUsers([]);
    navigate("/");
  };

  return (
    <div style={{ height: "100vh", width: "100vw"}}>
      {showPrivateChat ? (
        <PrivateChat
          currentUser={privateUser}
          setShowPrivateChat={setShowPrivateChat}
        />
      ) : (
        <div style={styles.container}>
          {showSettings ? (
            navigate("/settings")
          ) : (
            <>
              <div style={styles.header}>
                <div
                  style={{
                    backgroundColor: "#171717",
                    padding: 5,
                    borderRadius: 100,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    marginLeft: 10,
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsis} color="white" />
                </div>
                <button onClick={logout}>Logout</button>
                <div
                  style={{
                    display: "flex",
                    width: "15vh",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#171717",
                      padding: 5,
                      borderRadius: 100,
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <FontAwesomeIcon icon={faCamera} color="white" />
                  </div>
                  <div
                    style={{
                      backgroundColor: "green",
                      padding: 5,
                      borderRadius: 100,
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} color="black" />
                  </div>
                </div>
              </div>

              <div style={{ width: "95%", height: "6vh", marginLeft: 20 }}>
                <h2
                  style={{
                    color: "white",
                    fontSize: "5vh",
                    fontWeight: "bold",
                  }}
                >
                  Chats {myName}
                </h2>
              </div>
              {/* Search bar and filter icons */}
              <div
                style={{
                  width: "95%",
                  height: "7vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  padding: "10px",
                  marginTop: 30,
                }}
              >
                <input
                  type="text"
                  style={{
                    width: "80vw",
                    backgroundColor: "#171717",
                    border: "none",
                    height: "3vh",
                    borderRadius: 15,
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: 20,
                  }}
                  placeholder="Search"
                />
                <FontAwesomeIcon icon={faFilter} size={"sm"} color="white" />
              </div>
              <ChatsList
                setShowPrivateChat={setShowPrivateChat}
                setPrivateUser={setPrivateUser}
              />
            </>
          )}
          <NavBar showSettings={showSettings} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
    height: "100vh",
    width: "100%",
  },
  header: {
    width: "100%",
    margin: "10px",
    height: "7vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default HomePage;
