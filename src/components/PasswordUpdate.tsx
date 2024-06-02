import React, { useState, ChangeEvent, FormEvent } from 'react';
// @ts-ignore   
import zxcvbn from 'zxcvbn'; // // @ts-ignore -> will surpass the Type related errors
import {
  Flex,
  Heading,
  TextField,
  PasswordField,
  Button,
  useTheme,
} from '@aws-amplify/ui-react';
import { updatePassword } from 'aws-amplify/auth';

interface FormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
  const { tokens } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // State to hold password strength

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate password strength when the user types
    if (name === 'newPassword') {
      const result = zxcvbn(value);
      setPasswordStrength(result.score); // Set the password strength score
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password don't match");
      return;
    }

    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setFormData({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccessMessage('Password changed successfully');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Flex as="form" direction="column" gap={tokens.space.medium} onSubmit={handleSubmit}>
      <Heading level={3}>Change Password</Heading>
      <TextField
        label="email"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
      />
      <PasswordField
        label="Current password"
        name="currentPassword"
        autoComplete="current-password"
        value={formData.currentPassword}
        onChange={handleChange}
        descriptiveText="Password must be at least 8 characters"
      />
      <PasswordField
        label="New password"
        name="newPassword"
        autoComplete="new-password"
        value={formData.newPassword}
        onChange={handleChange}
        //descriptiveText={'Password must be at least 8 characters <br/>'+ 
        //                 ` Password strength: ${passwordStrength}/4`} // Display password strength
          descriptiveText={
    <>
      Password must be at least 8 characters <br />
      <span style={{ color: 'red' }}>Password strength: {passwordStrength}/4</span>
   
    </>
  }                  
      />
      <PasswordField
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <Button type="submit">Submit</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </Flex>
  );
};

export default ChangePasswordForm;

