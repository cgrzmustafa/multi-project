const CHOICES = ["A", "B", "C", "D"];
let QUESTIONS = [];
let activeQuestionIndex = 0,
  questionsCount = 0,
  selectedAnswer,
  totalCorrectChoice = 0;
const quizModalEl = document.querySelector(".quiz__modal");

const getQuestions = () => {
  fetch("./questions.json")
    .then((res) => res.json())
    .then((questions) => {
      QUESTIONS = questions;
      questionsCount = QUESTIONS.length;
      updateQuizOrder();
    });
};

const updateQuizOrder = () => {
  let quizOrderEl = document.querySelector("#quizOrder");
  quizOrderEl.innerHTML = `${activeQuestionIndex + 1} / ${QUESTIONS.length}`;

  let quizProgressEl = document.querySelector(".quiz__progress");
  quizProgressEl.style.width = `${
    ((activeQuestionIndex + 1) / questionsCount) * 100
  }%`;

  if (activeQuestionIndex === questionsCount - 1) {
    document.querySelector(".quiz__btn").innerHTML = "COMPLETE";
  }
  updateQuestion();
};

const createQuestionAnswers = (activeQuestion) => {
  let questionAnswerHTML = "";
  activeQuestion.answers.forEach((answer, index) => {
    questionAnswerHTML += `<div class="question__answer" data-id="${answer.id}" onclick="selectChoice(this)">
              <div class="choice">${CHOICES[index]}</div>
              <div class="text">${answer.text}</div>
              </div>`;
  });

  return questionAnswerHTML;
};

const updateQuestion = () => {
  const activeQuestion = QUESTIONS[activeQuestionIndex];

  let questionHTML = `<h1>
            ${activeQuestionIndex + 1} - ${activeQuestion.text}
          </h1> <div class="question__answers">${createQuestionAnswers(
            activeQuestion
          )}</div>`;

  const questionContainerEl = document.querySelector("#questionContainer");
  questionContainerEl.innerHTML = questionHTML;
};

const selectChoice = (el) => {
  const questionAnswersEls = Array.from(
    document.querySelectorAll(".question__answer")
  );
  questionAnswersEls.forEach((answerEl) => {
    answerEl.classList.remove("selected");
  });
  selectedAnswer = el.dataset.id;
  el.classList.add("selected");
};

const checkAnswer = () => {
  const selectedAnswerObj = QUESTIONS[activeQuestionIndex].answers.find(
    (a) => a.id == selectedAnswer
  );
  if (selectedAnswerObj && selectedAnswerObj.isCorrect) totalCorrectChoice++;
};

const nextQuestion = () => {
  if (selectedAnswer) {
    if (activeQuestionIndex < questionsCount - 1) {
      activeQuestionIndex++;
      checkAnswer();
      updateQuizOrder();
    } else {
      checkAnswer();
      document.querySelector("#totalCorrectChoice").innerHTML =
        totalCorrectChoice;
      quizModalEl.classList.add("show");
    }
  } else {
    window.alert("Lütfen bir seçim yapınız.");
  }
};

const closeModal = () => {
  quizModalEl.classList.remove("show");
};

const repeatQuiz = () => {
  activeQuestionIndex = 0;
  questionsCount = 0;
  selectedAnswer = undefined;
  totalCorrectChoice = 0;
  updateQuizOrder();
  closeModal();
  document.querySelector(".quiz__btn").innerHTML = "NEXT";
};

getQuestions();
