import  React from 'react';


class Search extends React.Component {
    constructor(props) {
        super(props)
        
        this.input = {
            margin: "0",
            position: "absolute",
            top: "50%"
        }
        this.state = {
            EXO: ""
        }

        //Functies binde
        this.enteredinput = this.enteredinput.bind(this);
        this.search_information = this.search_information.bind(this);
        this.get_planet_info = this.get_planet_info.bind(this);
        this.expPlanet = this.expPlanet.bind(this);
        this.pageload = this.pageload.bind(this);
    }

    pageload() {
        this.search_information("Earth")
    }

    componentDidMount() {
        window.addEventListener('load',this.pageload)
    }

    expPlanet_foto(EXO) {
        console.log(EXO)
        fetch("https://images-api.nasa.gov/search? " + EXO)
        .then((res) => res.json())
        .then((data) => {
            this.get_planet_picture(EXO)
        })
    }


    get_planet_picture(PlanetName) {
        //Fetched na NASA API voor de fotos
        fetch("https://images-api.nasa.gov/search?q=" + PlanetName)
            .then(res => res.json())
            .then((data) => {
                    for (let i = 0; i < 4; i++) {
                        //Pakt 4 fotos van NASA API en plakt bij de placeholder
                        document.getElementById("foto" + i).src = data["collection"]["items"][i]["links"][0]["href"];
                    }
            }).catch((error) =>  {
                console.error("Er is geen foto voor die planeeet we hebben helemaal geen info ervan");
       
            });
    }


    get_planet_info(PlanetName) {
        document.getElementById("planeet_naam").innerText = PlanetName;
        console.log("Gathering planet")
        fetch("https://api.le-systeme-solaire.net/rest/bodies/" + PlanetName)
            .then((res) => res.json())
            .then((data) => {
               //Laat data verschijnen op pagina van de desbetreffende planeet
               document.getElementById("gravity").innerText = "acceleration: " + data.gravity + " m/s2";
               document.getElementById("density").innerText = "Density: " + data.density + "g/cm3";
               document.getElementById("mass").innerText = "Mass: " + data.mass.massValue + "*10^ " + data.mass.massExponent +" kg"
               document.getElementById("volume").innerText = "Volume: " + data.vol.volValue + "*10^ " + data.vol.volExponent + " km3";
               document.getElementById("sun_d").innerText = "distance between the sun: " + data.semimajorAxis + " km";
               document.getElementById("diameter").innerText = "Diameter: " + Math.floor(data.meanRadius) + " km";
               console.log(data)
            })
    }


    expPlanet(EXO) {
        document.getElementById("planeet_naam").innerText = EXO + " (EXO)";
        //Kijkt als het een exoplaneet is
        fetch("https://raw.githubusercontent.com/paulfitz/exoplanets/master/data/exoplanet.json")
        .then((res) => res.json())
        .then((data) => {               
            let Planet_info = {Star_name2: [],id: []}
            console.log("Zoeken en kijken als de planeet die je zoekt in de json list :)")
            for (let i = 0; i < data.length; i++) {
                Planet_info.Star_name2.push(data[i].star_name);
                Planet_info.id.push(i); 
            }                           
            //Checkt als de desbetreffende Exo planeet(Star) als die in de Star
            console.log(Planet_info)    
            if (Planet_info.Star_name2.includes(EXO)) {
                document.getElementById("info_box").style.color = "white";
                document.getElementById("error").style.color = "black";
                console.log("Er is informatie van beschikbaar")
                let index_of_planet = Planet_info.Star_name2.indexOf(EXO);
                document.getElementById("gravity").innerText = "Name: " + data[index_of_planet]["# name"];
                document.getElementById("sun_d").innerText = "Semi mayor axis: " + data[index_of_planet].semi_major_axis + " A.U";
                document.getElementById("diameter").innerText = "Oribital period: " + Math.floor(data[index_of_planet].orbital_period)  + " days";
                document.getElementById("volume").innerText = "Angular distance: " + data[index_of_planet].angular_distance + "°";
                // eslint-disable-next-line no-useless-concat
                document.getElementById("mass").innerText =  "Mass: " + data[index_of_planet].mass * 100 + "*" +  " Earth mass ";
                document.getElementById("density").innerText = "Discoverd in: " + data[index_of_planet].discovered;
                this.expPlanet_foto(EXO);
            } else {
                console.log("Er is geen informatie van beschikbaar kijk als er fotos van zijn")
                document.getElementById("info_box").style.color = "black";
                document.getElementById("error").innerText = "There is not information found about the planet " + EXO + "but we have pictures ";
                document.getElementById("error").style.color = "white";
                this.expPlanet_foto(EXO);
            }
           
        })

    }

    search_information(PlanetName) {
        //Zoekt informatie over de defbetreffende planeet kijkt als het in onze zonnenstelsel
        fetch("https://api.le-systeme-solaire.net/rest/bodies/" +  PlanetName)//document.getElementById("planeet_input").value)
            .then((res) => res.json())
            .then((data) => {
                if (data.isPlanet) {
                    console.log("Het is een planeet in onze zonnenstelsel");
                    document.getElementById("bestaat").innerText = "Planet exist"
                    document.getElementById("info_box").style.color = "white";
                    document.getElementById("error").style.color = "black";
                    this.setState({
                        EXO: data.englishName
                      });
                    this.get_planet_picture(data.englishName)
                    this.get_planet_info(data.englishName)
                    }
                }
            ).catch(error => { 
                document.getElementById("planeet_naam").innerText = this.state.EXO
                this.expPlanet(document.getElementById("planeet_input").value);
            })
        }

    enteredinput(e) {
        if(e.key === 'Enter') {
            //Als enter word geklikt dan zoekt informatie over planeet
            this.search_information(document.getElementById("planeet_input").value)
        }
    }

    render() {
        return(
            <div className="w-100 text-center"  style={this.input}>
                <input className="rounded-pill text-center " type="input" id="planeet_input" placeholder="Explore space" onKeyDown={this.enteredinput}/>
                         <p onLoad={this.exoplanet_info} id="log" className="text-primary"></p>
                         <p className="text-primary" id="bestaat"></p>
                    </div>
        )
    }
}


export default Search
