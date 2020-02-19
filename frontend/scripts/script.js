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
                       let task_element, task_name, task_element_content;

                       if(task.project !== null){
                           if(document.getElementById(status.name + '-' + task.project.name) !== null){

                               //TODO: refactor those 4 lines (that are in the else as well)
                               task_element = document.createElement('li');
                               task_name = document.createTextNode(task.name);
                               task_element_content = document.createElement('div');
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
                    console.log('all content loaded');
                    a();
                });

                let status_inner_text_container = document.createElement('h2');
                let status_inner_text = document.createTextNode(status.name);
                status_inner_text_container.appendChild(status_inner_text);

                status_column.appendChild(status_inner_text_container);
                status_column.appendChild(status_tasks);
                addContent(status_column);
            });

        });
});

function b(){}

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

function addContent(content)
{
    document.getElementById('main-content-container').appendChild(content);
}

function a(){
    let tasks = document.getElementsByClassName('task-element');

    for(let i = 0; i < tasks.length; i++)
    {
        let task = tasks[i];
        task.addEventListener('dblclick', function(){
            console.log('clicked !');
        });

        task.addEventListener('dragstart', function(event){
            event.currentTarget.classList.add('dragged');
        });

        task.addEventListener('drag', function(event){

        });

        task.addEventListener('dragend', function(event){
            event.currentTarget.classList.remove('dragged');

            console.log(event.target.parentNode.contains(event.srcElement));
        });
    }

    let columns = document.getElementsByClassName('status-column');
    for(let i = 0; i < columns.length; i++)
    {
        let column = columns[i];

        column.addEventListener('drop', function(event){

        });

        column.addEventListener('dragenter', function(event){
        });

        column.addEventListener('dragover', function(event){

        });

        column.addEventListener('dragleave', function(event){

        });
    }

}