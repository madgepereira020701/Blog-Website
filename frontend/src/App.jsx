import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Auth from './components/Auth/Auth';
import ChangePassword from './components/ChangePassword/ChangePassword';
import PostForm from './components/PostForm/PostForm';
import Posts from './components/Posts/Posts';
import Navbar from './components/Navbar/Navbar';
import React, { useState } from 'react';
import ViewPost from './components/ViewPost/ViewPost';
import PostHistory from './components/PostHistory/PostHistory';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');


  return (
    <>
      <div>
           <BrowserRouter>
           {isAuthenticated && (
          <Navbar
            isAuthenticated={isAuthenticated}
            userName={userName}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}

           <Routes>
           <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/posts" />
              ) : (
                <Auth
                  setIsAuthenticated={setIsAuthenticated}
                  setUserName={setUserName}
                />
              )
            }
          />

            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="/addpost" element={<PostForm/>}/>
            <Route path="/posts" element={<Posts/>}/>
            <Route path="/post/:title" element={<ViewPost />}/>
            <Route path="/post/:id/history" element={<PostHistory />}/>
           </Routes>
           </BrowserRouter>
        </div>
    </>
  )
}

export default App;
