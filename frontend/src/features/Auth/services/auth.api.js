import axios from "axios";

// export const register = (username,email,password)=>{

//     try{
//     const response = axios.post("http://localhost:3000/api/auth/register",{
//         username,email,password
//     },{
//         withCredentials:true,
//     })

//     return response.data;
// }
// catch(err){
//     console.log(err);
// }
// }

// export const login = (username,email,password)=>{

//     try{
//     const response = axios.post("http://localhost:3000/api/auth/login",{
//         username,email,password
//     },{
//         withCredentials:true,
//     })

//     return response.data;
// }
// catch(err){
//     console.log(err);
// }
// }

// export const register = ()=>{

//     try{
//     const response = axios.post("http://localhost:3000/api/auth/logout",{
//         withCredentials:true,
//     })

//     return response.data;
// }
// catch(err){
//     console.log(err);
// }
// }

// export const Getme = ()=>{

//     try{
//     const response = axios.post("http://localhost:3000/api/auth/get-me",{
//         withCredentials:true,
//     })

//     return response.data;
// }
// catch(err){
//     console.log(err);
// }
// }

const api = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true,
})

export const register = async ({ username, email, password }) => {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
//in the comments, we can see that many codes are repeated so we will use axios.create() to optimise.

export const login = async ({ email, password }) => {
    try {
        const response = await api.post("/login", {
      
            email: email,
            password,
        });

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/logout");

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const Getme = async () => {
    try {
        const response = await api.get("/get-me");

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

