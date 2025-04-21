// Gestion du quiz
const quiz = {
    currentQuestion: null,
    questionsAsked: [],
    currentCategory: 'all',

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
        
        // Choisir aléatoirement si on demande la traduction japonaise ou française
        if (Math.random() > 0.5) {
            let questionText = `Comment dit-on "${this.currentQuestion.french}" en japonais ?`;
            if (this.currentQuestion.politeness) {
                questionText += ` (${this.currentQuestion.politeness})`;
            }
            document.getElementById('quizQuestion').textContent = questionText;
            this.expectedAnswer = this.currentQuestion.japanese;
        } else {
            let questionText = `Que signifie "${this.currentQuestion.japanese}" en français ?`;
            if (this.currentQuestion.politeness) {
                questionText += ` (${this.currentQuestion.politeness})`;
            }
            document.getElementById('quizQuestion').textContent = questionText;
            this.expectedAnswer = this.currentQuestion.french;
        }
        
        document.getElementById('quizAnswer').value = '';
        document.getElementById('quizResult').textContent = '';
    },

    checkAnswer() {
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswers = Array.isArray(this.currentWord.french) ? 
            this.currentWord.french.map(a => a.toLowerCase()) : 
            [this.currentWord.french.toLowerCase()];
        
        if (correctAnswers.includes(userAnswer)) {
            this.feedbackElement.textContent = "Correct !";
            this.feedbackElement.className = "feedback correct";
        } else {
            this.feedbackElement.textContent = `Incorrect. La bonne réponse était : ${this.currentWord.french.join(" ou ")}`;
            this.feedbackElement.className = "feedback incorrect";
        }
        
        this.answerInput.value = "";
        this.nextButton.style.display = "block";
        this.checkButton.style.display = "none";
    }
};

// Événements
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation
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