import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavDash.css";

const NavDash = () => {

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="nav">

      <h1>
        Speak<span className="Quest">Quest</span>
      </h1>

      <button
        className="profile-btn"
        onClick={() => setShowMenu(!showMenu)}
      >
        👤
      </button>

      {showMenu && (
        <div className="dropdown">

          <p onClick={() => navigate("/history")}>
            History
          </p>

          <p
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </p>

        </div>
      )}

    </div>
  );
};

export default NavDash;