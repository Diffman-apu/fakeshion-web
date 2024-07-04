import Notifications from "../model/Notifications.js";


export const getNotifications = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const notifications = await Notifications.find({ uid: req.userId }).sort({ createTime: -1 });
        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


export const sendNotification = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const notifyObj = req.body
        const notification = await Notifications.create(notifyObj);
        
        return res.status(200).json(notification)
        
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const updateNotification = async (req, res) => {
    console.log("=====================")
    const {id: noteId} = req.params
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        // const notifyObj = req.body
        const notification = await Notifications.findById(noteId)
        notification.isRead = true

        const newNotification = await Notifications.findByIdAndUpdate(noteId, notification, {new: true});
        return res.status(200).json(newNotification)
        
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
