import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './signupPage.css';
import logo from '../../assets/logo.jpg';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('job_seeker');
    const [profilePicture, setProfilePicture] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [resume, setResume] = useState('');
    const [company, setCompany] = useState('');
    const [userOTP, setUserOTP] = useState('');
    const [curr, setCurr] = useState(0);
    const [loadButton, setLoadButton] = useState(true);
    const [hashedPassword, setHashedPassword] = useState('');
    const [genOtp, setGenOtp] = useState('');

    const onSignup = (event) => {
        event.preventDefault();
        axios.post("http://localhost:4001/users/signupUser", { name, email, password, repassword: password, role })
            .then((res) => {
                setLoadButton(false);
                setHashedPassword(res.data.hashed_password);
                axios.post("http://localhost:4001/users/sendOTP", { username: email })
                    .then((response) => {
                        setGenOtp(response.data.otp);
                        setCurr(1);
                    })
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const checkOTP = () => {
        axios.post("http://localhost:4001/users/checkOTP", { otp: genOtp, userOTP })
            .then((res) => {
                if (res.status === 200) {
                    setCurr(2);
                } else {
                    alert("Invalid OTP");
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const onSubmitDetails = (event) => {
        event.preventDefault();
        axios.post("http://localhost:4001/users/addUser", { name, email, password: hashedPassword, role, profilePicture, phone, location, bio, resume, company })
            .then((response) => {
                axios.post("http://localhost:4001/users/loginUser", { username: email, password })
                    .then((res) => {
                        const responseData = res.data;
                        const token = responseData.token;
                        localStorage.setItem("token", `Bearer ${token}`);
                        window.location.href = "/home";
                    })
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <div className="register-page">
            <div className="logo-container">
                <NavLink to="/">
                    <img src={logo} alt="Logo" className="register-logo" />
                </NavLink>
            </div>
            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={curr === 0 ? onSignup : curr === 2 ? onSubmitDetails : (e) => e.preventDefault()} className="register-form">
                    {curr === 0 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="job_seeker">Job Seeker</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>
                            <button type="submit" className="register-submit-button">Next</button>
                        </>
                    )}
                    {curr === 1 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="userOTP">Enter OTP</label>
                                <input
                                    type="text"
                                    id="userOTP"
                                    value={userOTP}
                                    onChange={(e) => setUserOTP(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="button" onClick={checkOTP} className="otp-submit-button">Verify OTP</button>
                        </>
                    )}
                    {curr === 2 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="profilePicture">Profile Picture URL</label>
                                <input
                                    type="text"
                                    id="profilePicture"
                                    value={profilePicture}
                                    onChange={(e) => setProfilePicture(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="resume">Resume URL</label>
                                <input
                                    type="text"
                                    id="resume"
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="register-submit-button">Submit</button>
                        </>
                    )}
                </form>
                <div className="login-link">
                    <NavLink to="/login" className="login-link-text">Already have an account?</NavLink>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
