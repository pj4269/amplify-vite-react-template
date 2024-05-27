import { useState, useEffect } from 'react';
import { fetchUserAttributes, updateUserAttribute, confirmUserAttribute, sendUserAttributeVerificationCode, AuthSendUserAttributeVerificationCodeInput } from 'aws-amplify/auth';

interface UserInfo {
  email: string;
  bio: string;
  // Add more user info as needed
}

function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    // Add more user info as needed
  });

  const [editedEmail, setEditedEmail] = useState<string>('');
  
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      const user = await fetchUserAttributes();
      const email = user.email ?? ''; // Ensure email is not undefined
      setUserInfo(prevState => ({
        ...prevState,
        email: email
      }));
      setEditedEmail(email); // Update editedEmail with fetched email
    } catch (error: any) {
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
    } catch (error: any) {
      console.log('Error updating email: ', error);
      setErrorMessage(error.message); // Set error message here
    }
  };

  const handleCancelEditEmail = () => {
    // Reset the edited email to the current user email
    setEditedEmail(userInfo.email);
    setIsEditingEmail(false);
  };

  const handleUpdateUserAttribute = async (attributeKey: string, value: string) => {
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
    } catch (error: any) {
      console.log(error);
      throw error; // Rethrow the error to catch it in the save method
    }
  };

  const handleUpdateUserAttributeNextSteps = (output: any) => {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${editedEmail}.` // Use editedEmail instead of userInfo.email
        );
        // Collect the confirmation code from the user and pass to confirmUserAttribute.
        break;
      case 'DONE':
        console.log(`Attribute was successfully updated.`);
        break;
    }
  };

  const handleSendUserAttributeVerificationCode = async (email: string) => {
    try {
      await sendUserAttributeVerificationCode({
        userAttributeKey: 'email',
        email
      } as AuthSendUserAttributeVerificationCodeInput);
      setIsVerifyingEmail(true);
    } catch (error: any) {
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
    } catch (error: any) {
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

