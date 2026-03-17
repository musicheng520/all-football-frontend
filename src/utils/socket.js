import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = null;

export const connectSocket = (matchId, onMessage) => {

    const socket = new SockJS("http://localhost:8080/ws");

    client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("Connected");

            client.subscribe(`/topic/match/${matchId}`, (msg) => {
                const data = JSON.parse(msg.body);
                onMessage(data);
            });
        },

        onStompError: (frame) => {
            console.error("STOMP error", frame);
        }
    });

    client.activate();
};

export const disconnectSocket = () => {
    if (client) client.deactivate();
};