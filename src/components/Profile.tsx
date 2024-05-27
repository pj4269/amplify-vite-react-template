import { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState({ email: '' });


  const fetchEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      const email = user.email ?? ''; // Ensure email is not undefined
      setUserInfo(prevState => ({
        ...prevState,
        email: email
      }));

    } catch (error) {
      console.log('Error fetching email: ', error);
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  return (
    <div className="profile">
      <h2>Profile Page</h2>
      <div className="profile-details">
        <p><strong>Email:</strong> {userInfo.email}</p>
      </div>
    </div>
  );
}

export default ProfilePage;

