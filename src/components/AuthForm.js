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
            <form onSubmit={onSubmit} className="container">
                <input
                    name ="email" 
                    type ="text"
                    placeholder="email" 
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                    />
                <input
                    name="password" 
                    type ="password" 
                    placeholder="password" 
                    required 
                    value={password}
                    onChange={onChange}
                    className="authInput"
                    />
                <input type ="submit" value={newAccount ? "Create Account" : "Log In"}
                                      className= "authInput authSubmit"
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In" : "Create Account"}
            </span>


        </div>
    )
};

export const firebaseInstance = getAuth();
export default AuthForm;