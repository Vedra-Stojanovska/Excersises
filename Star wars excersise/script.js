window.onload = () => {
  prevButton.style.visibility = "hidden";
  nextButton.style.visibility = "hidden";
};
let imageVader = document.getElementById("vader");
imageVader.addEventListener("click", () => {
  nextButton.style.visibility = "visible";
});

let spaceshipTable = document.getElementById("spaceshipTable");
let spaceshipImage = document.getElementById("spaceship");
let nextButton = document.getElementById("nextBtn");
let prevButton = document.getElementById("prevBtn");
let myTable = document.getElementById("myTable");

spaceshipImage.addEventListener("click", () => {
  nextButton.style.visibility = "visible";
});
let storageData = {
  url: "https://swapi.dev/api/people/",
  urlSpaceship: "https://swapi.dev/api/starships/",
  characters: [],
  next: [],
  previous: [],
};

let returnData = (url) => {
  return fetch(url)
    .then((value) => value.json())
    .then((value) => value);
};

let storeDataCharacters = (value) => {
  storageData.characters = value.results;
  storageData.next = value.next;
  storageData.previous = value.previous;
  console.log(storageData);
};

let showData = (data) => {
  let allowed = [
    data[0].name,
    data[0].height,
    data[0].mass,
    data[0].birth_year,
    data[0].gender,
    data[0].films,
  ];
  console.log(data[0]);
  let titles = Object.keys(data[0]).filter((key) => {
    for (let i = 0; i < allowed.length; i++) {
      if (data[0][key] === allowed[i]) {
        return key;
      }
    }
  });
  console.log(titles);

  let tHead = document.createElement("thead");
  let tBody = document.createElement("tbody");
  let newRow = document.createElement("tr");
  for (let title of titles) {
    let th = document.createElement("th");
    th.innerHTML = title;
    newRow.appendChild(th);
  }

  for (let value of data) {
    myTable.innerHTML = "";
    let secondRow = myTable.insertRow(myTable.length);
    secondRow.insertCell(0).innerHTML = value.name;
    secondRow.insertCell(1).innerHTML = value.height;
    secondRow.insertCell(2).innerHTML = value.mass;
    secondRow.insertCell(3).innerHTML = value.birth_year;
    secondRow.insertCell(4).innerHTML = value.gender;
    secondRow.insertCell(5).innerHTML = value.films.length;
    tBody.appendChild(secondRow);
  }

  tHead.appendChild(newRow);
  myTable.appendChild(tHead);
  myTable.appendChild(tBody);
  showDataSpaceships(data);
};

let showDataSpaceships = (data) => {
  let allowedData = [
    data[0].name,
    data[0].model,
    data[0].manufacturer,
    data[0].cost_in_credits,
    data[0].passengers,
    data[0].starship_class,
  ];
  let spaceshipTitles = Object.keys(data[0]).filter((key) => {
    for (let i = 0; i < allowedData.length; i++) {
      if (data[0][key] === allowedData[i] && data[0][key] !== data[0].MGLT) {
        return key;
      }
    }
  });
  console.log(spaceshipTitles);
  let tHeadSpaceship = document.createElement("thead");
  let tBodySpaceship = document.createElement("tbody");
  let newRowSpaceship = document.createElement("tr");
  for (let spaceTitle of spaceshipTitles) {
    let thSpaceship = document.createElement("th");
    thSpaceship.innerHTML = spaceTitle;
    newRowSpaceship.appendChild(thSpaceship);
  }
  for (let value of data) {
    spaceshipTable.innerHTML = "";
    let secondRowSpaceship = spaceshipTable.insertRow(spaceshipTable.length);
    secondRowSpaceship.insertCell(0).innerHTML = value.name;
    secondRowSpaceship.insertCell(1).innerHTML = value.model;
    secondRowSpaceship.insertCell(2).innerHTML = value.manufacturer;
    secondRowSpaceship.insertCell(3).innerHTML = value.cost_in_credits;
    secondRowSpaceship.insertCell(4).innerHTML = value.passengers;
    secondRowSpaceship.insertCell(5).innerHTML = value.starship_class;
    tBodySpaceship.appendChild(secondRowSpaceship);
  }

  tHeadSpaceship.appendChild(newRowSpaceship);
  spaceshipTable.appendChild(tHeadSpaceship);
  spaceshipTable.appendChild(tBodySpaceship);
};

(getData = () => {
  imageVader.addEventListener("click", () => {
    returnData(storageData.url)
      .then((value) => storeDataCharacters(value))
      .then((value) => showData(storageData.characters))
      .then((spaceshipTable.style.visibility = "hidden"))
      .then((myTable.style.visibility = "visible"));
  });
  spaceshipImage.addEventListener("click", () => {
    returnData(storageData.urlSpaceship)
      .then((value) => storeDataCharacters(value))
      .then((value) => showData(storageData.characters))
      .then((myTable.style.visibility = "hidden"))
      .then((spaceshipTable.style.visibility = "visible"));
  });
  nextButton.addEventListener("click", () => {
    returnData(storageData.next)
      .then((value) => storeDataCharacters(value))
      .then((value) => showData(storageData.characters))
      .then((prevButton.style.visibility = "visible"));
  });
  prevButton.addEventListener("click", () => {
    returnData(storageData.previous)
      .then((value) => storeDataCharacters(value))
      .then((value) => showData(storageData.characters));
  });
})();
