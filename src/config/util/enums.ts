// Evennt listeners for websocket
/** pre-defined socket event listeners */
export enum SocketEvents {
  //** check for connection to websocket */
  CONNECT = 'connect',

  //** get 'message' from sender */
  MESSAGE = 'message',

  //** 'reply' message to receiver */
  REPLY = 'reply',

  //** join a room */
  JOINROOM = 'joinRoom',
}
