
const server = "http://localhost:8000" ; 

// Personal API Key for OpenWeatherMap API
const apikey = "&appid=47208da3d9d9cb688dd0e78a81d210a1&units=metric"
const baseurl = "https://api.openweathermap.org/data/2.5/weather?zip="

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 +'.'+ d.getDate() +'.' + d.getFullYear();



// Event listener to add function to existing HTML DOM element

document.getElementById("generate").addEventListener("pointerover",() => {
    document.getElementById("generate").style.cssText = 'cursor: pointer';})

document.getElementById("generate").addEventListener('click',generation);
/* Function called by event listener */
async function  generation () {
    const zip = document.getElementById("zip").value;
    const feeling = document.getElementById("feelings").value;
    if (/[a-zA-Z]/.test(zip)){
        alert("unvalid input");
        return;
    }
    const wethdata = await GetWethData(baseurl, apikey, zip,feeling,newDate);
    try{
        postData('/postweth',wethdata).then(updateUi);
    }

    catch (error) {
        console.log("error"+error);

    }
    
}

/* Function to GET Web API Data*/
const  GetWethData= async (baseurl, apikey, zip,feeling,newDate) => {
    const res = await fetch(baseurl+zip+apikey);
    if (res.status==404){
        alert("City not found.");
        return ;
    }
    try{
        const data = await res.json();
        data['date'] = newDate;
        data['feelings'] = feeling;
        return data
    }
    catch (error) {
        console.log("error"+error);

    }
}

/* Function to POST data */
const postData = async (url, data) => {
    data = await data ;
    const res = await fetch(server + url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
    });
    try {
    const newdata = await res.json();
    return newdata ;
    }
    catch(error) {
    console.log("error", error);

      }
  } 



/* Function to GET Project Data */
const getData = async(url) => {
    
    const res = await fetch(url, {
    method: 'GET', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
  });

    try {
      const data = await res.json();
      return data;
    }catch(error) {
    console.log("error", error);
    }
}
 const updateUi = async () => {
    const request = await fetch("getweth");
    try{
    const finaldata = await request.json();
    document.querySelector("#content").innerHTML = finaldata.date;
    document.querySelector("#city").innerHTML =  finaldata.name;
    document.querySelector("#date").innerHTML =  finaldata.date;
    document.querySelector("#temp").innerHTML =  Math.round(finaldata.main.temp);
    document.querySelector("#feeling").innerHTML =  "Feeling " + finaldata.feelings;
    document.querySelector(".title").style.cssText = "display : flex";

}
 catch(error) {
    console.log("error", error);

      }
}
