import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = null;
let subscription = null;

export const connectSocket = (matchId, onMessage) => {

    // 防止重复连接
    if (client && client.active) {
        return;
    }

    const socket = new SockJS("/api/ws");

    client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket Connected");

            // 防止重复订阅
            if (subscription) {
                subscription.unsubscribe();
            }

            subscription = client.subscribe(
                `/topic/match/${matchId}`,
                (msg) => {
                    const data = JSON.parse(msg.body);
                    onMessage(data);
                }
            );
        },

        onStompError: (frame) => {
            console.error("STOMP error", frame);
        },

        onWebSocketClose: () => {
            console.log("WebSocket closed");
        }
    });

    client.activate();
};

export const disconnectSocket = () => {

    if (subscription) {
        subscription.unsubscribe();
        subscription = null;
    }

    if (client) {
        client.deactivate();
        client = null;
    }
};