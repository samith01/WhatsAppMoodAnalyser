import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContextProvider";

export default function MoodScorePage() {
  const navigation = useNavigate();
  const { moodScore, myEmojiRatings, privateMessages, myName } =
    useContext(UserContext);

  const [advice, setAdvice] = useState("");
  const [overallMood, setoverallMood] = useState(null);

  const generateAdvice = async () => {
    const { [myName]: excludedData, ...filteredData } = privateMessages;

    await fetch("http://127.0.0.1:3000/generateAdvice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mymessages: JSON.stringify(filteredData),
        myname: myName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdvice(data);
      });
  };
  const generateOverallMood = async () => {
    let highestMood = null;
    let highestScore = -1;
  
    myEmojiRatings.forEach((mood) => {
      if (mood.score > highestScore) {
        highestScore = mood.score;
        highestMood = mood.emoji;
      }
    });
  
    setoverallMood(highestMood);
  };

  useEffect(() => {
    generateAdvice();
    generateOverallMood();
  }, []);


  const sum_score = () => {
    let sum = 0;
    myEmojiRatings.forEach((emoji) => {
      sum += emoji.score;
    });
    if (sum == 0) {
      return 1;
    }

    return sum;
  };


  return (
    <div
      style={{
        backgroundColor: "black",
        height: "120vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "7vh",
          width: "100%",
          alignItems: "center",
          margin: 20,
        }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          color="white"
          onClick={() =>
            navigation("/settings", {
              state: { showSettings: true },
            })
          }
          style={{ marginLeft: 20 }}
        />
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "white", marginRight: 50 }}>Mood Score</h3>
        </div>
      </div>

      <div style={{ height: "auto", width: "100%" }}>
        <h1 style={{ color: "white", textAlign: "center", fontSize: "50px" }}>
          {overallMood ? overallMood : null}
        </h1>
        <h1 style={{ color: "white", textAlign: "center", fontSize: "30px" }}>
          {moodScore}
        </h1>
      </div>
      <div
        style={{
          height: "fit-content",
          width: "80%",
          margin: 20,
          borderRadius: 10,
          backgroundColor: "#171717",
          padding: 5,
        }}
      >
        {myEmojiRatings.map((mood, _index) => {
          return (
            <div
              style={{
                padding: 20,
                display: "flex",
                height: "4vh",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
        key={_index}

            >
              <p style={{ textAlign: "left", fontSize: 30 }}>{mood.emoji}</p>
              {/* percentage bar */}
              <div
                style={{
                  height: "5vh",
                  width: "80%",
                  borderRadius: 20,
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(mood.score / sum_score()) * 100}%`,
                    borderRadius: 20,
                    backgroundColor: mood.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
        <h2 style={{ color: "white",textAlign:"center", width:"60%" }}>{advice}</h2>
      </div>
    </div>
  );
};
