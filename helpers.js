//You can add and export any helper functions/validation functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";

const exportedMethods = {
    checkId(id){
        if (id === undefined) throw 'No ID provided!';

        if (typeof id !== 'string') throw 'Bad Request!';

        
        if (!id) throw 'No ID provided!';
        id = id.trim();
        if (id.length === 0) throw 'Empty ID!';

        if (!ObjectId.isValid(id)) throw 'Invalid ObjectId!';
        return id;
    }
};

export default exportedMethods