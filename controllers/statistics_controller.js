var models = require('../models/models.js');

// GET /quizes/stati
exports.show = function(req, res) {
	var quizTotal, commentsTotal, commentsAvg, quizWithComments = 0; 
	models.Quiz.count().then(function(count) { 
		quizTotal =  count; console.log(count);
		models.Comment.count().then(function(count) { 
			commentsTotal =  count; console.log(count);
//			models.Comment.count({distinct : "QuizId"}).then(function(count) { 
			models.sequelize.query('SELECT count(DISTINCT(QuizId)) AS `count` FROM `Comments` AS `Comment`').then(function(count) { 
				console.log(count[0]);
				quizWithComments =  count[0][0].count; ;
				stat = {
					'quizTotal' : quizTotal, 
					'commentsTotal' : commentsTotal, 
					'commentsAvg' : quizTotal ? commentsTotal / quizTotal : 0, 
					'quizWithComments' : quizWithComments, 
					'quizWithoutComments' : quizTotal - quizWithComments
				};
				console.log(stat);
				res.render('statistics/index', {"stat" : stat, errors: []});

			});		
		});
	});
};
