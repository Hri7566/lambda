declare interface MPPParticipant {
    _id: string;
    name: string;
    color: string;
    id: string;
}

declare interface MPPMessage {
    m: string;
}

declare interface MPPChatMessageIncoming extends MPPMessage {
    m: 'a';
    t: number;
    a: string;
    p: MPPParticipant;
}

declare interface MPPChatMessageOutgoing extends MPPMessage {
    m: 'a';
    message: string;
}

declare type MPPChatMessage = MPPChatMessageIncoming | MPPChatMessageOutgoing;

declare interface MPPHiMessageIncoming extends MPPMessage {
    m: 'hi';
    u: MPPParticipant;
    motd: string;
}

declare interface MPPChannelConfig {
    uri: string;
    _id: string;
    set: Record<string, string | number | boolean>;
    disable?: string[];
    user?: MPPParticipant;
}

declare interface MPPCursorMessageIncoming {
    m: 'm';
    id: string;
    x: number | string;
    y: number | string;
}
