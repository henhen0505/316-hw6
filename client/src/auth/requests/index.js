/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

const baseURL = 'http://localhost:4000/auth';

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

//helper to help fetch req

const fetchRequest = async(url, options = {}) =>{
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json',
        },
        ...options
    };

    try{
        const response = await fetch(url, defaultOptions);
        const data = await response.json();

        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


export const getLoggedIn = () => {
    return fetchRequest(`${baseURL}/loggedIn/`, {
        method: 'GET'
    }); 
};
export const loginUser = (email, password) => {
    return fetchRequest(`${baseURL}/login/`, {
        method: 'POST',
        body : JSON.stringify({
            email:email,
            password:password
        })
    });
};
export const logoutUser = () => {
    return fetchRequest(`${baseURL}/logout`, {
        method: 'GET'
    });
};
export const registerUser = (firstName, lastName, email, password, passwordVerify) => {
    return fetchRequest(`${baseURL}/register/`, {
    method: 'POST',
    body: JSON.stringify({
        firstName:firstName,
        lastName: lastName,
        email:email,
        password:password,
        passwordVerify:passwordVerify
    })
    
    });
};
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
