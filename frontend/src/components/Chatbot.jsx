import React from "react";

/**
 * Chatbot component integrating Google Dialogflow Messenger.
 * You must replace the YOUR_AGENT_ID placeholder with the Agent ID
 * provided in your Dialogflow Console (under Integrations -> Dialogflow Messenger).
 */
const Chatbot = () => {
  return (
    <div>
      <df-messenger
        intent="WELCOME"
        chat-title="WellnessBot"
        agent-id="4f7ea63d-c188-4e8e-88cc-16494fee9739"
        language-code="en"
        chat-icon="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
      ></df-messenger>
      
      <style>{`
        df-messenger {
          --df-messenger-bot-message: #878fac;
          --df-messenger-button-titlebar-color: #2e3650;
          --df-messenger-chat-background-color: #fafafa;
          --df-messenger-font-color: white;
          --df-messenger-send-icon: #2e3650;
          --df-messenger-user-message: #479b3d;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
