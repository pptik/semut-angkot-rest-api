const axios = require('axios');
const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;
const CLIENT_ID = "537771519476-h61pumjn47kuvilukeq92ps47nsrdl6i.apps.googleusercontent.com";

facebookProfic = (id) =>{
  return "https://graph.facebook.com/"+id+"/picture?type=large"
};

// test 103102743708049240037
// EAAKhgRIQPZAEBAD9mjucJ1yR9JcT3ZCaNY3PZCfSlUbPiPczZAKFryZAtCzfyXSIty0A3swWnRQg7PA6tHqAmXisiohxpF4lXdvdZAtuZBCsFlWuQGEOaaZBJEw2Mg6KQn6uEvXVQr03FMeTsCZClCBcltZCcA2iYmIS87ZCfufKpNiEsWEfagHvtqlit55x268RzZAuRtdhZBzCseQZDZD

validateGoogleToken = (token) =>{
    return new Promise((resolve, reject) =>{
        let client = new auth.OAuth2(CLIENT_ID, 'NZIUCSGxViYcYM2yg-ssyHjE', '');
        client.verifyIdToken(token, CLIENT_ID,(e, login) => {
            if(e) {
                console.log(e);
                resolve({failed: true, reason: e});
            }
            else {
                resolve(login);
            }
        });
    });
};



module.exports = {
    facebookProfic:facebookProfic,
    validateGoogleToken:validateGoogleToken
};