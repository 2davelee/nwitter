import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { collection, addDoc } from 'firebase/firestore'
import { useState } from "react";

function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== ""){
        const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const uploadFile = await uploadString(fileRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(uploadFile.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, 'nweets'), nweetObj)
    setNweet(""); 
    setAttachment("");
};

const onChange = (event) => {
    const {
        target: {value},
    } = event;
    setNweet(value);
};

const onFileChange = (event) => {
    const {
        target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
        const {
            currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
    };
    reader.readAsDataURL(theFile);
};

const onClearAttachment = () => setAttachment("");

  return (
          <form onSubmit={onSubmit}>
          <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
           />
           <input type="file" accept="image/*" onChange={onFileChange}/>
           <input type="submit" value="Nweet" />
           {attachment && (
              <div>
                  <img src={attachment} width="50px" height="50px" />
                  <button onClick={onClearAttachment}>Clear</button>
              </div> 
           )}
      </form>
    );
};

export default NweetFactory;

