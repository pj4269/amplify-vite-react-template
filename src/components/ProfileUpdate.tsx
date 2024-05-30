import { useState, useEffect,  ChangeEvent  } from 'react';
import { fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';
import {  confirmUserAttribute} from 'aws-amplify/auth';  // type ConfirmUserAttributeInput 

function ProfileUpdate() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('')

  // 1. fetching user info
  const fetchCurrentUserEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      const email = user.email ?? '';
      setCurrentEmail(email);
    } catch (error) {
      console.error('Error fetching current user email:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUserEmail();
  }, []);
  
  // 2. When the button is click: NewEmail becomes the input

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };
  
  // 3. Update User Attribute : 
  const handleUpdateUserAttribute = async (attributeKey: string, value: string) => {
    setMessage(`Confirmation code was sent to ${newEmail}.`);
    
    alert(`Confirmation code was sent to ${newEmail}.`);
    
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value
        }
      });
      // 3. a) basically sending verification code to the newEmail from the "email" input - makes sense
      handleUpdateUserAttributeNextSteps(output);
      // Sending verification code to the new email  => understand it => ???? => This is not necessary!
      //await handleSendUserAttributeVerificationCode(value);
    } catch (error: any) {
      console.log(error);
      throw error; // Rethrow the error to catch it in the save method
    }
  };

  const handleUpdateUserAttributeNextSteps = (output: any) => {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        console.log(
          `Confirmation code was sent to ${newEmail}.`
        );
        // Collect the confirmation code from the user and pass to confirmUserAttribute.
        break;
      case 'DONE':
        console.log(`Attribute was successfully updated.`);
        break;
    }
  };

  const handleConfirmUserAttribute = async () => {
    try {
      await confirmUserAttribute({ userAttributeKey: 'email', confirmationCode });
      console.log('Attribute confirmed successfully.');
    } catch (error) {
      console.log('Error confirming attribute:', error);
    }
  };

  return (
    <div>
      <h1>Update Email</h1>
      <div>
        <p>Current Email: {currentEmail}</p>
        <input
          type="email"
          value={newEmail}
          onChange={handleInputChange}
          placeholder="Enter new email"
        />
        <button onClick={() => handleUpdateUserAttribute('email', newEmail)}>Update Email</button>
        <b>{message}</b>
      </div>
      <div>
        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter confirmation code"
        />
        <button onClick={handleConfirmUserAttribute}>Confirm Change</button>
      </div>
    </div>
  );
}

export default ProfileUpdate;

