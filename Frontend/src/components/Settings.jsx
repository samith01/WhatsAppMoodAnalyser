import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBullhorn,
  faChessKnight,
  faChevronRight,
  faSmile,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NavBar from "./BottomNavBar";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";

import { UserContext } from "./UserContextProvider";

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showSettings = location.state.showSettings;
  const { moodScore,myName } = useContext(UserContext);

  console.log("My score: ",moodScore)
  const gotoMoodPage = () => {
    navigate("/mood");
  };
  const settingsType = ({ iconname, faicon, click }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "fit-content",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={click}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            alignContent: "center",
            alignItems: "center",
            marginLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <FontAwesomeIcon icon={faicon} color="white" />
          <p style={{ color: "white", fontSize: 20, marginLeft: 20 }}>
            {iconname}
          </p>
        </div>

        {click ? (
          <p style={{ color: "gray", marginLeft: "40%", fontSize: 20 }}>
            {moodScore}
          </p>
        ) : null}

        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ marginRight: 20 }}
          color="gray"
        />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        backgroundColor: "black",
        width: "100%",
      }}
    >
      <h1
        style={{
          color: "white",
          fontWeight: 800,
          fontSize: 40,
          margin: 20,
          marginTop: 60,
        }}
      >
        Settings
      </h1>
      <div
        style={{
          height: "fit-content",
          margin: 20,
          borderRadius: 20,
          backgroundColor: "#171717",
          padding: 6,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              padding: 10,
              width: "100%",
              height: "fit-content",
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
                {myName}
              </p>
            </div>
          </div>
          <div
            style={{ width: "100%", height: 1, backgroundColor: "gray" }}
          ></div>
          {settingsType({ iconname: "Avatar", faicon: faChessKnight })}
        </div>
      </div>
      <div
        style={{
          height: "fit-content",
          margin: 20,
          borderRadius: 20,
          backgroundColor: "#171717",
          padding: 4,
        }}
      >
        {settingsType({ iconname: "Broadcast Lists", faicon: faBullhorn })}
        {settingsType({ iconname: "Starred Messages", faicon: faStar })}
        {settingsType({
          iconname: "Mood Score",
          faicon: faSmile,
          click: gotoMoodPage,
        })}
      </div>
      <NavBar name={name} showSettings={showSettings} />
    </div>
  );
};

export default SettingsPage;
