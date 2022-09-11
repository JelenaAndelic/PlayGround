document.getElementById("demo").innerHTML = "There is no registered users";
let registeredClients = [];
let registeredClientsByFirefox = [];
let registeredClientsByChrome = [];
const table = document.querySelector("#tableClient");
const trFilter = document.querySelector("#rowFilter");
let selectedRow;
let number = document.getElementById("credit");

function add(event) {
    event.preventDefault();

    const clientRegistration = {
        firstName: document.getElementsByName("fname")[0].value,
        lastName: document.getElementsByName("lname")[0].value,
        email: document.getElementsByName("email")[0].value,
        city: document.getElementsByName("city")[0].value,
        credit: document.getElementsByName("credit")[0].value
    };

    let userAgent = navigator.userAgent;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        clientRegistration.browser = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        clientRegistration.browser = "Firefox";
    }

    if (document.getElementById("fname").value == "" &&
        document.getElementById("lname").value == "" &&
        document.getElementById("email").value == "" &&
        document.getElementById("city").value == "" &&
        document.getElementById("credit").value == "") {
        alert("Please enter the input fields!");
    } else if (document.getElementById("fname").value == "") {
        alert("First name can not be empty!");
    } else if (document.getElementById("lname").value == "") {
        alert("Last name can not be empty!");
    } else if (document.getElementById("email").value == "") {
        alert("Email can not be empty!");
    } else if (document.getElementById("city").value == "") {
        alert("City have to be selected!");
    } else if (document.getElementById("credit").value == "") {
        alert("Credit can not be empty!");
    } else {

        fetch("http://localhost:8080/clientRegistration/add", {
            method: "POST",
            body: JSON.stringify(clientRegistration),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        })

            .then(result => {
                if (result.status == 226) {
                    alert("User with this email address already exist!!!");
                    return;
                } else {
                    return result;
                }
            })
            .then(result => result.json())
            .then(result => {
                let createdClientJSON = result;
                console.log("Completed with result:", result);
                registeredClients.push(createdClientJSON);
                if (registeredClients.length > 0) {
                    document.getElementById("divTable").style.display = "block";
                    document.getElementById("demo").style.display = "none";
                }
                showRegisteredClients(registeredClients);
                resetForm();
            })
            .catch(err => {
                console.error(err);
            });
    }
};

get();

function get() {
    fetch("http://localhost:8080/clientRegistration/get", {
        method: "GET",
    }).then(result => result.json())
        .then(result => {
            registeredClients = result;
            if (registeredClients.length > 0) {
                document.getElementById("divTable").style.display = "block";
                document.getElementById("demo").style.display = "none";
            }
            showRegisteredClients(registeredClients);
        })
        .catch(err => {
            console.error(err);
        });
}

function showRegisteredClients(arrayOfRegisteredClients) {
    table.innerHTML = "";
    table.appendChild(trFilter);
    arrayOfRegisteredClients.forEach(element => {
        let newRow = creatRow(element);
        trFilter.parentNode.insertBefore(newRow, trFilter);
    });
}

function creatRow(clientRegistration) {
    const tr = document.createElement("tr");
    const tableHead1 = document.createElement("td");
    const tableHead2 = document.createElement("td");
    const tableHead3 = document.createElement("td");
    const tableHead4 = document.createElement("td");
    const tableHead5 = document.createElement("td");
    const tableHead6 = document.createElement("td");
    const tableHead7 = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("id", "editBtn");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("id", "removeBtn");

    tableHead6.appendChild(editBtn);
    tableHead6.appendChild(removeBtn);

    tr.appendChild(tableHead1);
    tr.appendChild(tableHead2);
    tr.appendChild(tableHead3);
    tr.appendChild(tableHead4);
    tr.appendChild(tableHead5);
    tr.appendChild(tableHead6);

    tr.setAttribute("data-id", clientRegistration.id);

    tableHead1.textContent = clientRegistration.firstName;
    tableHead2.textContent = clientRegistration.lastName;
    tableHead3.textContent = clientRegistration.email;
    tableHead4.textContent = clientRegistration.city;
    tableHead5.textContent = clientRegistration.credit;
    removeBtn.addEventListener("click", removeRow);
    editBtn.addEventListener("click", function () {
        editClient(this);
    });
    return tr;
}

function filterFunction() {

    let selectedBrowser = document.querySelector("#selectFilter").value;

    if (selectedBrowser == "Firefox") {
        registeredClientsByFirefox = registeredClients.filter(clientRegistration => clientRegistration.browser == "Firefox");
        registeredClientsByFirefox = registeredClientsByFirefox.sort((x, y) => x.credit - y.credit);
        showRegisteredClients(registeredClientsByFirefox);

    } else if (selectedBrowser == "Chrome") {
        registeredClientsByChrome = registeredClients.filter(clientRegistration => clientRegistration.browser == "Chrome");
        registeredClientsByChrome = registeredClientsByChrome.sort((x, y) => y.credit - x.credit);
        showRegisteredClients(registeredClientsByChrome);

    } else if (selectedBrowser == "") {
        registeredClients = registeredClients.sort((x, y) => Number(x.id) - Number(y.id));
        showRegisteredClients(registeredClients);
    }
}

function resetForm() {
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("city").value = "";
    document.getElementById("credit").value = "";

    document.getElementById("email").removeAttribute("readonly");

}

function editClient(buttonOfWhicIsClicked) {

    rowThatContainsButton = buttonOfWhicIsClicked.parentNode.parentNode;
    let clientId = rowThatContainsButton.getAttribute("data-id");
    let clientToBeEdited = registeredClients.find(element => element.id == clientId);

    document.getElementById("fname").value = rowThatContainsButton.cells[0].innerHTML;
    document.getElementById("lname").value = rowThatContainsButton.cells[1].innerHTML;
    document.getElementById("email").value = rowThatContainsButton.cells[2].innerHTML;
    document.getElementById("city").value = rowThatContainsButton.cells[3].innerHTML;
    document.getElementById("credit").value = rowThatContainsButton.cells[4].innerHTML;

    document.getElementById("email").setAttribute("readonly", true);
}

function saveChanges(event) {
    event.preventDefault();
    let clientId = rowThatContainsButton.getAttribute("data-id");

    const clientRegistration = {
        id: clientId,
        firstName: document.getElementsByName("fname")[0].value,
        lastName: document.getElementsByName("lname")[0].value,
        email: document.getElementsByName("email")[0].value,
        city: document.getElementsByName("city")[0].value,
        credit: document.getElementsByName("credit")[0].value
    };

    if (document.getElementById("fname").value == "" &&
        document.getElementById("lname").value == "" &&
        document.getElementById("email").value == "" &&
        document.getElementById("city").value == "" &&
        document.getElementById("credit").value == "") {
        alert("Please enter the input fields!");
    } else if (document.getElementById("fname").value == "") {
        alert("First name can not be empty");
    } else if (document.getElementById("lname").value == "") {
        alert("Last name can not be empty");
    } else if (document.getElementById("email").value == "") {
        alert("Email can not be empty");
    } else if (document.getElementById("city").value == "") {
        alert("City have to be selected");
    } else if (document.getElementById("credit").value == "") {
        alert("Credit can not be empty");
    } else {

        fetch("http://localhost:8080/clientRegistration/edit", {
            method: "POST",
            body: JSON.stringify(clientRegistration),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(result => result.json())
            .then(result => {
                let createdClientJSON = result;
                console.log("Completed with result:", result);
                let index = registeredClients.findIndex(i => i.id == clientId);
                registeredClients[index] = createdClientJSON;

                rowThatContainsButton.cells[0].innerHTML = createdClientJSON.firstName;
                rowThatContainsButton.cells[1].innerHTML = createdClientJSON.lastName;
                rowThatContainsButton.cells[2].innerHTML = createdClientJSON.email;
                rowThatContainsButton.cells[3].innerHTML = createdClientJSON.city;
                rowThatContainsButton.cells[4].innerHTML = createdClientJSON.credit;
                resetForm();
            })
            .catch(err => {
                console.error(err);
            });
    }
}

function removeRow(event) {

    const clickedRow = event.target.parentNode.parentNode;
    const clientId = clickedRow.getAttribute("data-id");

    if (document.getElementById("tableClient").rows.length == 2 && confirm("Are you sure to delete this registered user?")) {
        fetch("http://localhost:8080/clientRegistration/delete/" + clientId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => {
                if (result.status == 200) {
                    clickedRow.remove();
                    let index = registeredClients.findIndex(i => i.id == clientId);
                    registeredClients.splice(index, 1);
                    document.getElementById("divTable").style.display = "none";
                    document.getElementById("demo").style.display = "block";
                }
            })
            .catch(err => {
                console.error(err);
            });


    } else if (confirm("Are you sure to delete this registered user?")) {
        fetch("http://localhost:8080/clientRegistration/delete/" + clientId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => {
                if (result.status == 200) {
                    clickedRow.remove();
                    let index = registeredClients.findIndex(i => i.id == clientId);
                    registeredClients.splice(index, 1);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
}

function deleteClient(event) {
    event.preventDefault();

    const clientEmail = document.getElementsByName("email")[0].value;

    if (document.getElementById("tableClient").rows.length == 2 && confirm("Are you sure to delete this registered user?")) {
        fetch("http://localhost:8080/clientRegistration/deleteByEmail?" + new URLSearchParams({ email: clientEmail }).toString(), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(result => {
                let createdClientJSON = result
                let clientIdToDelete = result.id;
                registeredClients = registeredClients.filter(element => element.id != clientIdToDelete);
                showRegisteredClients(registeredClients);
                resetForm();
                document.getElementById("divTable").style.display = "none";
                document.getElementById("demo").style.display = "block";
            })
            .catch(err => {
                console.error(err);
            });
    } else if (confirm("Are you sure to delete this registered user?")) {
        fetch("http://localhost:8080/clientRegistration/deleteByEmail?" + new URLSearchParams({ email: clientEmail }).toString(), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(result => {
                let createdClientJSON = result
                let clientIdToDelete = result.id;
                registeredClients = registeredClients.filter(element => element.id != clientIdToDelete);
                showRegisteredClients(registeredClients);
                resetForm();
            })
            .catch(err => {
                console.error(err);
            });
    }
}

function exitInput(event) {
    event.preventDefault();

    let inputField = document.getElementsByTagName("input");
    for (let i = 0; i < inputField.length; i++) {
        inputField[i].value = "";
    }

    let dropDown = document.getElementById("city");
    dropDown.selectedIndex = 0;

    document.getElementById("email").removeAttribute("readonly");
}

number.onkeydown = function (e) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
        return false;
    }
}



