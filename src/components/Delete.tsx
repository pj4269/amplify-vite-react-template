import { deleteUser } from 'aws-amplify/auth';

function DeleteAcc() {

  

  
  const handleDeleteUser = async ()=>
  {
    try {
      await deleteUser();
      console.log("The account is deleted")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <h1>Are you sure you want to delete? </h1>
      <p>
        <button onClick={handleDeleteUser}>Delete Account</button>
      </p>
    </div>
  );
}

export default DeleteAcc;

