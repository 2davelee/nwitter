import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
          setIsLoggedIn(true);
          setUserObj(user);
          
          if (user.displayName === null) {
            const name = user.email.split("@")[0];
            user.displayName = name;
          }
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setNewName(userObj.displayName);
  };

  return (
    <>
      {init ? (<AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : ( "initializing..."
      )}
    </>
  );
}

export default App;
