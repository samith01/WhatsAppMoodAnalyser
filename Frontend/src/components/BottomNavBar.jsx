import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faUsers,
  faComments,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const NavBar = ({showSettings}) => {
  const navigation = useNavigate();

  return (
    <div
      className="glassy"
      style={{
        display: "flex",
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "10vh",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <FontAwesomeIcon icon={faPhone} color="gray" size="xl" />
      <FontAwesomeIcon icon={faUsers} color="gray" size="xl" />
      <FontAwesomeIcon
        icon={faComments}
        color={!showSettings ? "white" : "gray"}
        onClick={() => navigation("/home",{state:{name:name,showSettings:false}})}
        size="xl"
      />
      <FontAwesomeIcon
        icon={faGear}
        color={showSettings ? "white" : "gray"}
        size="xl"
        onClick={() => navigation("/settings",{state:{showSettings:true}})}
      />
    </div>
  );
};

export default NavBar;
