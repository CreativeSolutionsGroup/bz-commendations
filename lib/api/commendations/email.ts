import { SES, SendEmailCommand } from "@aws-sdk/client-ses";
import { SendEmailCommandInput } from "@aws-sdk/client-ses/dist-types/commands";

const client = new SES({ region: "us-east-2" });

export const sendBzEmail = async (senderEmail: string, recipientEmail: string, senderName: string, message: string) => {
    const params: SendEmailCommandInput = {
        Source: "test@bz-cedarville.com",
        Destination: {
            ToAddresses: [
                recipientEmail
            ]
        },
        Message: {
            Subject: {
                Data: `[bz_commendations] ${senderName} sent you a BZ Commendation`
            },
            Body: {
                Html: {
                    Data:`<div>
                    <img width="500" height="100" src="http://drive.google.com/uc?export=view&id=1hReQjYUGqZXHK_WT1Q7TAhFbx4jVWa4z"/>
                    <div style="margin-top: 20px">
                        <div style="margin-left: 20px">
                            <h2>You have received a new commendation!</h2>
                        </div>
                        <p style="margin-left: 40px; white-space: pre-line">${message}</p>
                        <div style="margin-left: 20px">
                            <h3>- ${senderName}</h3>
                        </div>
                    </div>
                    <div style="margin-left: auto; margin-right: auto">
                        <div style="display: flex">
                            <a style="margin-right: 10px" href="mailto:${senderEmail}">Email Sender</a>
                            ${" "}
                            <a href="mailto:${recipientEmail}">Email Recipient</a>
                        </div>
                    </div>
                </div>`
                }
            }
        }
    }

    const command = new SendEmailCommand(params);
    const response = await client.send(command);

    return response;
}