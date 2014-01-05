var Post = require('../../models/post'),
	_ = require('underscore');

module.exports = function(app){
	//add post
	app.post('/api/posts', function(req, res){
		var title = req.body['title'],
			body = req.body['body'],
			post = new Post(title, body),
			message,
			url;
		post.save(function(err, p) {
			if(err){
				message = err.message;
				url = '/admin';
			} else {
				message = 'Success';
				url = '/posts/' + p.id;
			}
		});
		res.cookie(
			'message',
			message,
			{ httpOnly: false }
		);
		res.redirect(url);
	});

	//delete post by id
	app.delete('/api/posts', function(req, res) {
		var id = parseInt(req.body['id']),
			url = '/admin',
			message;
		Post.findById(id, function(err, post) {
			if(err) {
				message = err.message;
			} else if (!post) {
				message = 'No such post';
			} else {
				post.remove();
				message = 'Post deleted';
			}
		});
		res.cookie(
			'message',
			message,
			{ httpOnly: false }
		);
		res.redirect(url);
	});

	//add comment
	app.post('/api/posts/:id/comments', function(req, res){
		var id = parseInt(req.params['id']),
			name = req.body['name'],
			body = req.body['body'],
			message,
			url;
		Post.findById(id, function(err, post){
			if(err) {
				message = message.err;
				url = '/posts/' + id;
			} else if(!post) {
				message = 'No such post';
				url = '/posts';
			} else {
				post.addComment({
					name: name,
					body: body
				});
				message = 'Comment success';
				url = '/posts/' + id;
			}
		});
		res.cookie(
			'message',
			message,
			{ httpOnly: false }
		);
		res.redirect(url);
	});

	//delete comment
	app.delete('/api/posts/:pid/comments/:cix', function(req, res){
		var pid = parseInt(req.params['pid']),//post id
			cindex = parseInt(req.params['cix']),//comment id
			url = '/admin',
			message;
		Post.findById(pid, function(err, post){
			if(err) {
				message = err.message;
			} else if(!post) {
				message = 'No such post';
			} else {
				post.deleteComment(cindex, function(err){
					if(err) {
						message = err.message;
					} else {
						message = 'Comment deleted';
					}
				});
			}
		});
		res.cookie(
			'message',
			message,
			{ httpOnly: false }
		);
		res.redirect(url);
	});

};