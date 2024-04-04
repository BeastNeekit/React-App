import React from 'react';
import '../css/Notification.css'
function Notification({ message, type, onClose }) {
    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
        </div>
    );
}

export default Notification;
