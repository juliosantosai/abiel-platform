declare const MessageSender: any;
declare class FakeMessageSender extends MessageSender {
    constructor({ shouldFail }?: {
        shouldFail?: boolean;
    });
    send(opts: any): Promise<{
        success: boolean;
        messageId: string;
    }>;
}
//# sourceMappingURL=FakeMessageSender.d.ts.map