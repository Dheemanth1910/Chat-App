
var permissionHandler = (req,res,next)=> {
    console.log('Inside the permission handler middle-ware');
    next();
}   

module.exports = permissionHandler ;``