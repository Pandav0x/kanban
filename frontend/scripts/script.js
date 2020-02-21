let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){

    let promise_statuses = new Promise((resolve) => { ajax('/status', 'GET', resolve); });

    Promise.resolve(promise_statuses)
        .then((unparsed_statuses) => {

            let statuses = JSON.parse(unparsed_statuses);

            statuses.forEach(function(status){
                let status_column = document.createElement('div');
                status_column.setAttribute('class', 'status-column');
                let status_tasks = document.createElement('ul');

                let promise_tasks =  new Promise((resolve) => { ajax('/status/' + status.id + '/task', 'GET', resolve); });

                Promise.resolve(promise_tasks).then((unparsed_tasks) => {
                   let tasks = JSON.parse(unparsed_tasks);

                   tasks.forEach(function(task){
                       if(task.project !== null){
                           addTaskToStatus(status, task);
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
});

function addTaskToStatus(status, task){

    console.log('coucou');

    let task_element, task_name, task_element_content, project_container_content;

    task_element = document.createElement('li');
    task_name = document.createTextNode(task.name);
    task_element_content = document.createElement('div');
    task_element_content.id = getRandomString();
    task_element_content.setAttribute('draggable', 'true');
    task_element_content.appendChild(task_name);
    task_element.appendChild(task_element_content);
    task_element.classList.add('task-element');

    if((project_container_content = document.getElementById(status.name + '-' + task.project.name)) === null) {

        let project_container = document.createElement('li');
        let project_name_container = document.createElement('span');
        let project_name = document.createTextNode(task.project.name);

        project_container_content = document.createElement('ul');
        project_container_content.setAttribute('id', status.name + '-' + task.project.name);
        project_container_content.classList.add('project-container');

        project_name_container.appendChild(project_name);
        project_name_container.classList.add('project-title');
        project_container.appendChild(project_name_container);
    }

    project_container_content.appendChild(task_element);

    return project_container_content;
}

function createElementWithText(div, text, attributes = [])
{
    let element;
    attributes.forEach(function(attributeName, attributeValue){
        switch(attributeName){
            case 'id':
                element.id = attributeValue;
                break;
            default:
                element.setAttribute(attributeName, attributeValue);
                break;
        }
    });
    return element;
}

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

function bindDragNDropEvents(){

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
            dragged_element.closest('li').remove();
            event.target.closest('.status-column').appendChild(dragged_element);
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