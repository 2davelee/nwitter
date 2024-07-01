import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthForm = () => {
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {
          target: { name, value },
        } = event;
        if (name === "email") {
          setEmail(value);
        } else if (name === "password") {
          setPassword(value);
        }
      };
  
      const onSubmit = async (event) => {
          event.preventDefault();
          try {
            let data;
          if (newAccount) {
              // create newAccount
              data = await createUserWithEmailAndPassword(auth, email, password);
          } else {
              // log in
              data = await signInWithEmailAndPassword(auth, email, password);
          }
        } catch (error) {
          setError(error.message);
        }
      };
      
      const toggleAccount = () => setNewAccount((prev) => !prev);
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name ="email" 
                    type ="email"
                    placeholder="email" 
                    required
                    value={email}
                    onChange={onChange}
                    />
                <input
                    name="password" 
                    type ="password" 
                    placeholder="password" 
                    required 
                    value={password}
                    onChange={onChange}
                    />
                <input type ="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>


        </div>
    )
};

export const firebaseInstance = getAuth();
export default AuthForm;