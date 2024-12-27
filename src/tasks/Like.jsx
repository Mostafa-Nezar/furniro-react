import { useEffect, useState } from "react";
import { useMyContext } from "../tasks/MyContext";

export default function Like() {
  const { isSubscribed } = useMyContext();
  const [liked, setLiked] = useState(false);
  const [emails, setEmails] = useState(() => JSON.parse(localStorage.getItem("emails")) || []);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (emails.length > 0 && isSubscribed) {
      setLiked(emails[0].liked || false);
    } else {
      setLiked(false);
    }
  }, [emails, isSubscribed]);

  const handleLikeClick = () => {
    if (isSubscribed) {
      const updatedLiked = !liked; 
      setLiked(updatedLiked);

      const updatedEmails = [...emails];
      if (updatedEmails.length > 0) {
        updatedEmails[0].liked = updatedLiked;
        setEmails(updatedEmails);
        localStorage.setItem("emails", JSON.stringify(updatedEmails));
      }

      localStorage.setItem("color", updatedLiked ? "red" : "black");
      localStorage.setItem("fill", updatedLiked ? "currentColor" : "none");
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div
      id="heart"
      className={`heart-icon ${liked ? "red" : ""}`}
      onClick={handleLikeClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          className="pathsvg"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8z"
        />
      </svg>
      {showPopup && <div className="popup show">Not Subscribed!</div>}
    </div>
  );
}
