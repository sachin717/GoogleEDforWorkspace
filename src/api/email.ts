import { gapi } from "gapi-script";
import * as base64js from "base64-js";

export const sendEmail = async (adminEmails: string[], subject: string, body: string) => {
  const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
//   adminEmails = ['kambojsama84@gmail.com']
  if (!accessToken) {
    console.log("No access token found.");
    return;
  }

  for (const email of adminEmails) {
    const message = [
      `To: ${email}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n");

    const encodedMessage = base64js
      .fromByteArray(new TextEncoder().encode(message))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/${email}/messages/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: encodedMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error sending email to ${email}: ${response.statusText}`);
      }

      console.log(`Email sent successfully to ${email}.`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};
