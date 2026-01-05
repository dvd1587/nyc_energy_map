# NYC Buildings Energy & Water Use Map - LL84

### [Interactive Map Link](https://dvd1587.github.io/nyc_energy_map)

<h2>Description</h2>
This interactive map visualizes energy and water consumption data for nearly 35,000 buildings across all five NYC boroughs. The data comes from the NYC Open Data portal under Local Law 84 disclosure requirements. You can explore how buildings perform on: Energy Use Intensity (EUI), Water Use Intensity (WUI), Greenhouse Gas Emissions (GHG), and ENERGY STAR® Ratings.
<br/>
<br/>
<p align="center">
<a href="https://drive.google.com/uc?export=view&id=1ZEeJlhqc_DZJ9ZC2FM7kSgpxyNdOZFeC"><img src="https://drive.google.com/uc?export=view&id=1ZEeJlhqc_DZJ9ZC2FM7kSgpxyNdOZFeC" alt="Screenshot" /></a> 
<br />

<h2>Languages and Utilities Used</h2>

- <b>HTML, CSS, Javascript, Leaflet.js, MarkerCluster plugin, NYC Open Data SODA 3.0 API</b> 

<h2>Folder walk-through:</h2>

```
nyc-energy-map-modular/
├── index.html              ← Main HTML file
├── css/
│   └── styles.css          ← All CSS styles
└── js/
    ├── config.js           ← API settings, metrics constants
    ├── state.js            ← Global state variables
    ├── utils.js            ← Helper functions (parseNum, formatNum, etc.)
    ├── api.js              ← Data fetching from NYC Open Data
    ├── sliders.js          ← Dual range slider setup
    ├── filters.js          ← Filter logic and application
    ├── ui.js               ← Stats, dropdowns, property types
    ├── map.js              ← Leaflet map initialization
    └── app.js              ← Main entry point
```

<h2>Code walk-through:</h2>

<p align="center">
CSS Styles: <br/>
<a href="https://drive.google.com/uc?export=view&id=1GGccbrYL8C-aT934zWc7Sx3P5AqIWeh9"><img src="https://drive.google.com/uc?export=view&id=1GGccbrYL8C-aT934zWc7Sx3P5AqIWeh9" alt="CSS Styles" /></a> 
<br />
<br />
Config.js: <br/>  
<a href="https://drive.google.com/uc?export=view&id=1K54xwGIiGIlggIPoFiMImYOwX8O46Ct3"><img src="https://drive.google.com/uc?export=view&id=1K54xwGIiGIlggIPoFiMImYOwX8O46Ct3" alt="Config.js" /></a> 
<br />
<br />
Global State: <br/>
<a href="https://drive.google.com/uc?export=view&id=1HWT5-5MyySANZ1f0UCaNqzJ5jsHFFkEk"><img src="https://drive.google.com/uc?export=view&id=1HWT5-5MyySANZ1f0UCaNqzJ5jsHFFkEk" alt="State.js" /></a> 
<br />
<br />
Utils.js: <br/>
<a href="https://drive.google.com/uc?export=view&id=1bKXRLgCXNxjlZ2OKkOh_0S3z9x5U6g0s"><img src="https://drive.google.com/uc?export=view&id=1bKXRLgCXNxjlZ2OKkOh_0S3z9x5U6g0s" alt="Utils.js" /></a>
<br />
<br />  
Api.js: <br/>
<a href="https://drive.google.com/uc?export=view&id=1ffGvvtr51KbzBDT4D-TFgfovjnP7a8sG"><img src="https://drive.google.com/uc?export=view&id=1ffGvvtr51KbzBDT4D-TFgfovjnP7a8sG" alt="Api.js" /></a> 
<br />
<br />
Sliders Logic: <br/>
<a href="https://drive.google.com/uc?export=view&id=1HHe4XbyvPzesFnkEvax21xZWQOdaq87N"><img src="https://drive.google.com/uc?export=view&id=1HHe4XbyvPzesFnkEvax21xZWQOdaq87N" alt="Sliders.js" /></a>
<br />
<br />
Filters Logic: <br/>
<a href="https://drive.google.com/uc?export=view&id=1s_6iVY-Ckuwze8NRA9GJoPNBF4MtN14d"><img src="https://drive.google.com/uc?export=view&id=1s_6iVY-Ckuwze8NRA9GJoPNBF4MtN14d" alt="Filters.js" /></a>
<br />
<br /> 
UX/UI: <br/>
<a href="https://drive.google.com/uc?export=view&id=11UVpe6xoiITbA14gw4bAImf6bXB2Afob"><img src="https://drive.google.com/uc?export=view&id=11UVpe6xoiITbA14gw4bAImf6bXB2Afob" alt="UI.js" /></a>
<br />
<br />
Leaflet Map: <br/>
<a href="https://drive.google.com/uc?export=view&id=1bEpXSqyxSt-WChCXQhefjrLFpvSUwyRw"><img src="https://drive.google.com/uc?export=view&id=1bEpXSqyxSt-WChCXQhefjrLFpvSUwyRw" alt="Map.js" /></a>
<br />
<br />  
App.js: <br/>
<a href="https://drive.google.com/uc?export=view&id=1Uc-ORoIB7-IbyM7BfAxt5J7nQjn47yjh"><img src="https://drive.google.com/uc?export=view&id=1Uc-ORoIB7-IbyM7BfAxt5J7nQjn47yjh" alt="App.js" /></a>
<br />
<br />  
Index.html: <br/>
<a href="https://drive.google.com/uc?export=view&id=1jCBV8M_WDF7Duu5Zom66HFtBJMKMQY_L"><img src="https://drive.google.com/uc?export=view&id=1jCBV8M_WDF7Duu5Zom66HFtBJMKMQY_L" alt="Index.html" /></a>
</p>
