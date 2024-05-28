import React, { useState, useEffect } from 'react';
import { fetchUserAttributes} from '@aws-amplify/auth';


function Test2() {
  const [currentEmail, setCurrentEmail] = useState('');

  // 1. User attributes
  // Function to fetch and set the current user's email
  const fetchCurrentUserEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      const email = user.email ?? '';
      console.log(user);
      setCurrentEmail(email);
    } catch (error) {
      console.error('Error fetching current user email:', error);
    }
  };

  // Fetch the current user's email on component mount
  useEffect(() => {
    fetchCurrentUserEmail();
  }, []);


  // 2. Update user attribute: 






  return (
    <div>
      <h1>Update Email</h1>
      <div>
        <p>Current Email: {currentEmail}</p>
      </div>

    </div>
  );
}

export default Test2;

