import React, { useState, useEffect } from 'react';
import { fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState({ email: '' });
  const [editedEmail, setEditedEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      const email = user.email ?? ''; // Ensure email is not undefined
      setUserInfo(prevState => ({
        ...prevState,
        email: email
      }));
      setEditedEmail(email);
    } catch (error) {
      console.log('Error fetching email: ', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUserAttribute({ email: editedEmail }, {});
      setIsEditing(false);
      // Update userInfo with the edited email
      setUserInfo(prevState => ({
        ...prevState,
        email: editedEmail
      }));
    } catch (error) {
      console.log('Error updating email: ', error);
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <div className="profile">
      <h2>Profile Page</h2>
      <div className="profile-details">
        {isEditing ? (
          <>
            <input
              type="email"
              value={editedEmail}
              onChange={e => setEditedEmail(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <button onClick={handleEdit}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

