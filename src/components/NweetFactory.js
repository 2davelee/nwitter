import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { collection, addDoc } from 'firebase/firestore'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }
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
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
};

const onClearAttachment = () => setAttachment("");

  return (
          <form onSubmit={onSubmit} className="factoryForm">
          <div className="factoryInput__container">
          <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
           />
           <input type="submit" value="&rarr;" className="factoryInput__arrow" />
           </div>
           <label htmlFor="attach-file" className="factoyInput__label">
             <span>Add photos</span>
             <fontawesome icon={faPlus} />
           </label>
            <input id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{ opacity:0, }}/>
           {attachment && (
              <div className="factoryForm__attachment">
                  <img src={attachment} style={{ backgroundImage: attachment,}} />
              <div className="factoryForm__clear" onClick={onClearAttachment}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes}/>
              </div>
            </div> 
           )}
      </form>
    );
};

export default NweetFactory;