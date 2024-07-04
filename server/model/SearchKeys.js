import mongoose from "mongoose";

const searchKeysSchema = new mongoose.Schema({
    uid: String,
    content: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text' // 'avatar'
    },
    createTime: {
        type: Date,
        default: new Date().toISOString(),
        
    }
    
});


const SearchKeys = mongoose.model('searchKeys', searchKeysSchema);
export default SearchKeys;