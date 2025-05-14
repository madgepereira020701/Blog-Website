import React, { useState } from 'react';
import './Auth.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { API } from '../service/api';
const registerInitialValues = { username:'', email:'', password:''};
const loginInitialValues = { username:'', email:'', password:''};


const Auth = ({setIsAuthenticated, setUserName}) => {
    const [register , setRegister] = useState(registerInitialValues);
    const [login , setLogin] = useState(loginInitialValues);
    const [account , toggleAccount] = useState('login');
    const [error , setError] = useState('');
    const [warnings , setWarnings] = useState({});
    const navigate = useNavigate();
    const [showpassword , setShowpassword] = useState(false);
    const [redirectToHome , setRedirectToHome] = useState(false);
    

    const handleClick = () => {
        navigate('./changepassword');
    }


    const toggleSignup = () => {
        toggleAccount(account === 'register' ? 'login' : 'register');
        setError('');
        setWarnings({});
    }

        const togglePasswordVisibility = () => {
        setShowpassword(!showpassword);
    }


    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) =>  password.length >= 6;

    const onInputChange  = (e) => {
       setRegister({...register, [e.target.name]: e.target.value});
       validateFields('register', e.target.name, e.target.value);
    }

    const onValueChange  = (e) => {
        setLogin({...login, [e.target.name]: e.target.value});
        validateFields('login', e.target.name, e.target.value);
 
    }


    const validateFields = (form, field, value) => {
        const newWarnings = {...warnings};
        if(field === 'email' && !validateEmail(value)) {
            newWarnings.email = 'Email required';
        } else if(field === 'password' && !validatePassword(value)) {
            newWarnings.password = 'Password required';
        } else {
            delete newWarnings[field];
        }

        if(form === 'register' && field === 'name' && value.trim() === '' ) {
            newWarnings.name = 'Name required';
        } else if(form === 'register' && field === 'name') {
            delete newWarnings.name;
        }

        setWarnings(newWarnings);
    }


    const registerUser = async( ) => {
        if(!register.username || !register.email || !register.password ) {
       setError('Fill in all the fields');
            return;
        }

        if(Object.keys(warnings).length > 0) {
           setError('Resoleve all warnings');
            return;
        }

        try {
        const response = await API.userregister(register);
        if(response.isSuccess) {
            setRegister(registerInitialValues);
            toggleAccount('login');
            setError('');
        }
        else {
            setError('Something went wrong, try again.');
        }
    } catch (err) {
        setError('An error occurred. Please try again later.');
        console.error('Error in registerUser:', err);
      }
    };

    const loginUser = async( ) => {
        if(!login.email || !login.password ) {
       setError('Fill in all the fields');
            return;
      }

        if(Object.keys(warnings).length > 0) {
           setError('Resoleve all warnings');
           return;
        }

      try {
       const response = await API.userlogin(login);
         if(response.isSuccess) {
         setIsAuthenticated(true);
         setUserName(response.data.userName);
         localStorage.setItem('userName', response.data.userName);
             localStorage.setItem('token', response.data.token);
             setRedirectToHome(true);
            setError('');
      }
         else {
            setError('Invalid credentials, please try again.');

        }
    }
    catch (err) {
        setError('An error occurred. Please try again later.');
        console.error(err);
    }


    }

    if(redirectToHome) {
       return <Navigate to = '/addpost' replace />
    }
    
    return (
    <div className='form-container'>
        {account === 'login' ? (
                       <div>
            <h2>Login</h2>
                                {error && <div className='error'>{error}</div>}
            <input type='email' name='email' placeholder='Email' className='input-field' onChange={onValueChange}/><br/><br/>
                    {warnings.email && <div className='warnings'>{warnings.email}</div>}
                                            <p onClick={handleClick}>Forgot Password</p>
                                            <div className="password-container">
            <input type={showpassword ?'text':'password'} name='password' className='input-field' placeholder='Password' onChange={onValueChange}/><br/><br/>
                    {warnings.password && <div className='warnings'>{warnings.password}</div>}<br/>
                    <span className='material-icons show-hide' onClick={togglePasswordVisibility}>{showpassword ? 'visibility' : 'visibility_off'}</span>
                    </div>
            <button onClick={loginUser}>Login</button><br/>
                        <p>or</p> 
            <button onClick={toggleSignup}>Register</button>
            </div>
            
        ) : (
            <div>
                    <h2>Register</h2>
                        {error && <div className='error'>{error}</div>}                
                    <input type='text' name='username' className='input-field' placeholder='Username' onChange={onInputChange}/><br/><br/>
                        {warnings.name && <div className='warnings'>{warnings.name}</div>}<br/>                
                    <input type='email' name='email' className='input-field' placeholder='Email' onChange={onInputChange}/><br/><br/>
                        {warnings.email && <div className='warnings'>{warnings.email}</div>}<br/>        
                        <p onClick={handleClick}>Forgot Password</p>
                    <div className="password-container">        
                    <input type={showpassword ?'text' : 'password'} name='password' className='input-field' placeholder='Password' onChange={onInputChange}/><br/><br/>
                        {warnings.password && <div className='warnings'>{warnings.password}</div>}<br/>
                        <span className='material-icons show-hide' onClick={togglePasswordVisibility}>{showpassword ? 'visibility' : 'visibility_off'}</span>
                    </div>    

                    <button onClick={registerUser}>Register</button><br/>
                    <p>or</p> 
                    <button onClick={toggleSignup}>Login</button>
            </div>

    
        )}

    </div>
    );

}


export default Auth;