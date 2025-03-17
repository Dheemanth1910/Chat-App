
var authenticator = (req,res,next) => {
    console.log('Came inside the authenticator middle-ware');
    next();
}

module.exports = authenticator;