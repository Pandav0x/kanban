let apiUrl = 'http://127.0.0.1:8000';

document.addEventListener("DOMContentLoaded", function(){

    let promise_statuses = new Promise((resolve) => { ajax('/status', 'GET', resolve); });
    let promise_projects = new Promise((resolve) => { ajax('/project', 'GET', resolve); });
    let promise_tasks =  new Promise((resolve) => { ajax('/task', 'GET', resolve); });

    Promise.all([promise_statuses, promise_projects, promise_tasks])
        .then(([unparsed_statuses, unparsed_projects, unparsed_tasks]) => {

            let statuses = JSON.parse(unparsed_statuses);
            let projects = JSON.parse(unparsed_projects);
            let tasks = JSON.parse(unparsed_tasks);

            //TODO: do the elements tree before iterate in it

            statuses.forEach(function(status){
               let status_column = document.createElement('div');
               let inner_text = document.createTextNode(status.name);
               status_column.appendChild(inner_text);
               addContent(status_column);
            });
        });
});

function ajax(url, protocol, callback)
{
    console.log(apiUrl + url);

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