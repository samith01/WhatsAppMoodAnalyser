import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faMessage, faUser } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import {UserContext} from "./UserContextProvider";

const ChatsList = ({setShowPrivateChat,setPrivateUser}) => {
  const {myName,privateMessages,userEmojis,connectedUsers} = useContext(UserContext)

  return (
  <>
    {connectedUsers.map((item) => {
      return (
        item != myName && (
          <div
            key={item}
            onClick={() => {
              setShowPrivateChat(true);
              setPrivateUser(item);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              width: "95%",
              height: "10vh",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                padding: 5,
                width: "100%",
                height: "11vh",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  marginRight: 20,
                }}
              >
                <div
                  style={{
                    padding: 5,
                    borderRadius: 100,
                    display: "flex",
                    justifyContent: "center",
                    height: 60,
                    width: 60,
                    backgroundColor: "gray",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} size="2xl" color="white" />
                </div>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    position: "relative",
                    bottom: "-50px",
                    right: "20px",
                    borderRadius: 10,
                  }}
                  >
                    {userEmojis[item] && (
                      <>
                  <div style={{position:"absolute",bottom:1,right:-2,fontSize:15}}>{userEmojis[item]}</div>  
                      </>
                    )}
                </div>
              </div>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <p style={{ color: "white", fontSize: 15, fontWeight: 800 }}>
                  {item}
                </p>
                <p style={{ color: "white", fontSize: 13 }}>
                  {privateMessages[item]
                    ? privateMessages[item][
                        Object.keys(privateMessages[item]).pop()
                      ].message
                    : ""}
                </p>
              </div>
            </div>
          </div>
        )
      );
    })}
  </>)
}

export default ChatsList;