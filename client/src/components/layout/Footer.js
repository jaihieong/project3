import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter, MDBBtn, MDBIcon} from "mdbreact";

const FooterPage = () => {
  return (
    <MDBFooter color="cyan" className="font-small darken-3 pt-0">
      
      
      <div className="footer-copyright text-center py-5">


                <div className="mb-5 flex-left col-4 ">
                <MDBBtn size="lg" tag="a" floating social="fb" color="primary">
                <MDBIcon fab icon="facebook-f" /> </MDBBtn>
                </div>

                <div className="mb-5 flex-left col-4 ">
                <MDBBtn size="lg" tag="a" floating social="git" color="primary">
                <MDBIcon fab icon="github" />
                </MDBBtn>
                </div>


                <div className="mb-6 flex-left col-4 ">
                <MDBBtn size="lg" tag="a" floating social="li" color="primary">
                <MDBIcon fab icon="linkedin-in" />
                </MDBBtn>
                </div>
               
                <div className="mb-6 flex-left col-4 ">
                <MDBBtn size="lg" tag="a" floating social="email" color="primary">
                <MDBIcon icon="envelope" />
                <a href="#!" className="email-ic mr-5"></a>
                </MDBBtn>
                       
                </div>

          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a href="https://github.com/jaihieong/project3">PARS</a>
      
      </div>
    </MDBFooter>
  );
}

export default FooterPage;