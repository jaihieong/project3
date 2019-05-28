import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MDBAnimation } from "mdbreact";

const Landing = ({ isAuthenticated }) => {
  if(isAuthenticated) {
    return<Redirect to='/dashboard' />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h2 className="x-large jumbotron">Develop. Connect. Share.</h2>
          <MDBAnimation type="fadeInLeft" infinite duration="5s" delay="10s">
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          </MDBAnimation>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

Landing.propTypes={
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
