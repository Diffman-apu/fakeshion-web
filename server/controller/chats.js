
import Chats from "../model/Chat.js";

export const getChat = async (req, res) => {
    const { id } = req.params
    if (!req.userId) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }

    try {
        const result = await Chats.find({ users: { $all: [req.userId, id] } });
        const chat = result[0]
        if (chat) {
            if(req.userId === chat.unreadUserId){
                chat.unreadUserId = ''
                chat.unreadMsgCnt = 0
            }
            const updatedChat = await Chats.findByIdAndUpdate(chat._id, chat, { new: true });
            console.log("^^^^^^^^^^^^^^^^^^", updatedChat)
            return res.status(200).json(updatedChat)
        }
        else {
            const newChat = Chats.create({ users: [req.userId, otherUserId], messages: [], lastMessage: '', lastMessageTime: new Date().toISOString() })
            return res.status(200).json(newChat)
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getChats = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const chats = await Chats.find({ users: { $in: [req.userId]} }, {messages: 0}).sort({ lastMessageTime: -1 });
        console.log("****************************", chats)
        return res.status(200).json(chats)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


export const sendMsg = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.status(404).json({ message: "当前登陆状态错误，请检查！" });
    }

    try {
        const msg = req.body;
        let chat = await Chats.findById(id);
        const curTime = new Date()
        const newMsg = { 
            creatorId: req.userId, 
            content: msg.content, 
            type: msg.type, 
            tag: msg.tag, 
            messageTime: curTime 
        }

        if (curTime.getTime() - new Date(chat.lastMessageTime).getTime() > 5 * 60 * 1000) {
            chat.messages.push({ content: curTime.toISOString(), tag: 'info', type: 'time' })
        }
        chat.messages.push(newMsg)
        chat.lastMessage = msg.type === 'image' ? '[图片]' : msg.content
        chat.lastMessageTime = curTime.toISOString()
        chat.unreadUserId = msg.receiverId
        chat.unreadMsgCnt = chat.unreadMsgCnt + 1

        const updatedChat = await Chats.findByIdAndUpdate(id, chat, { new: true });
        return res.status(200).json(updatedChat);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}