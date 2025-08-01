import io from 'socket.io-client';

let socket: any = null;

export function connectSocket(token: string) {
  if (socket) return socket;
  socket = io('http://localhost:5000', {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
