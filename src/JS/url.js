// for localhost
const startUrl = 'http://localhost:8080/'

// for heruko 
//const startUrl = 'https://qr-scanner.herokuapp.com'


let validateLogin = `${startUrl}/api/v1/users/validate/`
let getAllUsers = `${startUrl}/api/v1/users/`
let deleteUser = `${startUrl}/api/v1/users/delete`
let updateUser = `${startUrl}/api/v1/users/update`
let updatePassword = `${startUrl}/api/v1/users/update/password`
let addAccount = `${startUrl}/api/v1/users/add`