import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';
import Profile from './components/Profile';
import ProfileUpdate from './components/ProfileUpdate'
import DeleteAcc from './components/Delete'
//import type { AuthEventData } from '@aws-amplify/ui-components';



// Remove unused import statement for CognitoUserInterface
// import { CognitoUserInterface } from '@aws-amplify/ui-components'; // May 23: 12:52 pm

const client = generateClient<Schema>();

// Define the User interface
/*
interface User {
  id: number;
  username: string;
  // Add other properties as needed
}  



interface MainContentProps {
  user: any; //User | undefined; // Allow user to be undefined
  signOut: () => void;
}  */

interface MainContentProps {
  user: any; //User | undefined; // Allow user to be undefined
  signOut: any;//((data?: AuthEventData | undefined) => void) | undefined;
}              //  signOut: (() => void) | undefined; 



function App() {
  return (
    <Authenticator  loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Main</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link> 
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>              
              <li>
                <Link to="/test">Profile Update</Link>
              </li> 
              <li>
                <Link to="/delete">Delete</Link>
              </li>                                           
            </ul>
          </nav>
          <Routes>
            {/* Pass user and signOut to MainContent */}
            <Route path="/" element={<MainContent user={user} signOut={signOut} />} />
            <Route path="/profile" element={<Profile/>} /> 
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<ProfileUpdate />} />
            <Route path="/delete" element={<DeleteAcc />} />            
            
            
      

          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

const MainContent = ({ user, signOut }: MainContentProps) => {
  
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const printUserEmail = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log('Email:', userAttributes.email);
    } catch (e) {
      console.log(e);
    }
  };

  function createTodo() {
    client.models.Todo.create({ content: window.prompt('Todo content') });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      {/* Access user properties conditionally */}
      <h1>{user?.username}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">Review next step of this tutorial.</a>
      </div>

      <button onClick={signOut}>Sign out</button>

      {/* Access user properties conditionally */}
      {user && (
        <>
          <h1>Hello {user.username}</h1>
          <button onClick={printUserEmail}>Print Attributes</button>
        </>
      )}
    </main>
  );
};

export default App;

