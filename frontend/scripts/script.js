let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){

    let status_promise = new Promise(() => {
        displayStatuses();
    });

    let task_promise = new Promise(() => {
        displayTasks();
    });

    Promise.resolve(status_promise)
        .then(() => {
            Promise.resolve(task_promise).then(()=> {});
        });

    fetchModalSelectInfos();
});

document.addEventListener('dragstart', function(event){
    if(!event.target.closest('.task-element'))
        return;
    event.target.classList.add('dragged');
    event.dataTransfer.setData('text/plain', event.target.id);
});

document.addEventListener('dragend', function(event){
    if(!event.target.closest('.task-element'))
        return;
    event.target.classList.remove('dragged');
});

document.addEventListener('dragover', function(event){
    if(!event.target.closest('.status-column'))
        return;
    event.preventDefault();
});

document.addEventListener('drop', function(event){
    if(!event.target.closest('.status-column'))
        return;
    event.preventDefault();

    let dragged_task = document.getElementById(event.dataTransfer.getData('text'));

    if(dragged_task !== null){

        if(dragged_task.closest('.project-container').children.length === 2){//The span + the not yet removed div
            dragged_task.closest('.project-container').remove();
        }

        dragged_task.closest('li').remove();
    }

    let destination_status = event.target.closest('.status-column');

    let task_status_update = new Promise((resolve) => {
        ajax('/task/' + getBackendId(dragged_task) + '/set/status/' + getBackendId(destination_status), 'GET', resolve)
    });
    Promise.resolve(task_status_update).then((result) => {
        displayTasks();
    });

    event.dataTransfer.clearData();
});

//Modal
document.getElementById('button-add').addEventListener('click', function() {
    document.getElementById('modal-wrapper').classList.toggle('hide');
});

let modal_menu_button = document.getElementsByClassName('modal-menu-item');
for(let i = 0; i < modal_menu_button.length; i++){
    modal_menu_button[i].addEventListener('click', function(){
        let modal_tabs = document.getElementById('modal-wrapper').querySelectorAll('.modal-tab');
        let form_id_toggled = event.target.dataset.toggleId;

        //there is only one active, so no need to use querySelectorAll
        document.getElementById('modal-menu').querySelector('.active').classList.remove('active');

        event.target.classList.add('active');

        for(let i = 0; i < modal_tabs.length; i++){
            modal_tabs[i].classList.add('hide');
        }

        document.getElementById(form_id_toggled).classList.remove('hide');
    });
}

document.getElementById('modal-button-confirm').addEventListener('click', function(){
    let tabName = document.getElementById('modal-menu').querySelector('.active').dataset.name;
    switch(tabName){
        case 'task':
            let new_task_name = document.getElementById('modal-task-name').value;
            let new_task_project_id = document.getElementById('modal-task-project').value;
            let new_task_status_id = document.getElementById('modal-task-status').value;

            if(new_task_project_id === '0' || new_task_status_id === '0' || new_task_name === '') {
                return;
            }

            let new_task_promise = new Promise((resolve) => {
                ajax('/task/create/', 'POST', resolve, {
                    'name': new_task_name,
                    'project_id': new_task_project_id,
                    'status_id': new_task_status_id
                });
            });

            Promise.resolve(new_task_promise).then((message) => {
                fetchModalSelectInfos();
                displayTasks();
            });


            break;
        case 'project':
            let new_project_name = document.getElementById('modal-project-name').value;

            if(new_project_name === ''){
                return;
            }

            let new_project_promise = new Promise((resolve) => {
                ajax('/project/create/', 'POST', resolve, {'name': new_project_name});
            });

            Promise.resolve(new_project_promise).then((message) => {
                fetchModalSelectInfos();
            });
            break;
        case 'status':
            let new_status_name = document.getElementById('modal-status-name').value;

            if(new_status_name === ''){
                return;
            }

            let new_status_promise = new Promise((resolve) => {
                ajax('/status/create/', 'POST', resolve, {'name': new_status_name});
            });

            Promise.resolve(new_status_promise).then((message) => {
                fetchModalSelectInfos();
                displayStatuses();
            });
            break;
    }
});

function fetchModalSelectInfos(){
    let project_list_promise = new Promise((resolve) => {
        ajax('/project/read/', 'GET', resolve);
    });

    let status_list_promise = new Promise((resolve) => {
        ajax('/status/read/', 'GET', resolve);
    });

    Promise.all([project_list_promise, status_list_promise]).then((response) => {
        let projects_list = JSON.parse(response[0]);
        let status_list = JSON.parse(response[1]);

        let project_dropdown = document.getElementById('modal-task-project');
        let status_dropdown = document.getElementById('modal-task-status');

        project_dropdown.innerHTML = '';
        status_dropdown.innerHTML = '';

        for (let project of projects_list) {
            let project_option = createElement('option', project.name, [
                {'value': project.id}
            ]);
            project_dropdown.appendChild(project_option);
        }

        for (let status of status_list) {
            let project_option = createElement('option', status.name, [
                {'value': status.id}
            ]);
            status_dropdown.appendChild(project_option);
        }
    });
}

function ajax(url, method, callback, data = null)
{
    let formattedData = '?';
    if(data !== null) {
        let dataArray = [];
        for(let key in data) {
            dataArray.push(`${key}=${data[key]}`);
        }
        formattedData += dataArray.join('&');
    }

    console.log(apiUrl + url + formattedData);

    let xhr = new XMLHttpRequest();
    xhr.open(method, apiUrl + url + formattedData);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

function getBackendId(element)
{
    if(element === null)
        return;
    return element.id.substr(element.id.lastIndexOf('-') + 1);
}

function displayStatuses()
{
    let promise_statuses = new Promise((resolve) => {
        ajax('/status/read/', 'GET', resolve);
    });
    return Promise.resolve(promise_statuses)
        .then((unparsed_statuses) => {

            let statuses = JSON.parse(unparsed_statuses);

            statuses.forEach(function (status) {
                if(document.getElementById('status-' + status.id) === null){
                    let status_column = createElement('div', null, [
                        {'id': 'status-' + status.id},
                        {'class': 'status-column'}
                    ]);
                    status_column.appendChild(createElement('h2', status.name, [{'class': 'neon-white-red'}]));

                    document.getElementById('main-content-container').appendChild(status_column);
                }
            });
            displayTasks();
        });
}

//TODO - Add a status argument to not fetch all tasks from all status on refresh after drop
function displayTasks()
{
    let promise_tasks = new Promise((resolve) => {
        ajax('/task/read/', 'GET', resolve);
    });

    return Promise.resolve(promise_tasks).then((unparsed_tasks) => {
        let tasks = JSON.parse(unparsed_tasks);

        for(let i = 0; i < tasks.length; i++)
        {
            let task = tasks[i];
            let task_status = document.getElementById('status-' + task.status.id);
            if(task_status === null)
                continue;
            let task_project = task_status.querySelector('#status-' + task.status.id + '-project-' + task.project.id);

            if(task_project === null){
                task_project = createElement('ul', null, [
                    {'id': 'status-' + task.status.id + '-project-' + task.project.id},
                    {'class': 'project-container'}
                ]);

                task_project.appendChild(createElement('span', task.project.name, [{'class': 'project-title'}]));

                task_status.appendChild(task_project);
            }

            let task_element = createElement('li');
            task_element.appendChild(createElement('div', task.name, [
                {'id': 'task-' + task.id},
                {'class': 'task-element'},
                {'draggable': 'true'}
            ]));

            if(document.querySelector('#task-' + task.id) !== null ||
                task_status.querySelector('#task-' + task.id) !== null) {
                continue;
            }

            task_project.appendChild(task_element);
        }
    });
}

function createElement(tag, text = null, attributes = [])
{
    let element = document.createElement(tag);

    if(text !== null){
        let element_text = document.createTextNode(text);
        element.appendChild(element_text);
    }

    for(let i = 0; i < attributes.length; i++){
        for(let attributeName in attributes[i]){
            switch(attributeName){
                case 'id':
                    element.id = attributes[i][attributeName];
                    break;
                case 'class':
                    element.classList.add(attributes[i][attributeName]);
                    break;
                default:
                    element.setAttribute(attributeName, attributes[i][attributeName]);
                    break;
            }
        }
    }

    return element;
}