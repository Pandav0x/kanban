let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){
    display();
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

function getRandomString()
{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function addTaskToStatus(task, status)
{
    let update_promise = new Promise((resolve) => { ajax('/task/' + getBackendId(task) + '/set/status/' + getBackendId(status), 'POST', resolve); });

    Promise.resolve(update_promise).then((response) => {
        console.log('task ' + getBackendId(task) + ' updated to ' + getBackendId(status) + ' status');
    });

    return 'mais t\'avais dit qu\'on ferait des knackis ://///';
}

function getBackendId(element)
{
    return element.id.substr(element.id.lastIndexOf('-') + 1);
}

function display()
{
    let promise_statuses = new Promise((resolve) => { ajax('/status', 'GET', resolve); });

    Promise.resolve(promise_statuses)
        .then((unparsed_statuses) => {

            let statuses = JSON.parse(unparsed_statuses);

            statuses.forEach(function(status){
                let status_column = document.createElement('div');
                status_column.setAttribute('class', 'status-column');
                status_column.setAttribute('id', 'status-' + status.id);
                let status_tasks = document.createElement('ul');

                let promise_tasks =  new Promise((resolve) => { ajax('/status/' + status.id + '/task', 'GET', resolve); });

                Promise.resolve(promise_tasks).then((unparsed_tasks) => {
                    let tasks = JSON.parse(unparsed_tasks);

                    tasks.forEach(function(task){
                        let task_element, task_name, task_element_content;

                        if(task.project !== null){
                            if(document.getElementById(status.name + '-' + task.project.name) !== null){

                                //TODO: refactor those 4 lines (that are in the else as well)
                                task_element = document.createElement('li');
                                task_name = document.createTextNode(task.name);
                                task_element_content = document.createElement('div');
                                task_element_content.id = 'task-' + task.id;
                                task_element_content.appendChild(task_name);
                                task_element.appendChild(task_element_content);
                                task_element.classList.add('task-element');
                                task_element_content.setAttribute('draggable', 'true');
                                document.getElementById(status.name + '-' + task.project.name).appendChild(task_element);

                            } else {

                                let project_container = document.createElement('li');
                                let project_name_container = document.createElement('span');
                                let project_name = document.createTextNode(task.project.name);
                                project_name_container.appendChild(project_name);
                                project_name_container.classList.add('project-title');
                                project_container.appendChild(project_name_container);
                                let project_container_content = document.createElement('ul');

                                project_container_content.setAttribute('id', status.name + '-' + task.project.name);
                                project_container_content.classList.add('project-container');
                                task_element = document.createElement('li');
                                task_element_content = document.createElement('div');
                                task_element_content.id = 'task-' + task.id;
                                task_name = document.createTextNode(task.name);
                                task_element_content.setAttribute('draggable', 'true');
                                task_element_content.appendChild(task_name);
                                task_element.appendChild(task_element_content);
                                task_element.classList.add('task-element');
                                project_container_content.appendChild(task_element);

                                project_container.appendChild(project_container_content);
                                status_tasks.appendChild(project_container);
                            }
                        }
                    });
                    bindDragNDropEvents();
                });

                let status_inner_text_container = document.createElement('h2');
                let status_inner_text = document.createTextNode(status.name);

                status_inner_text_container.appendChild(status_inner_text);
                status_column.appendChild(status_inner_text_container);
                status_column.appendChild(status_tasks);

                document.getElementById('main-content-container').appendChild(status_column);
            });

        });
}

function displayStatuses()
{

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
            event.dataTransfer.setData('text/plain', event.currentTarget.children[0].id);
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

            let dragged_element = document.getElementById(event.dataTransfer.getData('text'));
            //dragged_element.closest('li').remove();
            event.target.closest('.status-column').appendChild(dragged_element);

            addTaskToStatus(dragged_element, event.target.closest('.status-column'));
            display();

            event.dataTransfer.clearData();
        });

        column.addEventListener('dragover', function(event){
            event.preventDefault();
        });

        column.addEventListener('dragenter', function(event){
            //TODO: add an animation to show it will be dropped where it should
        });

        column.addEventListener('dragleave', function(event){
            //TODO: second part of the animation of the dragenter event
        });
    }

}

//TODO - use it (when addTaskToStatus will be working as intended)
function createElementWithText(tag, text = null, attributes = [])
{
    let element = document.createElement(tag);

    if(text !== null){
        let element_text = document.createTextNode(text);
        element.appendChild(element_text);
    }

    for(let attributeName in attributes){
        switch(attributeName){
            case 'id':
                element.id = attributes[attributeName];
                break;
            case 'class':
                element.classList.add(attributes[attributeName]);
                break;
            default:
                element.setAttribute(attributeName, attributes[attributeName]);
                break;
        }
    }

    return element;
}