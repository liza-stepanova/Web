document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tableForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const days = parseInt(event.currentTarget.elements['days'].value, 10)
        const maxLessons = parseInt(event.currentTarget.elements['maxLessons'].value, 10);
        const language = event.currentTarget.elements['language'].value;

        generateTable(days, maxLessons, language);
        saveToLocalStorage({ days, maxLessons, language });
    });

    const savedParams = loadFromLocalStorage();
    if (savedParams) {
        document.getElementById('days').value = savedParams.days;
        document.getElementById('maxLessons').value = savedParams.maxLessons;
        document.getElementById('language').value;

        const savedTable = loadTableFromLocalStorage();
        if (savedTable) {
            generateTable(savedParams.days, savedParams.maxLessons, savedParams.language, savedTable);
        }
    }
});

function generateTable(days, maxLessons, language, savedData = {}) {
    const table = document.createElement('table');

    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = language === 'russian' ? 'День/Урок' : 'Day/Lesson';
    headerRow.appendChild(headerCell);

    for (let lesson = 1; lesson <= maxLessons; lesson++) {
        const lessonHeaderCell = document.createElement('th');
        lessonHeaderCell.textContent = `${language === 'russian' ? 'Урок' : 'Lesson'} ${lesson}`;
        headerRow.appendChild(lessonHeaderCell);
    }

    table.appendChild(headerRow);

    for (let day = 1; day <= days; day++) {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = language === 'russian' ? `День ${day}` : `Day ${day}`;
        row.appendChild(dayCell);

        for (let lesson = 1; lesson <= maxLessons; lesson++) {
            const cell = document.createElement('td');
            const content = document.createElement('div');

            const savedText = savedData[`${day}-${lesson}`];
            content.textContent = savedText || (language === 'russian' ? `Содержание для Дня ${day}, Занятия ${lesson}` :
                `Content for Day ${day}, Lesson ${lesson}`);

            content.setAttribute('contenteditable', 'true');

            content.addEventListener('blur', function () {
                saveTableToLocalStorage(days, maxLessons, table);
            });

            cell.appendChild(content);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function saveToLocalStorage(params) {
    localStorage.setItem('tableParams', JSON.stringify(params));
}

function loadFromLocalStorage() {
    const savedParams = localStorage.getItem('tableParams');
    return savedParams ? JSON.parse(savedParams) : null;
}

function saveTableToLocalStorage(days, maxLessons, table) {
    const data = {};

    const rows = table.querySelectorAll('tr');
    for (let day = 1; day <= days; day++) {
        const cells = rows[day].querySelectorAll('td');
        for (let lesson = 1; lesson <= maxLessons; lesson++) {
            const key = `${day}-${lesson}`;
            const value = cells[lesson].textContent.trim();
            data[key] = value;
        }
    }

    localStorage.setItem('tableData', JSON.stringify(data));
}

function loadTableFromLocalStorage() {
    const savedTable = localStorage.getItem('tableData');
    return savedTable ? JSON.parse(savedTable) : null;
}
