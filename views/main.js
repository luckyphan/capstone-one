// make buttons work
// make the form work
// display requests from database

// utils 
const baseURL = `http://localhost:4040`;
// add querys for front end elements

// buttons from index
const userLogin = document.getElementById('userLogin')
const newUserSubmit = document.getElementById('newUserSubmit')

// inputs from index
const username = document.getElementById('username')
const newUser = document.getElementById('newUser')
const password = document.getElementById('password')
const newPassword = document.getElementById('newPassword')


const login = () => {
  let body = { username: username.value, password: password.value }
  axios.post(`${baseURL}/api/login`, body)
    .then((res) => {
      console.log(res.data);
      let token = res.data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", res.data.id);
      //window.location.href = `/`;
    })
    .catch((err) => console.log(err));
  }

const signUp = () => {
  let body = { username: newUser.value, password: newPassword.value }
  axios
    .post(`${baseURL}/api/signUp`, body)
    .then(async (res) => {
      // console.log("hit signup");
      let token = await res.data.token;
      console.log(res.data);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", res.data.id);
      //window.location.href = `/`;
    })
    .catch((err) => console.log(err));
  }

userLogin.addEventListener('click', login)
newUserSubmit.addEventListener('click', signUp)
