module.exports = function(async, Club, Users, _){
    return {
        SetRouting: function(router){
            router.get('/results', this.getResults);
            router.post('/results', this.postResults);
            
            router.get('/members', this.viewMembers);
            router.post('/members', this.searchMembers);
        },
        
        getResults: function(req, res){
            res.redirect('/home');
        },
        
        postResults: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.country), 'gi');
                    
                    Club.find({'$or': [{'country':regex}, {'name': regex}]}, (err, result) => {
                       callback(err, result); 
                    });
                },
                function (callback) {
                    Club.aggregate([{
                        $group: {
                            _id: "$country",
                        }
                    }], (err, newResult) => {
                        if (err) newResult = [];

                        callback(err, newResult);
                    });
                },
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                const countrySort = _.sortBy(res2, '_id');
                
                res.render('results', { title: 'Chat App - Results', user: req.user, chunks: dataChunk, country: countrySort});
            })
        },
        
        viewMembers: function(req, res){
            async.parallel([
                function(callback){
                    Users.find({}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('members', {title: 'Chat App - Members', user: req.user, chunks: dataChunk});
            })
        },
        
        searchMembers: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.username), 'gi');
                    
                    Users.find({'username': regex}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('members', {title: 'Chat App - Members', user: req.user, chunks: dataChunk});
            })
        }
    }
}











