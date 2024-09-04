//Custome error handling class
class expError extends Error{
    constructor(status,message){
        super(),
        this.status=status
        this.message=message
    }
}
module.exports=expError;