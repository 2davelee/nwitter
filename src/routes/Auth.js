import { authService } from "fbase";
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import AuthForm from "components/AuthForm"

function Auth() {
    const onSocialClick = async (event) => {
      const {
        target: { name },
      } = event;
      let provider;
      if (name === "google") {
        provider = new GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstance.auth.GithubAuthProvider();
      }
    
      const data = await signInWithPopup(authService, provider);
      console.log(data);

    };

    return (
        <div>
            <AuthForm />
          <div>   
            <button onClick={onSocialClick} name= "google">Continue with Google</button>
            <button onClick={onSocialClick} name= "github">Continue with Github</button>
          </div>
        </div>
    );
};

export const firebaseInstance = getAuth();
export default Auth;