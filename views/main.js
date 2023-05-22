
// utils 
const baseURL = `http://localhost:4040`;

const userLogin = document.getElementById('userLogin')
const newUserSubmit = document.getElementById('newUserSubmit')
const username = document.getElementById('username')
const newUser = document.getElementById('newUser')
const password = document.getElementById('password')
const newPassword = document.getElementById('newPassword')




const login = (event) => {
    event.preventDefault()
  let body = { username: username.value, password: password.value }
  axios.post(`${baseURL}/api/login`, body)
    .then(async(res) => {
      let token = res.data.token;
      let user_id = await res.data.user_id
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userID", user_id);
      
      window.location.href = `${baseURL}/entryPage`
    })
    .catch((err) => console.log(err));
  }

const signUp = () => {
  let body = { username: newUser.value, password: newPassword.value }
  axios
    .post(`${baseURL}/api/signUp`, body)
    .then(async (res) => {
      let token = await res.data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userID", user_id);
     
    })
    .catch((err) => console.log(err));
  }



userLogin.addEventListener('click', login)
newUserSubmit.addEventListener('click', signUp)
