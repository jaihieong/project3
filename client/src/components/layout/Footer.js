import React from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBFooter,
  MDBBtn,
  MDBIcon
} from "mdbreact";

const FooterPage = () => {
  return (
    <MDBFooter color="cyan" className="font-small darken-3 pt-10">
      <div className="footer-copyright text-center py-5">
        <div className="footer">
          <div className="mb-5 flex-left col-4 ">
            <MDBBtn
              size="lg"
              tag="a"
              floating
              social="git"
              color="primary"
              href="https://github.com/jaihieong/project3"
            >
              <MDBIcon fab icon="github" />
            </MDBBtn>
          </div>
          <div className="mb-6 center col-4 ">
            <MDBBtn
              size="lg"
              tag="a"
              floating
              social="email"
              color="primary"
              href="https://www.gmail.com"
            >
              <MDBIcon icon="envelope" />
              <a href="#!" className="email-ic mr-5" />
            </MDBBtn>
          </div>
          &copy; {new Date().getFullYear()} Copyright:{" PARS"}
          <p>PARS</p>
        </div>
      </div>
    </MDBFooter>
  );
};

export default FooterPage;
