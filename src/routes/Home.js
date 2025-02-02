import { dbService } from "fbase";
import { query, collection, onSnapshot, orderBy } from 'firebase/firestore'
import { useState, useEffect } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

function Home({ userObj }) {
    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const q = query(collection(dbService, 'nweets'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
        }));
        setNweets(nweetArray);
      });
    };
    useEffect(() => {  
      getNweets();
    }, []);

    return (
      <div className="container">
          <NweetFactory userObj={userObj} />
        <div style={{ marginTop: 30 }}>
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