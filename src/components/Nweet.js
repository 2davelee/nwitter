import React from 'react';
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Nweet({ nweetObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
    const attachmentRef = ref(storageService, nweetObj.attachmentUrl);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(NweetTextRef);
            if (nweetObj.attachmentUrl !== ""){
                await deleteObject(attachmentRef);
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
            text: newNweet,
        });
        setEditing(false);
    };

    const onChange = (event) => {
        const{
          target: { value },
        } = event;
        setNewNweet(value);    
        };

    return (
        <div className="nweet">
            {editing ? (
                <div>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input onChange={onChange} value={newNweet} required placeholder="Edit your nweet" autoFocus className="formInput" />
                        <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </div>    
            ) : ( 
            <div>    
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && ( 
                    <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="img" />
                )}
                {isOwner && (
                <div className="nweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
                )}
            </div>
          )}     
        </div>
    );
}

export default Nweet;