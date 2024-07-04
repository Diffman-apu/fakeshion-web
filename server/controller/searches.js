import SearchKeys from "../model/SearchKeys.js";
import Posts from "../model/Posts.js";
import Users from "../model/Users.js";


export const getSearchKeys = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const searchKeys = await SearchKeys.find({uid: req.userId}).sort({createTime: -1})
        return res.status(200).json(searchKeys)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const updateSearchKeys = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const {type, content} = req.body
        const result = await SearchKeys.findOne({content})
        if(result){
            await SearchKeys.updateOne({content}, {$set: {createTime: new Date().toISOString()}})}
        else{
            await SearchKeys.create({uid: req.userId, type, content, createTime: new Date().toISOString()})
        }
        const searchKeys = await SearchKeys.find({uid: req.userId}).sort({createTime: -1})
        return res.status(200).json(searchKeys)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const deleteSearchKey = async (req, res) => {
    if (!req.userId) {
        return res.json({ message: "当前登陆状态错误，请检查！" });
    }
    try {
        const {id} = req.params
        if(id==='all'){
            await SearchKeys.deleteMany({uid: req.userId})
        }
        else{
            await SearchKeys.deleteOne({_id: id})
        }
        return res.status(200).json({ message: '最近搜索记录删除成功！' })
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getAvatarsBySearch = async (req, res) => {
    try {
        const { value: keyWord } = req.params
        const regex = eval('/' + keyWord + '/i')
        const searchResults = await Users.find(
            { username: regex },
            { _id: 1, username: 1, description: 1, followerCount: 1, avatar: 1 }
        ).sort({username: 1}).limit(10)

        return res.status(200).json(searchResults)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


export const getDetailsBySearch = async (req, res) => {
    try {
        const { value: keyWord } = req.params
        const regex = eval('/' + keyWord + '/i')

        const userResults = await Users.find(
            { username: regex },
            { _id: 1, username: 1, description: 1, followerCount: 1, avatar: 1 }
        )
        const postResults = await Posts.find(
            {caption: regex},
            {_id:1, imageURL: 1}
        )

        const finalResults = {account: userResults, post: postResults, label:[], activity:[],area:[]  }
        return res.status(200).json(finalResults)
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

