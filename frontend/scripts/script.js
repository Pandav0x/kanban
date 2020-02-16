let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){

    let promise_statuses = new Promise((resolve) => { ajax('/status', 'GET', resolve); });

    Promise.resolve(promise_statuses)
        .then((unparsed_statuses) => {

            let statuses = JSON.parse(unparsed_statuses);

            statuses.forEach(function(status){
                let status_column = document.createElement('div');
                status_column.setAttribute('class', 'status-column')
                let status_tasks = document.createElement('ul');

                let promise_tasks =  new Promise((resolve) => { ajax('/status/' + status.id + '/task', 'GET', resolve); });

                Promise.resolve(promise_tasks).then((unparsed_tasks) => {
                   let tasks = JSON.parse(unparsed_tasks);
                   console.log(tasks);

                   tasks.forEach(function(task){
                       let task_element, task_name;

                       console.log(task);
                       if(task.project !== null){
                           if(document.getElementById(status.name + '-' + task.project.name) !== null){

                               task_element = document.createElement('li');
                               task_name = document.createTextNode(task.name);
                               task_element.appendChild(task_name);
                               document.getElementById(status.name + '-' + task.project.name).appendChild(task_element);

                           } else {

                               let project_container = document.createElement('li');
                               let project_name = document.createTextNode(task.project.name);
                               project_container.appendChild(project_name);
                               let project_container_content = document.createElement('ul');

                               project_container_content.setAttribute('id', status.name + '-' + task.project.name);
                               console.log(project_container);
                               task_element = document.createElement('li');
                               task_name = document.createTextNode(task.name);
                               task_element.appendChild(task_name);
                               project_container_content.appendChild(task_element);

                               project_container.appendChild(project_container_content);
                               status_tasks.appendChild(project_container);
                           }
                       }
                   });
                });

                let inner_text = document.createTextNode(status.name);
                status_column.appendChild(inner_text);
                status_column.appendChild(status_tasks);
                addContent(status_column);
            });
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

function addContent(content)
{
    document.getElementById('main-content-container').appendChild(content);
}