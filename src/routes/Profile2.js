import { authService, dbService } from "fbase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data()); 
        });
    };

    useEffect(() => {
        getMyNweets();
    }, [userObj.uid]); // userObj.uid를 종속성 배열에 추가

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name"
                    value={newDisplayName} 
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;