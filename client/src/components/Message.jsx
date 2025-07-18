import React from "react";
import moment from "moment";

export default function Message({ text, sender, timestamp }) {
    return (
        <div className="message">
            <strong>{sender}</strong>
            <span>{text}</span>
            <small>{moment(timestamp).format("h:mm A")}</small>
        </div>
    );
}
