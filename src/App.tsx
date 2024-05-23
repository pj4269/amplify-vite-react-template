import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';

const client = generateClient<Schema>();

function App() {
  return (
    <Authenticator hideSignUp loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Main</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<MainContent user={user} signOut={signOut} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

const MainContent = ({ user, signOut }) => {
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
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
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

