import React, { useState } from "react";
import { useSerialCommunication } from "../../hooks/use-serial-communication.hook";
import styles from "./styles.module.css";

const SerialComponent: React.FC = () => {
  const { connect, disconnect, sendMessage, receivedMessage, isConnected } =
    useSerialCommunication();
  const [message, setMessage] = useState<string>("");

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <h1>Serial Communication</h1>
      <div>
        <button onClick={handleConnect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={handleDisconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          disabled={!isConnected}
        />
        <button onClick={handleSendMessage} disabled={!isConnected || !message}>
          Send
        </button>
      </div>
      <div>
        <h2>Received Message:</h2>
        <p>{receivedMessage || "No messages yet"}</p>
      </div>
    </div>
  );
};

export { SerialComponent };
