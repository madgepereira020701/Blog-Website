import React, { useState } from 'react';
import { API } from '../service/api';

const confirmvalue = { email: ''}

const ConfirmEmail = () => {
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState({});
  const [useremail, setUseremail] = useState(confirmvalue);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateFields = (field, value) => {
    const newWarnings = {...warnings};
    if(field === 'email' && !validateEmail(value)) {
      newWarnings.email = 'Valid email address please';
    } else {
        delete  newWarnings.email;
    }
    setWarnings(newWarnings);
  }

  const onInputChange = (e) => {
    setUseremail({...useremail, [e.target.name]: e.target.value});
    validateFields(e.target.name, e.target.value);
  }

      const confirmUser = async () => {
          if(!useremail.newpassword || !useremail.confirmpassword) {
              setError('Fill in the fields');
              return;
          }
          if(Object.keys(warnings).length > 0) {
              setError('Resolve all warnings');
              return;
  
          }
  
          try {
          const response = await API.passwordresetrequest(useremail);
          if(response) {
              alert('Done');
              //navigate('/');
          }
          }
          catch (err) {
              setError(err);
          }
      }

  return (
    <div className="form-container">
                                {error && <div className='error'>{error}</div>}<br/>

        <input type= 'email' name='email' className='input-field' placeholder='Email' onChange={onInputChange}/><br/><br/>
                        {warnings.email && <div className='warnings'>{warnings.email}</div>}<br/>
                        <button onClick={confirmUser}>Confirm</button>

    </div>
  );
}

export default ConfirmEmail;