import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import ChangePassword from './components/ChangePassword/ChangePassword';
import PostForm from './components/PostForm/PostForm';


function App() {

  return (
    <>
      <div>
           <BrowserRouter>
           <Routes>
            <Route path="/" element={<Auth/>}/>
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="/addpost" element={<PostForm/>}/>

           </Routes>
           </BrowserRouter>
        </div>
    </>
  )
}

export default App;
