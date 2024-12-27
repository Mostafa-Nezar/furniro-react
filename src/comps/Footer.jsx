import Subscription from "../tasks/Subscription";

const Copyright = () => {
  const currentYear = new Date().getFullYear();
  return <div id="copyright">© {currentYear}</div>;
};

export default function Myfooter() {

  return (
    <div>
          <div className="footer p-5">
      <div className="row">
        <div className="col-lg-4 col-8">
          <h3 className="fw-bold pb-5">Furniro.</h3>
          <p className="text-black-50">
            300 university drive suit 500  !importantcarol <br /> gabels, <br/>
            fl33134 usa
          </p>
        <Copyright/>
        </div>
        <div className="col-lg-2 col-4">
        <h6 className="text-black-50 p-3">Links</h6>
        <ul className="list-unstyled lh-lg">
          <li ><a className="nav-link p-3" href="/">Home</a></li>
          <li ><a className="nav-link p-3" href="shop">Shop</a></li>
          <li ><a className="nav-link p-3" href="about">About</a></li>
          <li ><a className="nav-link p-3" href="contact">Contact</a></li>
        </ul>
      </div>
        
        <div className="col-lg-2 col-4">
          <h6 className="text-black-50 p-3">Help</h6>
          <ul className="list-unstyled lh-lg">
            <li ><a className="nav-link p-3" href="">Payment Options</a></li>
            <li ><a className="nav-link p-3" href="">Returns</a></li>
            <li ><a className="nav-link p-3" href="">Privacy Policies</a></li>
          </ul>
        </div>
        <div className="col-lg-4 col-8">
          <h6 className="text-black-50 p-3">Newsletter</h6>
          <ul id="sub" className="list-unstyled lh-lg">
            <li >
              <Subscription/>
              </li>
            <li ><a className="nav-link p-3" href="">Privacy Policies</a></li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  )
}