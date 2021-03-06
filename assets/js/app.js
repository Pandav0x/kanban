let xml_parser = new XMLSerializer();
let dom_parser = new DOMParser();
let staging_elements = [];

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

//Drag and Drop event binding
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

    let destination_status = event.target.closest('.status-column');
    let destination_status_id = getBackendId(destination_status);

    if(destination_status_id === undefined)
        return;

    if(dragged_task !== null){

        if(dragged_task.closest('.project-container').children.length === 2){ //The span + the not yet removed div
            dragged_task.closest('.project-container').remove();
        }

        dragged_task.closest('li').remove();
    }

    let task_status_update = new Promise((resolve) => {
        ajax('/task/' + getBackendId(dragged_task) + '/set/status/' + destination_status_id, 'GET', resolve)
    });
    Promise.resolve(task_status_update).then((result) => {
        displayTasks();
    });

    event.dataTransfer.clearData();
});

//Edit event binding
document.addEventListener('dblclick', function(event) {
    if(event.target.dataset.editable !== undefined)
    {
        let delete_button = createElement('span', '[X]', [
            { 'class': 'delete-button' },
            { 'data-target': event.target.id }
        ]);

        let validate_button = createElement('span', '[V]', [
            { 'class': 'validate-button' },
            { 'data-target': event.target.id }
        ]);

        let exit_button = createElement('span', '[~]', [
            {'class': 'exit-button'}
        ]);


        let current_panel_id = getRandomString();
        let edit_text_area = createElement('textarea', event.target.innerHTML);

        let edit_component = createElement('div', null, [
            {'class': 'edit-area'},
            {'id': current_panel_id},
            {'data-context': event.target.dataset.editable}
        ]);

        edit_component.appendChild(edit_text_area);
        edit_component.appendChild(delete_button);
        edit_component.appendChild(validate_button);
        edit_component.appendChild(exit_button);

        saveElement(current_panel_id, event.target, event.target.parentNode.id);

        event.target.parentElement.replaceChild(edit_component, event.target);
    }
});

document.addEventListener('click', function(event){
    if(event.target.closest('.exit-button')){
        let edit_panel_id = event.target.parentNode.id;
        if(staging_elements[edit_panel_id] !== null){

            let edit_panel = document.getElementById(edit_panel_id);
            let original_element = loadElement(edit_panel_id, 'element');

            document.getElementById(loadElement(edit_panel_id, 'parent_id')).replaceChild(original_element, edit_panel);
        }
    }

    if(event.target.closest('.validate-button')){
        let edit_panel_id = event.target.parentNode.id;
        let edit_context = event.target.parentNode.dataset.context;
        if(staging_elements[edit_panel_id] !== null){

            let edit_panel = document.getElementById(edit_panel_id);
            let original_element = loadElement(edit_panel_id, 'element');
            let parent_id = loadElement(edit_panel_id, 'parent_id');

            original_element.innerText = edit_panel.querySelector('textarea').value;

            let update_promise = new Promise((resolve) => {
                ajax('/' + edit_context + '/update/' + getBackendId(parent_id) + '/' , 'PUT', resolve, {'name': original_element.innerText});
            });

            Promise.resolve(update_promise).then((message) => {});

            document.getElementById(parent_id).replaceChild(original_element, edit_panel);
            removeElement(edit_panel_id);
        }
    }

    if(event.target.closest('.delete-button')){
        let edit_panel_id = event.target.parentNode.id;
        let edit_context = event.target.parentNode.dataset.context;
        if(staging_elements[edit_panel_id] !== null){
            let parent_id = loadElement(edit_panel_id, 'parent_id');

            document.getElementById(parent_id).remove();

            let delete_promise = new Promise((resolve) => {
                ajax('/' + edit_context + '/delete/' + getBackendId(parent_id) + '/' , 'DELETE', resolve);
            });

            Promise.resolve(delete_promise).then((message) => {});

            removeElement(edit_panel_id);
        }
    }
});

//Modal event binding
document.getElementById('button-add').addEventListener('click', function() {
    document.getElementById('modal-wrapper').classList.toggle('hide');
});

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

/**
 * Gets information and fill the selects in the modal creation form
 */
function fetchModalSelectInfos()
{
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

/**
 * Makes an ajax call to a given url, with a given method and given data
 * @param url
 * @param method
 * @param callback
 * @param data
 */
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

    let xhr = new XMLHttpRequest();
    xhr.open(method, url + formattedData);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

/**
 * Generates a random string 13 characters long
 * @returns {string}
 */
function getRandomString()
{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Parse a given element's id to get its backend id
 * @param element
 * @returns {string}
 */
function getBackendId(element)
{
    if(element === null)
        return;
    if(typeof element === 'object')
        return element.id.substr(element.id.lastIndexOf('-') + 1);
    return element.substr(element.lastIndexOf('-') + 1);
}

/**
 * Display all the statuses
 * @returns {Promise<any | never>}
 */
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
                    status_column.appendChild(createElement('h2', status.name, [
                        {'class': 'neon-white-red'},
                        {'id': 'status-' + status.id + '-title' },
                        {'data-editable': 'status'}
                    ]));

                    document.getElementById('main-content-container').appendChild(status_column);
                }
            });
            displayTasks();
        });
}

/**
 * Display all the tasks
 * @returns {Promise<any | never>}
 */
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

                task_project.appendChild(createElement('span', task.project.name, [
                    {'class': 'project-title'},
                    {'id': 'project-' + task.project.id + '-title'},
                    {'data-editable': 'project'}
                ]));

                task_status.appendChild(task_project);
            }

            let task_element = createElement('li', null, [{'id': 'task-container-' + task.id}]);

            task_element.appendChild(createElement('div', task.name, [
                {'id': 'task-' + task.id},
                {'class': 'task-element'},
                {'draggable': 'true'},
                {'data-editable': 'task'}
            ]));

            if(document.querySelector('#task-' + task.id) !== null ||
                task_status.querySelector('#task-' + task.id) !== null) {
                continue;
            }

            task_project.appendChild(task_element);
        }
    });
}

/**
 * Creates DOM element with a given tag, text and attributes
 * @param tag
 * @param text
 * @param attributes
 * @returns {HTMLElement}
 */
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

/**
 * Save a DOM element in the staging area with a given key, itself and its parent's DOM id
 * @param key
 * @param element
 * @param parent_id
 */
function saveElement(key, element, parent_id)
{
    staging_elements[key] = {
        'element': xml_parser.serializeToString(element),
        'parent_id': parent_id
    };
}

/**
 * Gets an element OR its parent's id from its staging key
 * @param key
 * @param flag
 * @returns {*}
 */
function loadElement(key, flag)
{
    switch (flag){
        case 'element':
            return dom_parser.parseFromString(staging_elements[key].element, 'text/xml').documentElement;
        case 'parent_id':
            return staging_elements[key].parent_id;
    }
    return staging_elements[key];
}

/**
 * Remove an element based on a given key
 * @param key
 */
function removeElement(key)
{
    delete staging_elements[key];
}