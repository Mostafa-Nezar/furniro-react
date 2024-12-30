import { useEffect, useState } from "react";
import { useMyContext } from "../tasks/MyContext";

export default function Like() {
  const { emails, updateEmails } = useMyContext();
  const [showPopup, setShowPopup] = useState(false);
  const liked = emails.length > 0 ? emails[0].liked : false;

  useEffect(() => {}, [emails]);

  const handleLikeClick = () => {
    if (emails.length > 0) {
      const updatedLiked = !liked;
      const updatedEmails = [...emails];
      updatedEmails[0].liked = updatedLiked;
      updateEmails(updatedEmails);
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
