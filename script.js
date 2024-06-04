document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionModal = document.getElementById('questionModal');
    const closeBtn = document.querySelector('.close');
    const questionForm = document.getElementById('questionForm');
    const questionTable = document.getElementById('questionTable');
    const questionList = document.getElementById('questionList');
    let questionCount = 0;
    let solvedCount = 0;

    // Load questions from localStorage on page load
    loadQuestions();

    addQuestionBtn.addEventListener('click', () => {
        questionModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        questionModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === questionModal) {
            questionModal.style.display = 'none';
        }
    });

    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const link = document.getElementById('link').value;
        const difficulty = document.getElementById('difficulty').value;
        if (title && link && difficulty) {
            addQuestion(title, link, difficulty);
            questionForm.reset();
            questionModal.style.display = 'none';
        }
    });

    function addQuestion(title, link, difficulty) {
        questionCount++;
        const newRow = questionList.insertRow();
        newRow.innerHTML = `
            <td><input type="checkbox" id="checkbox-${questionCount}"><label for="checkbox-${questionCount}"></label></td>
            <td class="title">${questionCount}. ${title}</td>
            <td>${difficulty}</td>
            <td><a href="${link}" class="redirect-link">redirect</a></td>
            <td><button class="edit"><i class="fas fa-edit"></i> Edit</button><button class="delete"><i class="fas fa-trash-alt"></i> Delete</button></td>
        `;

        // Save questions to localStorage
        saveQuestions();
    }

    function saveQuestions() {
        localStorage.setItem('questions', questionList.innerHTML);
    }

    function loadQuestions() {
        const questions = localStorage.getItem('questions');
        if (questions) {
            questionList.innerHTML = questions;
            // Update question count based on loaded questions
            questionCount = questionList.rows.length;
        }
    }

    // Update solved count and question count
    function updateStats() {
        const solvedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        solvedCount = solvedCheckboxes.length;
        document.getElementById('solvedCount').textContent = solvedCount;
        document.getElementById('totalCount').textContent = questionCount;
    }

    questionList.addEventListener('change', () => {
        updateStats();
        saveQuestions(); // Save state when checkboxes are changed
    });

    questionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            e.target.closest('tr').remove();
            questionCount--; // Decrement question count when a question is deleted
            updateStats(); // Update stats after deletion
            rearrangeNumbers(); // Rearrange numbers after deletion
            saveQuestions(); // Save state after deletion
        }
    });

    function rearrangeNumbers() {
        const rows = questionList.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const titleCell = rows[i].getElementsByClassName('title')[0];
            const titleText = titleCell.textContent.split('. ')[1];
            titleCell.textContent = `${i + 1}. ${titleText}`;
        }
    }
});
