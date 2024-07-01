import { dbService } from "fbase";
import { query, collection, addDoc, onSnapshot } from 'firebase/firestore'
import { useState, useEffect } from "react";
import Nweet from "components/Nweet";

function Home({ userObj }) {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    
    useEffect(() => {
        const q = query(collection(dbService, 'nweets'));
        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, 'nweets'), {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;


Profile2
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const getMyNweets =async () => {
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
}, []);