(function() {
    let tasks = [];
    const tasksList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    /*JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on 
    (e.g., sending some data from the server to the client, so it can be displayed on a web page, or vice versa).*/

    async function fetchTodos() {
        //for GET request

        /* fetch('https://jsonplaceholder.typicode.com/todos') //we are making a request and promise is being returned
             .then(function(response) { //this is an object we need to convert it to json
                 return response.json(); //.json gives us a promise so we use then further
             }).then(function(data) {
                 tasks = data.slice(0, 10);
                 renderList();
             })
             .catch(function(error) {
                 console.log('Error', error);
             })*/


        //another way of doing 
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            tasks = data.slice(0, 10);
            renderList();
        } catch (error) {
            console.log('error', error);
        }

    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed?'checked':''} class="custom-checkbox" >
        <label for="${task.id}">${task.title}</label>
        <img src="img.png" alt="img" class="delete" data-id="${task.id}" />
        `;
        tasksList.append(li);
    }

    function renderList() {
        tasksList.innerHTML = '';
        for (let i = 0; i < tasks.length; i++) {
            addTaskToDOM(tasks[i]);
        }
        tasksCounter.innerHTML = tasks.length;
    }

    function toggleTask(taskId) {
        let result = tasks.filter(function(task) {
            return task.id === Number(taskId);
        });
        if (result.length > 0) {
            result[0].completed = !result[0].completed;
            showNotification('Task Toggled Successfully');
            renderList();
            return;
        }
        showNotification('Could Not Toggle as Id not found');
    }

    function deleteTask(taskId) {
        const result = tasks.filter(function(task) {
            return (task.id !== Number(taskId));

        });
        tasks = result;
        renderList();
        showNotification('Task Deleted Successfully');
    }

    function addTask(task) {
        if (task) {
            tasks.push(task);
            renderList();
            showNotification('Task Added Successfully');
        } else
            showNotification('Task Cannot Be Added');

    }

    function showNotification(text) {
        alert(text);
    }

    function handleInputKeypress(event) {
        if (event.key === 'Enter') {
            const text = event.target.value;

            // console.log(text, ' text');
            if (!text) {
                showNotification('Please Enter A Task');
                return;
            }
            const task = {
                    title: text,
                    id: Date.now(),
                    completed: false
                }
                // console.log(Date.now());
            event.target.value = '';
            addTask(task);
        }
    }

    function handleClickListener(e) {
        const target = e.target;
        if (target.className === 'delete') {
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;
        } else if (target.className === 'custom-checkbox') {
            const taskId = target.id;
            toggleTask(taskId);
            return;
        }
    }

    function initializeApp() {
        fetchTodos();
        addTaskInput.addEventListener('keyup', handleInputKeypress);
        document.addEventListener('click', handleClickListener);
    }
    initializeApp();
})();