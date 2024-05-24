import { useState, useEffect } from 'react';
import { fetchUserAttributes, updateUserAttribute, confirmUserAttribute, sendUserAttributeVerificationCode } from 'aws-amplify/auth';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    // Add more user info as needed
  });

  const [editedEmail, setEditedEmail] = useState('');
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      //const email = user.email;
      const email = user.email ?? ''; // Ensure email is not undefined
      setUserInfo(prevState => ({
        ...prevState,
        email: email
      }));
    } catch (error) {
      console.log('Error fetching email: ', error);
    }
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      await handleUpdateUserAttribute('email', editedEmail);
      setIsEditingEmail(false);
    } catch (error) {
      console.log('Error updating email: ', error);
      setErrorMessage(error.message); // Set error message here
    }
  };

  const handleCancelEditEmail = () => {
    // Reset the edited email to the current user email
    setEditedEmail(userInfo.email);
    setIsEditingEmail(false);
  };

  const handleUpdateUserAttribute = async (attributeKey, value) => {
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value
        }
      });
      handleUpdateUserAttributeNextSteps(output);
      // Send verification code to the new email
      await handleSendUserAttributeVerificationCode(value);
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to catch it in the save method
    }
  };

  const handleUpdateUserAttributeNextSteps = (output) => {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
        );
        // Collect the confirmation code from the user and pass to confirmUserAttribute.
        break;
      case 'DONE':
        console.log(`Attribute was successfully updated.`);
        break;
    }
  };

  const handleSendUserAttributeVerificationCode = async (email) => {
    try {
      await sendUserAttributeVerificationCode({
        userAttributeKey: 'email',
        email
      });
      setIsVerifyingEmail(true);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message); // Set error message here
    }
  };

  const handleConfirmEmail = async () => {
    try {
      await confirmUserAttribute({
        userAttributeKey: 'email',
        confirmationCode: verificationCode
      });
      setIsVerifyingEmail(false);
      // If confirmation succeeds, update the local state with the new email
      setUserInfo(prevState => ({
        ...prevState,
        email: editedEmail
      }));
    } catch (error) {
      console.log('Error confirming email: ', error);
      setIsVerifyingEmail(false);
      setErrorMessage(error.message); // Set error message here
    }
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message here */}

      <div>
        <label>Email:</label>
        {isEditingEmail ? (
          <>
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
            <button onClick={handleSaveEmail}>Save</button>
            <button onClick={handleCancelEditEmail}>Cancel</button>
          </>
        ) : (
          <>
            <span>{userInfo.email}</span>
            <button onClick={handleEditEmail}>Edit</button>
          </>
        )}
      </div>

      {/* Verification code input */}
      {isVerifyingEmail && (
        <div>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleConfirmEmail}>Confirm</button>
        </div>
      )}
    </div>
  );
}

export default Profile;

