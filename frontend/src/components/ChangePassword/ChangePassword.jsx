import React, {useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../service/api';
    const changepasswordinitials = {newpassword: '', confirmpassword: ''};

 
const ChangePassword = () => {
    const [error, setError] = useState('');
    const [warnings, setWarnings] = useState({});
    const [showpassword, setShowpassword] = useState(false);
    const [changePassword, setChangepassword] = useState(changepasswordinitials);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')

    const togglePasswordVisibility = () => {
        setShowpassword(!showpassword);
    }

    const validatePassword = (password) => password.length >=6;
    const validateFields = (field,value) => {
        const newWarnings = {...warnings};
      if(field === 'newpassword' && !validatePassword(value)) {
        newWarnings.newpassword = 'Passwords must be at least 6 characters';
      }
        else if(field === 'confirmpassword' && !validatePassword(value) && value!=changePassword.newpassword) {
        newWarnings.newpassword = 'Passwords must be at least 6 characters';
      }
            else {
        delete newWarnings[field];
      }
       
      setWarnings(newWarnings);
    }

    const confirmUser = async () => {
        if(!changePassword.newpassword || !changePassword.confirmpassword) {
            setError('Fill in the fields');
            return;
        }
        if(Object.keys(warnings).length > 0) {
            setError('Resolve all warnings');
            return;

        }

        try {
        const response = await API.updatePassword(token,changePassword);
        if(response) {
            alert('Done');
            navigate('/');
        }
        }
        catch (err) {
            setError(err);
        }
    }

    const onInputChange = (e) => {
        setChangepassword({...changePassword, [e.target.name]: e.target.value});
        validateFields(e.target.name, e.target.value);
    }

    return (
        <div className='form-container'>
                    <h2>Change Password</h2>
                        {error && <div className='error'>{error}</div>}                
                    <div className="password-container">        
                    <input type={showpassword ?'text' : 'password'} name='newpassword' className='input-field' placeholder='New Password' onChange={onInputChange}/><br/><br/>
                        {warnings.newpassword && <div className='warnings'>{warnings.newpassword}</div>}<br/>
                        <span className='material-icons show-hide' onClick={togglePasswordVisibility}>{showpassword ? 'visibility' : 'visibility_off'}</span>
                    </div>    
                    <div className="password-container">        
                    <input type={showpassword ?'text' : 'password'} name='confirmpassword' className='input-field' placeholder='Confirm Password' onChange={onInputChange}/><br/><br/>
                        {warnings.confirmpassword && <div className='warnings'>{warnings.confirmpassword}</div>}<br/>
                        <span className='material-icons show-hide' onClick={togglePasswordVisibility}>{showpassword ? 'visibility' : 'visibility_off'}</span>
                    </div>    

                    <button onClick={confirmUser}>Change</button><br/>
            </div>

    );

}

export default ChangePassword;