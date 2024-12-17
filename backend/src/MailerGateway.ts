export default interface MailerGateway {
    send (receipient: string, subject: string, message: string): Promise<void>;
}

export class MailerGatewayMemory {
    async send(receipient: string, subject: string, message: string) {
        console.log("send", receipient, subject, message);
    }
}