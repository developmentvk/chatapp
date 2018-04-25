module.exports = function(){
    return {
        SetRouting: function(router){
            router.get('/latest-chat-news', this.chatAppNews);
        },
        
        chatAppNews: function(req, res){
            res.render('news/chatnews', {title: 'Chat App - Latest News', user: req.user});
        }
    }
}