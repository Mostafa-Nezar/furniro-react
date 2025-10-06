import { MdClose } from "react-icons/md"; 
import { useAppContext } from "../context/AppContext";

const ShareButtons = () => {
  const { ShareButtons,toggleShareButtons } = useAppContext();
  const projectTitle = encodeURIComponent("Check out this project!");

  const handleShareClick = (platform) => {
    const url = "https://furniro-react-jade.vercel.app/";
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${projectTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${projectTitle}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${url}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400,left=500,top=100");
    }
  };

  return (
    <div
      className={`page ${ShareButtons? "" :"d-none"}`}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        color: "black",
        padding: "16px",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        transition: "opacity 0.5s ease, visibility 0.5s ease",
      }}
    >
      <div
      onClick={()=>{toggleShareButtons()}}
        style={{
          cursor: "pointer",
          display: "inline",

          padding: "5px 10px",
          color: "white",
          backgroundColor:"var(--redcolor)"
        }}
      >
       <MdClose/>
      </div>
      <div className="container pt-4 mt-5">
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt="Product"
            className="img-fluid"
          />
          <h1 className="text-center fw-bold">#Furnirofurnature</h1>
          <p className="text-black-50 text-center mt-2">
            Share Your fav product
          </p>
        </div>
        <div className="p-5 pt-0 text-center">
          <div className="row">
            <p>
              <svg
                style={{ cursor: "pointer" }}
                className="share-icon twitter me-3"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 1024 1024"
                onClick={() => handleShareClick("twitter")}
              >
                <path
                  fill="currentColor"
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m215.3 337.7c.3 4.7.3 9.6.3 14.4c0 146.8-111.8 315.9-316.1 315.9c-63 0-121.4-18.3-170.6-49.8c9 1 17.6 1.4 26.8 1.4c52 0 99.8-17.6 137.9-47.4c-48.8-1-89.8-33-103.8-77c17.1 2.5 32.5 2.5 50.1-2a111 111 0 0 1-88.9-109v-1.4c14.7 8.3 32 13.4 50.1 14.1a111.13 111.13 0 0 1-49.5-92.4c0-20.7 5.4-39.6 15.1-56a315.28 315.28 0 0 0 229 116.1C492 353.1 548.4 292 616.2 292c32 0 60.8 13.4 81.1 35c25.1-4.7 49.1-14.1 70.5-26.7c-8.3 25.7-25.7 47.4-48.8 61.1c22.4-2.4 44-8.6 64-17.3c-15.1 22.2-34 41.9-55.7 57.6"
                />
              </svg>
              <svg
                style={{ cursor: "pointer" }}
                className="share-icon whatsapp me-3"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={() => handleShareClick("whatsapp")}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 2.838A1.838 1.838 0 0 1 2.838 1H21.16A1.837 1.837 0 0 1 23 2.838V21.16A1.838 1.838 0 0 1 21.161 23H2.838A1.838 1.838 0 0 1 1 21.161V2.838zm8.708 6.55h2.979v1.496c.43-.86 1.53-1.634 3.183-1.634 3.169 0 3.92 1.713 3.92 4.856v5.822h-3.207v-5.106c0-1.79-.43-2.8-1.522-2.8-1.515 0-2.145 1.089-2.145 2.8v5.106H9.708V9.388zm-5.5 10.403h3.208V9.25H4.208v10.54zM7.875 5.812a2.063 2.063 0 1 1-4.125 0 2.063 2.063 0 0 1 4.125 0z"
                />
              </svg>
              <svg
                style={{ cursor: "pointer" }}
                className="share-icon facebook"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={() => handleShareClick("facebook")}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 12.067C0 18.033 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067z"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;
