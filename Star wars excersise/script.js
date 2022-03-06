//get the elements from the HTML
let imageVader = document.getElementById("vader");
let spaceshipTable = document.getElementById("spaceshipTable");
let spaceshipImage = document.getElementById("spaceship");
let nextButton = document.getElementById("nextBtn");
let prevButton = document.getElementById("prevBtn");
let myTable = document.getElementById("myTable");
let searchInput = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");
let list = document.getElementById("list");
let peopleHomeworld = document.querySelector("#peopleHomeworld");
let changeTable = true;
// object to store our data from the api
let storageData = {
  url: "https://swapi.dev/api/people/",
  urlSpaceship: "https://swapi.dev/api/starships/",
  data: [],
  next: [],
  previous: [],
};
//refresh the data
let storeData = (value) => {
  storageData.data = value.results;
  storageData.next = value.next;
  storageData.previous = value.previous;
  return storageData;
};
//class for the characters
class Character {
  constructor({ name, height, mass, gender, birth_year, homeworld, films }) {
    this.name = name;
    this.setHeight(height);
    this.setMass(mass);
    this.gender = gender;
    this.birthYear = birth_year;
    this.homeworld = homeworld;
    this.appearance = `${films.length} movies`;
  }
  static create(response) {
    return new Character(response);
  }
  getHeight() {
    return this.height;
  }
  setHeight(height) {
    return (this.height = Table.height(height));
  }
  getMass() {
    return this.mass;
  }
  setMass(mass) {
    return (this.mass = Table.kg(mass));
  }
  createTable(table) {
    let row = table.insertRow(table.length);
    Object.values(this).forEach(
      (value, i) => (row.insertCell(i).innerHTML = value)
    );
    row.addEventListener("click", (e) => {
      Character.homeworldFetch(this);
    });
  }
  //static function to get the data for the planets and display them in a list
  static async homeworldFetch(value) {
    if (value instanceof Character) {
      let data = await returnData(value.homeworld);
      let planet = Planet.create(data);
      list.innerHTML = "";
      list.innerHTML += `
      <p>Homeworld of ${value.name}</p>
      <li>Name: ${planet.name}</li>
        <li>Rotation Period: ${planet.rotationPeriod}</li>
        <li>Diameter: ${planet.diameter}</li>
        <li>Climate: ${planet.climate}</li>
        <li>Rotation Period: ${planet.rotationPeriod}</li>
        <li>Gravity: ${planet.gravity}</li>
        <li>Terrain: ${planet.terrain}</li>
        <li>Surface Water: ${planet.surfaceWater}</li>
        <li>Population: ${planet.population}</li>`;
    } else {
      throw new Error();
    }
  }
}
//class for the planets
class Planet {
  constructor({
    name,
    rotation_period,
    orbital_period,
    diameter,
    climate,
    gravity,
    terrain,
    surface_water,
    population,
  }) {
    (this.name = name),
      (this.rotationPeriod = Table.hour(rotation_period)),
      (this.orbitalPeriod = Table.d(orbital_period)),
      (this.diameter = Table.km(diameter)),
      (this.climate = climate),
      (this.gravity = gravity),
      (this.terrain = terrain),
      (this.surfaceWater = Table.percent(surface_water)),
      (this.population = Table.format(population));
  }
  static create(response) {
    return new Planet(response);
  }
}
//class fot the spaceships
class Spaceship {
  constructor({ name, model, manufacturer }) {
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
  }
}
//class for the spaceship details
class ShipDetails extends Spaceship {
  constructor({
    name,
    model,
    manufacturer,
    cost_in_credits,
    cargo_capacity,
    passengers,
    starship_class,
  }) {
    super({ name, model, manufacturer });
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
    this.setCost(cost_in_credits);
    this.setCargo(cargo_capacity);
    this.peopleCapacity = passengers;
    this.spaceshipClass = starship_class;
  }
  static create(response) {
    return new ShipDetails(response);
  }
  getCost() {
    return this.cost_in_credits;
  }
  setCost(cost) {
    return (this.cost_in_credits = Table.format(cost));
  }
  getCargo() {
    return this.cargo_capacity;
  }
  setCargo(cargo) {
    return (this.cargo_capacity = Table.format(cargo));
  }
  createTable(table) {
    let row = table.insertRow(table.length);
    Object.values(this).forEach((value, i) => {
      row.insertCell(i).innerHTML = value;
    });
  }
}
//table class for refactoring the data
class Table {
  static format(response) {
    return Math.round(parseInt(response * 100) / 100)
      .toLocaleString("en")
      .replace(/,/g, ".")
      .replace(/NaN/g, "Not known");
  }
  static percent(response) {
    return `${response} %`;
  }
  static km(response) {
    return `${response} km`;
  }
  static d(response) {
    return `${response} d`;
  }
  static hour(response) {
    return `${response} h`;
  }
  static kg(response) {
    return `${response} kg`;
  }
  static height(response) {
    return `${response} cm`;
  }
  static replaceCamelCase(response) {
    return response.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  }
}

//return data from api in objects
let returnData = async (url) => {
  return (await fetch(url)).json();
};
//function to display the characters
let getDataPeople = async (url) => {
  let valuesPeople = await returnData(url);
  storeData(valuesPeople);
  let characters = storageData.data.map((value) => Character.create(value));
  myTable.innerHTML = "";
  //add titles
  let titles = Object.keys(characters[0]);
  titles.forEach((title) => {
    let th = document.createElement("th");
    th.innerHTML = Table.replaceCamelCase(title);
    myTable.appendChild(th);
  });
  //create the table
  characters.forEach((character) => character.createTable(myTable));
};
//function to display the spaceships
let getDataSpaceships = async (url) => {
  let valuesSpaceships = await returnData(url);
  storeData(valuesSpaceships);
  let spaceships = storageData.data.map((value) => ShipDetails.create(value));
  spaceshipTable.innerHTML = "";
  //add titles
  let titles = Object.keys(spaceships[0]);
  titles.forEach((title) => {
    let th = document.createElement("th");
    th.innerHTML = Table.replaceCamelCase(title);
    spaceshipTable.appendChild(th);
  });
  //create table
  spaceships.forEach((spaceship) => {
    spaceship.createTable(spaceshipTable);
  });
};
//next btn
nextButton.addEventListener("click", async () => {
  list.innerHTML = "";
  if (changeTable == false) {
    return await getDataSpaceships(storageData.next);
  } else {
    return await getDataPeople(storageData.next);
  }
});
//prev btn
prevButton.addEventListener("click", async () => {
  list.innerHTML = "";
  if (changeTable == false) {
    return await getDataSpaceships(storageData.previous);
  } else {
    return await getDataPeople(storageData.previous);
  }
});

imageVader.addEventListener("click", () => {
  spaceshipTable.innerHTML = "";
  list.innerHTML = "";
  getDataPeople(storageData.url);
  changeTable = true;
});
spaceshipImage.addEventListener("click", () => {
  myTable.innerHTML = "";
  list.innerHTML = "";
  getDataSpaceships(storageData.urlSpaceship);
  changeTable = false;
});
