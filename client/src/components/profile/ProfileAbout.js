import React from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({ profile: {
    bio,
    skills,
    user: { name }
    } 
}) => {
    return (
        <div class="profile-about bg-light p-2">
            {bio && (
                <div>
                    <h2 class="text-primary">{name}s BIO</h2>
                    <p>
                        {bio}
                    </p>
                    <div class="line"></div>
                </div>
            )}
            <h2 class="text-primary">Skills: </h2>
            <div class="skills">
                {skills.map((skill, index) => (
                    <div key={index} className="p-1">
                        <i className="fas fa-check" /> {skill}
                    </div>
                ))}
            </div>
        </div>
    )
}

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileAbout
