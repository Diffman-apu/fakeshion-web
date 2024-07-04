
export const parse = (data) => JSON.parse(data);
export const stringify = (data) => JSON.stringify(data);

export const Type = {
  1: 'LOGIN',
  2: 'LOGOUT',
  3: 'ADD_USER',
  4: 'USER_INFO',

  10: 'UPDATE_PEOPLE_NUM',
  11: 'UPDATE_USER_LIST',
  12: 'UPDATE_MESSAGE_LIST',
  13: 'SEND_MESSAGE',
  14: 'BROADCAST_MESSAGE',
  15: 'UPDATE_CHAT_LIST',
  16: 'CLEAR_CHAT_UNREAD',
  17: 'SEND_NOTIFICATION',
  18: 'BROADCAST_NOTIFICATION',




  20: 'PING',
  21: 'PONG',
  23: 'TASK',
  24: 'REPLY',
};

export class TypeMap extends Map {
  constructor () {
    super();
    this.map = this.deal();
  }

  deal() {
    const map = new Map();
    const BiMap = (key, value) => {
      map.set(key, value);
      map.set(value, key);
    }
    for (let key in Type) {
      BiMap(key, Type[key]);
    }
    return map;
  }
}


