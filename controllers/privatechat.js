module.exports = function (async, Users, Message, User) {
    return {
        SetRouting: function (router) {
            router.get('/chat/:name', this.getchatPage);
            router.post('/chat/:name', this.chatPostPage);
        },

        getchatPage: function (req, res) {
            async.parallel([
                function (callback) {
                    Users.findOne({ 'username': req.user.username })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },

                function (callback) {
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
                    Message.aggregate([
                        { $match: { $or: [{ "senderName": nameRegex }, { "receiverName": nameRegex }] } },
                        { $sort: { "createdAt": -1 } },
                        {
                            $group: {
                                "_id": {
                                    "last_message_between": {
                                        $cond: [
                                            {
                                                $gt: [
                                                    { $substr: ["$senderName", 0, 1] },
                                                    { $substr: ["$receiverName", 0, 1] }]
                                            },
                                            { $concat: ["$senderName", " and ", "$receiverName"] },
                                            { $concat: ["$receiverName", " and ", "$senderName"] }
                                        ]
                                    }
                                }, "body": { $first: "$$ROOT" }
                            }
                        }], function (err, newResult) {
                            const arr = [
                                { path: 'body.sender', model: 'User' },
                                { path: 'body.receiver', model: 'User' }
                            ];

                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            });
                        }
                    )
                },

                function (callback) {
                    Message.find({ '$or': [{ 'senderName': req.user.username }, { 'receiverName': req.user.username }] })
                        .populate('sender')
                        .populate('receiver')
                        .exec((err, result3) => {
                            callback(err, result3)
                        })
                }
            ], (err, results) => {
                const result1 = results[0];
                const result2 = results[1];
                const result3 = results[2];

                const params = req.params.name.split('.');
                const nameParams = params[0];

                res.render('private/privatechat', { title: 'Chat App - Private Chat', user: req.user, data: result1, chat: result2, chats: result3, name: nameParams });
            });
        },

        chatPostPage: function (req, res, next) {
            const params = req.params.name.split('.');
            const nameParams = params[0];
            const nameRegex = new RegExp("^" + nameParams.toLowerCase(), "i");

            async.waterfall([
                function (callback) {
                    if (req.body.message) {
                        Users.findOne({ 'username': { $regex: nameRegex } }, (err, data) => {
                            callback(err, data);
                        });
                    }
                },

                function (data, callback) {
                    if (req.body.message) {
                        const newMessage = new Message();
                        newMessage.sender = req.user._id;
                        newMessage.receiver = data._id;
                        newMessage.senderName = req.user.username;
                        newMessage.receiverName = data.username;
                        newMessage.message = req.body.message;
                        newMessage.userImage = req.user.UserImage;
                        newMessage.createdAt = new Date();

                        newMessage.save((err, result) => {
                            if (err) {
                                return next(err);
                            }
                            callback(err, result);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/chat/' + req.params.name);
            });

            User.PostRequest(req, res, '/chat/' + req.params.name);

        }
    }
}






























