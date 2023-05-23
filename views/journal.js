const baseURL = `http://localhost:4040`;

const closeEntry = document.getElementById('entry-close') 
const createEntry = document.getElementById('entry-create') 
const entry = document.getElementById('entry-in-container') 
const entryTitle = document.getElementById('entryTitle') 
const entryBody = document.getElementById('entryBody') 
const form = document.getElementById('titleBody')
let logoutbtn= document.getElementById('logout')
const entryContainer = document.getElementById('entryContainer')
const edit = document.getElementById('edit')
const deleteBtn = document.getElementById('delete')
const entrySubmit = document.getElementById('entrySubmit')
let curEventID = 0;

logoutbtn.addEventListener('click',(event)=>{
    console.log(event)
    sessionStorage.clear()
    window.location.href = `${baseURL}`
    
})
// const entryGrab = document.getElementsByClassName('entry-card')
/********* entry buttons *********/
const exitEntry = (event) => {
    event.target.parentElement.style.display ="none";
}
const openEntry = () => {
    entry.style.display ="block";
    entryTitle.value = ''
    entryBody.value = ''
    entrySubmit.style.display="block";
    deleteBtn.style.display ="none";
    edit.style.display ="none";
}
/********* [entry buttons] *********/

/***************** Entry input submission *****************/
form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (
        entryTitle.value === '' ||
        entryBody.value === ''
    ) {
        alert('Please fill out both title and body fields of your journal :)')
        return
    }
    console.log(sessionStorage.getItem("userID"))
    let maBod = {
        title: entryTitle.value,
        body: entryBody.value,
        user_id: sessionStorage.getItem("userID")
    }

    axios.post(`${baseURL}/entry/create`, maBod)
    .then((async (result) => {
        // console.log(result.data[0])
        createEntryCard(result.data[0])
    }))
    .catch((err) => console.log(err));

    entryTitle.value = ''
    entryBody.value = ''
})
/***************** [Entry input] *****************/

function signOut(){
    console.log('here')
    sessionStorage.clear()
    window.location.href = `${baseURL}`
    
}


/***************** Make new entry clickable and put in list after add *****************/
function showEntries(){
    //show all entries with the userid from the sesssion
    // console.log('we are aiming to get info from user: ',sessionStorage.getItem("userID"))
    let userID = sessionStorage.getItem("userID")
    
    axios.get(`${baseURL}/entry/get/${userID}`)
    .then((entry) => {
        let entryArr = entry.data
        entryContainer.innerHTML = "";
        entryArr.forEach(prompt => {
            let entryHTML = createEntryCard(prompt)
            entryHTML.addEventListener('click',editEntry)
            entryContainer.appendChild(entryHTML)
        });
    })
    .catch((err) => console.log(err));
}


function createEntryCard(entry){
    // console.log(entry)
    let div = document.createElement('div')
    div.classList.add("entry-card")
    div.setAttribute('id',`${entry.entry_id}`)
    div.innerHTML= `<h2 class ="entry-text" id ="${entry.entry_id}">${entry.title}</h2>`
    return div
    
}
/***************** [Make new entry clickable and put in list after add] *****************/

function editEntry(event){
    
    let entryID = event.target.id
    curEventID = entryID
    // console.log(entryID)
    openEntry();
    entrySubmit.style.display="none";
    deleteBtn.style.display ="block";
    edit.style.display ="block";
    axios.get(`${baseURL}/entry/getEntry/${entryID}`)
    .then((entry) => {
        //selects the specific entry by id
        let entryArr = entry.data[0]
        console.log(entryArr)
        const {title, body, entry_id} = entryArr
        entryTitle.value = title
        entryBody.value = body
    })
    .catch((err) => console.log(err));
}
/*****************Update entry after click, and tile and body is populated*****************/
    //then populate the title and body field
    //user can save changes upon submit
function sendEntry(){
    let entryID = curEventID
    console.log('entry id is ',entryID)
    let bod = {
        title: entryTitle.value,
        body: entryBody.value
    }
    axios.put(`${baseURL}/entry/update/${entryID}`, {bod})
    .then((entry) => {
        alert('its been updated')
        location.reload();
    })
    .catch((err) => console.log(err));
}

//add another button to differentiate the submit from the save/edit button

/*****************[Update entry after click, and tile and body is populated]*****************/

/*****************Delete entry after click, and tile and body is populated*****************/
function ridEntry(){
    
    let entryID = curEventID
    console.log('deleting ',entryID)
    axios.delete(`${baseURL}/entry/delete/${entryID}`)
    .then((entry) => {
        alert('its been deleted')
        location.reload();
    })
    .catch((err) => console.log(err));
}

closeEntry.addEventListener('click',exitEntry)
createEntry.addEventListener('click',openEntry)
edit.addEventListener('click',sendEntry)
deleteBtn.addEventListener('click',ridEntry)
showEntries()