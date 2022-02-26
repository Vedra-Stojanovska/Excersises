//when page is loaded hide the buttons

//get the elements from the HTML
let imageVader = document.getElementById("vader");
let spaceshipTable = document.getElementById("spaceshipTable");
let spaceshipImage = document.getElementById("spaceship");
let nextButton = document.getElementById("nextBtn");
let prevButton = document.getElementById("prevBtn");
let myTable = document.getElementById("myTable");
let searchInput = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");

let changeTable = true;

// object to store our data from the api
let storageData = {
  url: "https://swapi.dev/api/people/",
  urlSpaceship: "https://swapi.dev/api/starships/",
  data: [],
  next: [],
  previous: [],
};

let storeData = (value) => {
  storageData.data = value.results;
  storageData.next = value.next;
  storageData.previous = value.previous;
  return storageData;
};

class Character {
  constructor(name, height, mass, gender, birthYear, homeworld, appearance) {
    this.name = name;
    this.height = height;
    this.mass = mass;
    this.gender = gender;
    this.birthYear = birthYear;
    this.homeworld = homeworld;
    this.appearance = appearance;
  }
  static create(response) {
    let name = response.name;
    let height = response.height;
    let mass = response.mass;
    let gender = response.gender;
    let birthYear = response.birth_year;
    let homeworld = response.homeworld;
    let appearance = response.films.length;
    return new Character(
      name,
      height,
      mass,
      gender,
      birthYear,
      homeworld,
      appearance
    );
  }
  createTable(table) {
    let row = table.insertRow(table.length);
    row.insertCell(0).innerHTML = this.name;
    row.insertCell(1).innerHTML = this.height;
    row.insertCell(2).innerHTML = this.mass;
    row.insertCell(3).innerHTML = this.gender;
    row.insertCell(4).innerHTML = this.birthYear;
    row.insertCell(5).innerHTML = this.homeworld;
    row.insertCell(6).innerHTML = this.appearance;
  }
}

class Spaceship {
  constructor(name, model, manufacturer) {
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
  }
}

class ShipDetails extends Spaceship {
  constructor(
    name,
    model,
    manufacturer,
    cost,
    cargoCapacity,
    peopleCapacity,
    spaceshipClass
  ) {
    super(name, model, name, model, manufacturer);
    this.cost = cost;
    this.cargoCapacity = cargoCapacity;
    this.peopleCapacity = peopleCapacity;
    this.spaceshipClass = spaceshipClass;
  }
  static create(response) {
    let name = response.name;
    let model = response.model;
    let manufacturer = response.manufacturer;
    let cost = response.cost_in_credits;
    let cargoCapacity = response.cargo_capacity;
    let peopleCapacity = response.passengers;
    let spaceshipClass = response.starship_class;
    return new ShipDetails(
      name,
      model,
      manufacturer,
      cost,
      cargoCapacity,
      peopleCapacity,
      spaceshipClass
    );
  }
  createTable(table) {
    let row = table.insertRow(table.length);
    row.insertCell(0).innerHTML = this.name;
    row.insertCell(1).innerHTML = this.model;
    row.insertCell(2).innerHTML = this.manufacturer;
    row.insertCell(3).innerHTML = this.cost;
    row.insertCell(4).innerHTML = this.cargoCapacity;
    row.insertCell(5).innerHTML = this.peopleCapacity;
    row.insertCell(6).innerHTML = this.spaceshipClass;
  }
}

//return data from api in objects
let returnData = async (url) => {
  return (await fetch(url)).json();
};

let getDataPeople = async (url) => {
  let valuesPeople = await returnData(url);
  storeData(valuesPeople);

  let characters = storageData.data.map((value) => Character.create(value));

  console.log(characters);
  myTable.innerHTML = "";
  characters.forEach((character) => character.createTable(myTable));
};

let getDataSpaceships = async (url) => {
  let valuesSpaceships = await returnData(url);
  storeData(valuesSpaceships);
  let spaceships = storageData.data.map((value) => ShipDetails.create(value));
  console.log(spaceships);

  spaceshipTable.innerHTML = "";
  spaceships.forEach((spaceship) => {
    spaceship.createTable(spaceshipTable);
  });
};

nextButton.addEventListener("click", async () => {
  if (changeTable == false) {
    return await getDataSpaceships(storageData.next);
  } else {
    return await getDataPeople(storageData.next);
  }
});

prevButton.addEventListener("click", async () => {
  if (changeTable == false) {
    return await getDataSpaceships(storageData.previous);
  } else {
    return await getDataPeople(storageData.previous);
  }
});

imageVader.addEventListener("click", () => {
  getDataPeople(storageData.url);
});
spaceshipImage.addEventListener("click", () => {
  myTable.innerHTML = "";
  getDataSpaceships(storageData.urlSpaceship);
  changeTable = false;
});
