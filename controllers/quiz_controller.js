var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function (quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quiz=' + quizId));
			}
		}
	).catch(function(error) { next(error);});
}


//GET /quizes
exports.index = function(req, res) {
	var objSearch = {};
	if (req.query.search) {
		var search = "%" + req.query.search + "%";
		objSearch = {where:["pregunta like ?", search.replace(/\s+/g, '%')]};
	}
	models.Quiz.findAll(objSearch).then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error) { next(error);});
};


// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz : req.quiz});
};


// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado  = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta : resultado});

};

//GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(//Crea objeto quiz
		{pregunta : "Pregunta", respuesta : "Respuesta"});
	res.render("quizes/new", {quiz: quiz});
};

//POST /quizes/create
exports.create = function(req, res) {
	console.log(req.body);
	var quiz = models.Quiz.build(req.body.quiz);
	console.log(quiz);
	//guarda en la DB los campos preguntas y respuesta de quiz
	quiz.save({fields : ["pregunta", "respuesta"]}).then(function(){
		res.redirect("/quizes");
	});
};