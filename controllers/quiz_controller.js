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
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	}).catch(function(error) { next(error);});
};


// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz : req.quiz, errors: []});
};


// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado  = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta : resultado, errors: []});

};

//GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(//Crea objeto quiz
		{pregunta : "Pregunta", respuesta : "Respuesta", tema: "otro"});
	res.render("quizes/new", {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(function(err) {
		if (err) {
			res.render("quizes/new", {quiz: quiz, errors : err.errors});
		} else {
			quiz.save({fields : ["pregunta", "respuesta", "tema"]}).then(function(){
				res.redirect("/quizes");
			});
		}
	});
};


//GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors : []});
};

//POST /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err) {
			res.render("quizes/edit", {quiz: req.quiz, errors:err.errors});
		} else {
			req.quiz.save( { fields : ["pregunta", "respuesta", "tema"]}).then(function() {res.redirect("/quizes");});
		}
	});
};

//DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};