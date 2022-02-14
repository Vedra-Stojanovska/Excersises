//when page is loaded hide the buttons
window.onload = () => {
  prevButton.style.visibility = "hidden";
  nextButton.style.visibility = "hidden";
};

//get the elements from the HTML
let imageVader = document.getElementById("vader");
let spaceshipTable = document.getElementById("spaceshipTable");
let spaceshipImage = document.getElementById("spaceship");
let nextButton = document.getElementById("nextBtn");
let prevButton = document.getElementById("prevBtn");
let myTable = document.getElementById("myTable");
let sortMovies = document.getElementById("height");

//object to store our data from the api
let storageData = {
  url: "https://swapi.dev/api/people/",
  urlSpaceship: "https://swapi.dev/api/starships/",
  data: [],
  next: [],
  previous: [],
};

//return data from api in objects
let returnData = (url) => {
  return fetch(url)
    .then((value) => value.json())
    .then((value) => value);
};

//store the data in our storeData object
let storeData = (value) => {
  storageData.data = value.results;
  storageData.next = value.next;
  storageData.previous = value.previous;
  console.log(storageData);
};

//function to filter out the titles needed
let filterOut = (allowed, data, table) => {
  let titles = Object.keys(data[0]).filter((key) => {
    //iterate through the array with allowed data
    for (let i = 0; i < allowed.length; i++) {
      //if the data from the api with its key is equal to the elements of the array return it
      //the next condition is used because the spaceship table is adding more keys
      if (data[0][key] === allowed[i] && data[0][key] !== data[0].MGLT) {
        return key;
      }
    }
  });
  console.log(titles);
  titles.forEach((title) => {
    let th = document.createElement("th");
    th.innerHTML = title;
    table.appendChild(th);
  });
};

//function with an array to use when we filter out the titles
let titleSpaceship = (data) => {
  let allowedData = [
    data[0].name,
    data[0].model,
    data[0].manufacturer,
    data[0].cost_in_credits,
    data[0].passengers,
    data[0].starship_class,
  ];
  //calling the filter out function
  filterOut(allowedData, data, spaceshipTable);
};

//function with an array to use when we filter out the titles
let titleCharacters = (data) => {
  let allowedData = [
    data[0].name,
    data[0].height,
    data[0].mass,
    data[0].birth_year,
    data[0].gender,
    data[0].films,
  ];
  //calling the filter out function
  filterOut(allowedData, data, myTable);
};

//create a table for the characters
let showValue = (value) => {
  //calling the function with the array to show our titles in the table as headers
  titleCharacters(storageData.data);
  //for each element from the value display it in a table
  value.forEach((element) => {
    let row = myTable.insertRow(myTable.length);
    row.insertCell(0).innerHTML = element.name;
    row.insertCell(1).innerHTML = element.height;
    row.insertCell(2).innerHTML = element.mass;
    row.insertCell(3).innerHTML = element.birth_year;
    row.insertCell(4).innerHTML = element.gender;
    row.insertCell(5).innerHTML = element.films.length;
  });
  //calling the function to also create the spaceships table so that the next/previuous button can sync with one function
  showValueShips(storageData.data);
};

//function to create the spaceships table
let showValueShips = (value) => {
  //calling the function with the array to show our titles in the table as headers
  titleSpaceship(storageData.data);
  //for each element from the value display it in a table
  value.forEach((element) => {
    let row = spaceshipTable.insertRow(spaceshipTable.length);
    row.insertCell(0).innerHTML = element.name;
    row.insertCell(1).innerHTML = element.model;
    row.insertCell(2).innerHTML = element.manufacturer;
    row.insertCell(3).innerHTML = element.cost_in_credits;
    row.insertCell(4).innerHTML = element.passengers;
    row.insertCell(5).innerHTML = element.starship_class;
  });
};

//control the visibility of the buttons and tables
let controlVisibility = (next, tableOne, tableTwo) => {
  next.style.visibility = "visible";
  tableOne.style.visibility = "visible";
  tableTwo.style.visibility = "hidden";
  tableOne.innerHTML = "";
  tableTwo.innerHTML = "";
};

//immediately invoked function to instantly fetch the data from the url when the buttons are clicked
(getData = () => {
  imageVader.addEventListener("click", () => {
    controlVisibility(nextButton, myTable, spaceshipTable);
    returnData(storageData.url)
      .then((value) => storeData(value))
      .then((value) => showValue(storageData.data));
  });
  spaceshipImage.addEventListener("click", () => {
    controlVisibility(nextButton, spaceshipTable, myTable);
    returnData(storageData.urlSpaceship)
      .then((value) => storeData(value))
      .then((value) => showValueShips(storageData.data));
  });
  nextButton.addEventListener("click", () => {
    myTable.innerHTML = "";
    spaceshipTable.innerHTML = "";
    returnData(storageData.next)
      .then((value) => storeData(value))
      .then((value) => showValue(storageData.data))
      .then((prevButton.style.visibility = "visible"));
  });
  prevButton.addEventListener("click", () => {
    myTable.innerHTML = "";
    spaceshipTable.innerHTML = "";
    returnData(storageData.previous)
      .then((value) => storeData(value))
      .then((value) => showValue(storageData.data));
  });
})();
