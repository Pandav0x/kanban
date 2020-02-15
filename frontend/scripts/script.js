let apiUrl = 'http://127.0.0.1:8000';
let call_statuses

document.addEventListener("DOMContentLoaded", function(){

    let mainContentWrapper = document.getElementById('main-content-wrapper');

    call_statuses = new Promise((resolve) => { ajax('/status', 'GET', resolve); });
    let call_projects = new Promise((resolve) => { ajax('/project', 'GET', resolve); });
    let call_tasks =  new Promise((resolve) => { ajax('/task', 'GET', resolve); });

    Promise.all([call_statuses, call_projects, call_tasks])
        .then(([statuses, projects, tasks]) => {

            console.log(projects);

            //TODO

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