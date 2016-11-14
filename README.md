#Neighborhood Map:
A responsive map application using Google Maps JS API.

##Use:
-   search any location using google autocomplete service.
-   click on map to create marker.
-   Wikipedia's open search API is used to get info about the place. This can be viewed by clicking on the marker.
-   Markers are stored locally and retrieved.
-   Filter the marker list using the same input field
-   Zoom to the markers location when clicked

##Tech stack:
1. Knockout.js
1. gulp
1. nodejs

##How to run:
1. Only dist folder is ever need to run this web application. Open dist/index.html in any browser to start using the app.

##How to start using code:
1. nodejs is recommended to be installed so that this development environment can be used without much change with gulp tasks as configured.
2. Install all the required modules by (from root folder of the project)
    `npm install`
3. Gulp Taks:
* gulp 
    - run default task bundle all js/css/html/fonts and copy to dist folder 
        `$ gulp`
* gulp prod 
    - uglify and minidy all code in addition to the above mentioned task 
        `$ gulp prod`
* gulp watchify 
    - watch for any changes to css/js/html files 
        `$ gulp watch`
