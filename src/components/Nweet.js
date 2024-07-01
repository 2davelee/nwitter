import React from 'react';
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
import { ref, deleteObject } from "firebase/storage";


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
        <div>
            {editing ? (
                <div>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} value={newNweet} required />
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </div>    
            ) : ( 
            <div>    
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && ( 
                    <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="img" />
                )}
                {isOwner && (
                <div>
                    <button onClick={onDeleteClick}>Delete Nweet</button>
                    <button onClick={toggleEditing}>Edit Nweet</button>
                </div>
                )}
            </div>
          )}     
        </div>
    );
}

export default Nweet;