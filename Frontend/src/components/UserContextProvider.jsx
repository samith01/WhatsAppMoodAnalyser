import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {

  const storedName = localStorage.getItem("myName") || "";

  const storedRatings = [
    { emoji: "🥰", score: 0, color: "#0f9246", weight: 3 },
    { emoji: "😁", score: 0, color: "#7ebb42", weight: 2 },
    { emoji: "😐", score: 0, color: "#f58f20", weight: 1 },
    { emoji: "😔", score: 0, color: "#ef4725", weight: -1 },
    { emoji: "😡", score: 0, color: "#bd1f27", weight: -2 },
  ];

  const [myName, setmyName] = useState(storedName);
  const [userEmojis, setUserEmojis] = useState({});


  const [ws, setWs] = useState();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [newMessage, setnewMessage] = useState({ from: "", to: "" });

  const [moodScore, setMoodScore] = useState(0);
  
  const [myEmojiRatings, setmyEmojiRatings] = useState(storedRatings);

  const [privateMessages, setPrivateMessages] = useState(() => {
    const savedMessages = localStorage.getItem("privateMessages");
    return savedMessages ? JSON.parse(savedMessages) : {};
  });

  useEffect(() => {
    localStorage.setItem("myName", myName);
  }, [myName]);


  useEffect(() => {
    localStorage.setItem("privateMessages", JSON.stringify(privateMessages));
  }, [privateMessages]);

  useEffect(() => {
    localStorage.setItem("emojiRatings", JSON.stringify(myEmojiRatings));
  }, [myEmojiRatings]);

  useEffect(() => {
    if (newMessage != null) {
      if ((myName in userEmojis) & (newMessage.from == myName)) {
        updateScore();
      }
      setnewMessage(null);
    }
  }, [userEmojis]);

  useEffect(() => {
    if (newMessage != null) {
      updateUserEmojis(newMessage);
    }
  }, [newMessage]);


  const sum_scoreWithWeight = () => {
    let sum = 0;
    myEmojiRatings.forEach((emoji) => {
      sum += emoji.score * emoji.weight;
    });
    return sum;
  };

  useEffect(() => {
    setMoodScore(sum_scoreWithWeight());
  }, [myEmojiRatings]);


  const updateScore = () => {
    console.log(myEmojiRatings)
    const val = userEmojis[myName] || "";

    setmyEmojiRatings((prevEmojiRatings) =>
      prevEmojiRatings.map((emoji) => {
        if (emoji.emoji === val) {
          return { ...emoji, score: emoji.score + 1 };
        }
        return emoji;
      })
    );
    console.log("updated score");
  };

  useEffect(() => {
    if (ws != null) {
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        ws.send(JSON.stringify({ type: "login", name: myName }));
        setPrivateMessages({});
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "new_user_list") {
          setConnectedUsers(message.users);
        } else if (message.type === "new_message") {
          setPrivateMessages((prev) => ({
            ...prev,
            [message.from]: [
              ...(prev[message.from] || []),
              { user: message.from, message: message.data },
            ],
          }));
          setnewMessage({ from: message.from, to: message.to });
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      ws.onerror = (error) => {
        console.log("WebSocket error", error);
      };
    }
  }, [ws]);

  const initializeWebSocket = () => {
    setWs(new WebSocket("wss://b59bdj60-8000.asse.devtunnels.ms/"));
  };

  const updateUserEmojis = async (newMessage) => {
    if (!privateMessages[newMessage.from] || !privateMessages[newMessage.to])
      return;

    let reversed;
    if (newMessage.from == myName) {
      reversed = [...privateMessages[newMessage.to]].reverse();
    } else {
      reversed = [...privateMessages[newMessage.from]].reverse();
    }
    
    // let latestMessages = [];
    // let otherUserMsgStarted = false;
    // for (let i = 0; i < reversed.length; i++) {
    //   if (newMessage.from == myName) {
    //     if (
    //       (reversed[i].user == newMessage.from) &
    //       (otherUserMsgStarted == false)
    //     ) {
    //       latestMessages.push(reversed[i]);
    //     } else if (reversed[i].user != newMessage.from) {
    //       otherUserMsgStarted = true;
    //       latestMessages.push(reversed[i]);
    //     } else if (
    //       (reversed[i].user == newMessage.from) &
    //       (otherUserMsgStarted == true)
    //     ) {
    //       break;
    //     }
    //   } else if (
    //     (reversed[i].user == newMessage.from) &
    //     (otherUserMsgStarted == false)
    //   ) {
    //     latestMessages.push(reversed[i]);
    //   }
    //   if (reversed[i].user != newMessage.from) {
    //     otherUserMsgStarted = true;
    //     latestMessages.push(reversed[i]);
    //   } else if (
    //     (reversed[i].user == newMessage.from) &
    //     (otherUserMsgStarted == true)
    //   ) {
    //     break;
    //   }
    // }
    // latestMessages.reverse();

    await fetch("https://b59bdj60-2001.asse.devtunnels.ms/generateEmoji", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        messages: JSON.stringify(reversed),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserEmojis(data);
      });
  };

  return (
    <UserContext.Provider
      value={{
        myName,
        setmyName,
        privateMessages,
        setPrivateMessages,
        moodScore,
        setMoodScore,
        myEmojiRatings,
        setmyEmojiRatings,
        ws,
        connectedUsers,
        setConnectedUsers,
        initializeWebSocket,
        newMessage,
        setnewMessage,
        updateUserEmojis,
        userEmojis,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
