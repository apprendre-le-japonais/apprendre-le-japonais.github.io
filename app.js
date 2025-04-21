// Gestion du quiz
const quiz = {
    currentQuestion: null,
    questionsAsked: [],
    currentCategory: 'all',
    answerInput: null,
    feedbackElement: null,
    nextButton: null,
    checkButton: null,

    init() {
        this.answerInput = document.getElementById('quizAnswer');
        this.feedbackElement = document.getElementById('quizResult');
        this.nextButton = document.getElementById('nextQuestion');
        this.checkButton = document.getElementById('checkAnswer');
    },

    getVocabularyForCategory() {
        if (this.currentCategory === 'all') {
            return window.all;
        }
        return window[this.currentCategory];
    },

    generateQuestion() {
        const vocabulary = this.getVocabularyForCategory();
        
        // Si toutes les questions ont été posées, réinitialiser la liste
        if (this.questionsAsked.length === vocabulary.length) {
            this.questionsAsked = [];
        }

        // Trouver une question qui n'a pas encore été posée
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * vocabulary.length);
        } while (this.questionsAsked.includes(randomIndex));

        this.questionsAsked.push(randomIndex);
        this.currentQuestion = vocabulary[randomIndex];
        
        // Choisir la direction de la question en fonction du paramètre direction
        const forceFrenchToJapanese = this.currentQuestion.direction === "frenchToJapanese";
        const isJapaneseQuestion = forceFrenchToJapanese ? false : Math.random() > 0.5;
        
        if (isJapaneseQuestion) {
            let questionText = `Que signifie "${this.currentQuestion.japanese}" en français ?`;
            if (this.currentQuestion.politeness) {
                questionText += ` (${this.currentQuestion.politeness})`;
            }
            document.getElementById('quizQuestion').textContent = questionText;
            this.expectedAnswer = this.currentQuestion.french;
        } else {
            let frenchQuestionText;

            if (Array.isArray(this.currentQuestion.french)) {
                frenchQuestionText = this.currentQuestion.french.join(" ou ");
            } else {
                frenchQuestionText = this.currentQuestion.french;
            }

            let questionText = `Comment dit-on "${frenchQuestionText}" en japonais ?`;
            
            if (this.currentQuestion.politeness) {
                questionText += ` (${this.currentQuestion.politeness})`;
            }

            document.getElementById('quizQuestion').textContent = questionText;
            this.expectedAnswer = this.currentQuestion.japanese;
        }
        
        document.getElementById('quizAnswer').value = '';
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
    },

    checkAnswer() {
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        
        // Déterminer si on attend une réponse en japonais ou en français
        const isJapaneseQuestion = this.expectedAnswer === this.currentQuestion.japanese;
        let correctAnswers;
        let correctAnswerText;
        
        if (isJapaneseQuestion) {
            correctAnswers = [this.currentQuestion.japanese.toLowerCase()];
            correctAnswerText = this.currentQuestion.japanese;
        } else {
            if (Array.isArray(this.currentQuestion.french)) {
                correctAnswers = this.currentQuestion.french.map(a => a.toLowerCase());
                correctAnswerText = this.currentQuestion.french.join(" ou ");
            } else {
                correctAnswers = [this.currentQuestion.french.toLowerCase()];
                correctAnswerText = this.currentQuestion.french;
            }
        }
        
        if (correctAnswers.includes(userAnswer)) {
            this.feedbackElement.textContent = "Correct !";
            this.feedbackElement.className = "feedback correct";
        } else {
            this.feedbackElement.textContent = `Incorrect. La bonne réponse était : ${correctAnswerText}`;
            this.feedbackElement.className = "feedback incorrect";
        }
        
        this.answerInput.value = "";
        this.checkButton.disabled = true;
        
        // Générer une nouvelle question après 2 secondes
        setTimeout(() => {
            this.generateQuestion();
            this.checkButton.disabled = false;
        }, 2000);
    }
};

// Événements
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation
    quiz.init();
    quiz.generateQuestion();

    // Gestion du quiz
    document.getElementById('checkAnswer').addEventListener('click', () => {
        quiz.checkAnswer();
    });

    // Gestion du changement de catégorie
    document.getElementById('vocabularyCategory').addEventListener('change', (e) => {
        quiz.currentCategory = e.target.value;
        quiz.questionsAsked = []; // Réinitialiser les questions posées
        quiz.generateQuestion();
    });

    // Permettre la soumission avec la touche Entrée
    document.getElementById('quizAnswer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            quiz.checkAnswer();
        }
    });
}); 