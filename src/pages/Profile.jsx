import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const auth = getAuth()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  const logout = () => {
    auth.signOut()
    navigate('/')
  }  

  return <div class="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="submit" className="logOut" onClick={logout}>Logout</button>
    </header>
    <h2>{name}</h2>
  </div>
}

export default Profile;
