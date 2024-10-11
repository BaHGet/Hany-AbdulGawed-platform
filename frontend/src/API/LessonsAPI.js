require('../utilities/fetch.js')

const lessonsApi = 'https://hany-server.netlify.app/.netlify/functions/api/lessons'

export const getAll= async(branch)=>{
    let res;
    let optiones = {
        method: "GET",  
        headers:{
            "Content-Type": "application/json"
        }
    }
    try{
        res = await fetch(`${lessonsApi}/${branch}`, optiones).then(res => res.json())
    } catch(err){
        res =false;
        console.error(err, 'catch in LessonsAPI>getAll')
    }
    const data = await res
    return(data);
}

export const getSpecific= async(branch, order)=>{
    let res;
    let optiones = {
        method: "GET",  
        headers:{
            "Content-Type": "application/json"
        }
    }
    try{
        res = await fetch(`${lessonsApi}/${branch}/${order}`, optiones).then(res => res.json())
    } catch(err){
        res =false;
        console.error(err, 'catch in LessonsAPI>getSpecific')
    }
    const data = await res
    return(data);
}

export const updateSpecific= async(branch, order, data)=>{
    let res;
    let optiones = {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    try{
        res = await fetch(`${lessonsApi}/${branch}/${order}`, optiones).then(res => res.json())
    } catch(err){
        res =false;
        console.error(err, 'catch in LessonsAPI>updateSpecific')
    }
    const response = await res
    return(response);
}