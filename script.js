document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionModal = document.getElementById('questionModal');
    const closeBtn = document.querySelector('.close');
    const questionForm = document.getElementById('questionForm');
    const questionTable = document.getElementById('questionTable');
    const questionList = document.getElementById('questionList');
    let questionCount = 0;
    let solvedCount = 0;

    const updateQuestionStats = () => {
        const totalCount = questionList.rows.length;
        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('solvedCount').textContent = solvedCount;
    };

    const rearrangeNumbers = () => {
        const rows = questionList.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const titleCell = rows[i].getElementsByClassName('title')[0];
            const titleText = titleCell.textContent.split('. ')[1];
            titleCell.textContent = `${i + 1}. ${titleText}`;
        }
    };

    const updateSolvedCount = (checkbox) => {
        if (checkbox.checked) {
            solvedCount++;
        } else {
            solvedCount--;
        }
        updateQuestionStats();
    };

    addQuestionBtn.addEventListener('click', () => {
        questionModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        questionModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === questionModal) {
            questionModal.style.display = 'none';
        }
    });

    questionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = questionForm.title.value;
        const link = questionForm.link.value;
        const difficulty = questionForm.difficulty.value;

        const row = document.createElement('tr');

        const statusCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            const target = event.target;
            const titleCell = target.parentElement.nextElementSibling;

            if (target.checked) {
                titleCell.style.textDecoration = 'line-through';
                updateSolvedCount(target);
            } else {
                titleCell.style.textDecoration = 'none';
                updateSolvedCount(target);
            }
        });
        statusCell.appendChild(checkbox);

        const titleCell = document.createElement('td');
        titleCell.className = 'title';
        titleCell.textContent = `${++questionCount}. ${title}`;

        const difficultyCell = document.createElement('td');
        difficultyCell.textContent = difficulty;

        const linkCell = document.createElement('td');
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = 'Redirect';
        linkElement.target = '_blank';
        linkElement.className = 'redirect-link';
        linkCell.appendChild(linkElement);

        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(statusCell);
        row.appendChild(titleCell);
        row.appendChild(difficultyCell);
        row.appendChild(linkCell);
        row.appendChild(actionCell);

        questionList.appendChild(row);
        questionModal.style.display = 'none';
        questionForm.reset();
        updateQuestionStats();
    });

    questionTable.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('edit')) {
            const questionRow = target.parentElement.parentElement;
            const title = questionRow.querySelector('.title').textContent.split('. ')[1];
            const link = questionRow.querySelector('.redirect-link').href;
            const difficulty = questionRow.cells[2].textContent;

            questionForm.title.value = title;
            questionForm.link.value = link;
            questionForm.difficulty.value = difficulty;

            questionList.removeChild(questionRow);
            rearrangeNumbers();
            questionModal.style.display = 'block';
            questionCount--;
            updateQuestionStats();
        } else if (target.classList.contains('delete')) {
            const questionRow = target.parentElement.parentElement;
            const statusCheckbox = questionRow.querySelector('input[type="checkbox"]');

            if (statusCheckbox.checked) {
                solvedCount--;
            }

            questionList.removeChild(questionRow);
            rearrangeNumbers();
            questionCount--;
            updateQuestionStats();
        }
    });

    updateQuestionStats(); // Initial update of question stats
});
