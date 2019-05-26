import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status}
    });
  }
};

// Create Or update profile
// history object has a method called PUSH will redirect us to the client site route
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    // since we sending the Data we need the config object
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // we making post request to /api/profile
    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Profile updated" : "Profile Created", "success"));
    
    if(!edit) {
      history.push("/dashboard");
    }

  } catch (err) {
    console.log(err.response);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status}
    });

  }
}

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    // since we sending the Data we need the config object
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // we making post request to /api/profile
    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', "success"));
    history.push("/dashboard");
  

  } catch (err) {
    console.log(err.response);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status}
    });

  }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  try {
    // since we sending the Data we need the config object
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    // we making post request to /api/profile
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added', "success"));
    history.push("/dashboard");
  

  } catch (err) {
    console.log(err.response);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status}
    });

  }
}