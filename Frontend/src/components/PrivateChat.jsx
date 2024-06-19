import {
  faArrowLeft,
  faPaperPlane,
  faPhone,
  faPlus,
  faUser,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import "../App.css";
import {UserContext} from "./UserContextProvider";
import ChatBackground from "../assets/chatbg.jpeg"

const PrivateChat = ({currentUser, setShowPrivateChat}) => {
  const {myName, privateMessages, setPrivateMessages, ws} = useContext(UserContext);
  const [message,setMessage] = useState("")

  const sendMessage = () => {
    const newMessage = {
      type: "message",
      from: myName,
      to: currentUser,
      data: message,
    };
    ws.send(JSON.stringify(newMessage));
    setPrivateMessages((prev) => ({
      ...prev,
      [currentUser]: [
        ...(prev[currentUser] || []),
        { user: myName, message: message },
      ],
    }));
    setMessage("");
  };

  const generateResponse = async () => {
    console.log(privateMessages[currentUser])
    await fetch("http://127.0.0.1:3000/whatToSend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        messages: JSON.stringify(privateMessages[currentUser]),
        myname:myName,

      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      });
  }


  // useEffect(() => {
  //   generateResponse();
  // },[])

  return (
    
    <div style={styles.container}>
      {/* header with ios back button profile icon username and phone icon and video icon */}
      <div
        className="glassy"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "max-width",
          height: "6vh",
          padding: 10,
          paddingRight: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            margin: 10,
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={() => setShowPrivateChat(false)}
          />
          <div
            style={{
              padding: 5,
              borderRadius: 100,
              display: "flex",
              justifyContent: "center",
              height: 30,
              width: 30,
              marginLeft: 20,
              backgroundColor: "gray",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faUser} color="white" />
          </div>
          <h2 style={{ marginLeft: 20 }}>{currentUser}</h2>
        </div>
        <div
          style={{
            display: "flex",
            width: 80,
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FontAwesomeIcon icon={faPhone} />
          <FontAwesomeIcon icon={faVideoCamera} />
        </div>
      </div>
      <div style={styles.chatArea}>
        {privateMessages[currentUser]?.map((msg, index) => (
          <div
            key={index}
            style={msg.user == myName ? styles.myMessage : styles.otherMessage}
          >
            <p style={{ display: "inline-block", margin: 3 }}>{msg.message}</p>
          </div>
        ))}
      </div>
      <div
        className="glassy"
        style={{
          padding: 0,
          display: "flex",
          height: "15vh",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        <form onSubmit={(e) => e.preventDefault()} style={{width:"70%"}}>

        <input
          type="text"
          onChange={(e) => {setMessage(e.target.value);
            e.preventDefault()}}
            style={styles.chatInput}
          value={message.current}
        />
        </form>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: "green",
            padding: 5,
            borderRadius: 20,
          }}
          onClick={sendMessage}
        >
          <FontAwesomeIcon icon={faPaperPlane} color={"black"} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    background: `url(${ChatBackground})`,
    color: "white",
    height: "100vh",
  },
  chatArea: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    padding: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#075e54",
    padding: "5px",
    maxWidth: "50%",
    borderRadius: "10px",
    marginBottom: "10px",
    height: "max-content",
    width: "auto",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#555",
    padding: "5px",
    maxWidth: "50%",
    borderRadius: "10px",
    marginBottom: "10px",
    height: "auto",
    width: "auto",
  },
  chatInput: {
    backgroundColor: "#3B3B3B",
    border: "none",
    width: "100%",
    borderRadius: 40,
    height: "4vh",
    color: "white",
    padding: 5,
  },
};

export default PrivateChat;
