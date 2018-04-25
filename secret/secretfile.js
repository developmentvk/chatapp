module.exports = {
    facebook: {
        clientID: '1688199671439928',
        clientSecret: '265871c7221863a426a6daad997920d3',
        profileFields:['email', 'displayName', 'photos'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback:true
    },
    google: {
        clientID: '250408229606-1ictbjq7pdr02eenq1p4jri9qjrt6el4.apps.googleusercontent.com',
        clientSecret: '5khvz9vLLNq64sW7s5u00RY0',
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
    },
    s3: {
        accessKeyId: '',
        secretAccessKey: '',
        region: '',
        bucket: '',
        acl: 'public-read',
    }
}