let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){
    let status_promise = new Promise((resolve) => {
        displayStatuses(resolve);
    });

    let task_promise = new Promise((resolve) => {
        displayTasks(resolve);
    });

    Promise.resolve(status_promise)
        .then(() => {
            Promise.resolve(task_promise).then(()=> {
                bindDragNDropEvents();
            })
        });
});

function ajax(url, protocol, callback)
{
    let xhr = new XMLHttpRequest();
    xhr.open(protocol, apiUrl + url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

function getBackendId(element)
{
    return element.id.substr(element.id.lastIndexOf('-') + 1);
}

function displayStatuses(callback)
{
    let promise_statuses = new Promise((resolve) => {
        ajax('/status', 'GET', resolve);
    });
    Promise.resolve(promise_statuses)
        .then((unparsed_statuses) => {

            let statuses = JSON.parse(unparsed_statuses);

            statuses.forEach(function (status) {

                let status_column = createElement('div', null, [
                    {'id': 'status-' + status.id},
                    {'class': 'status-column'}
                ]);
                status_column.appendChild(createElement('h2', status.name));

                document.getElementById('main-content-container').appendChild(status_column);
            });
            displayTasks();
        });
    callback(); //TODO - go to the church and ask the bishop why this isn't working ffs
}

//TODO - Add a status argument to not fetch all tasks from all status on refresh after drop
function displayTasks(callback)
{
    let promise_tasks = new Promise((resolve) => {
        ajax('/task', 'GET', resolve);
    });

    Promise.resolve(promise_tasks).then((unparsed_tasks) => {
        let tasks = JSON.parse(unparsed_tasks);

        for(let i = 0; i < tasks.length; i++)
        {
            let task = tasks[i];
            let task_status = document.getElementById('status-' + task.status.id);
            let task_project = task_status.querySelector('#status-' + task.status.id + '-project-' + task.project.id);

            if(task_project === null){
                task_project = createElement('ul', null, [
                        {'id': 'status-' + task.status.id + '-project-' + task.project.id},
                        {'class': 'project-container'}]);

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
        callback();
    });
}

function bindDragNDropEvents()
{
    let tasks = document.getElementsByClassName('task-element');
    for(let i = 0; i < tasks.length; i++)
    {
        let task = tasks[i];
        task.addEventListener('dblclick', function(){
            console.log('clicked !');
        });

        task.addEventListener('dragstart', function(event){
            event.currentTarget.classList.add('dragged');
            event.dataTransfer.setData('text/plain', event.currentTarget.id);
        });

        task.addEventListener('drag', function(event){
            //TODO - put a picture for the dragged element
        });

        task.addEventListener('dragend', function(event){
            event.currentTarget.classList.remove('dragged');
        });
    }

    let columns = document.getElementsByClassName('status-column');
    for(let i = 0; i < columns.length; i++)
    {
        let column = columns[i];

        column.addEventListener('drop', function(event){
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

        column.addEventListener('dragover', function(event){
            event.preventDefault();
        });

        column.addEventListener('dragenter', function(event){
            //TODO - add an animation to show it will be dropped where it should
        });

        column.addEventListener('dragleave', function(event){
            //TODO - second part of the animation of the dragenter event
        });
    }
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