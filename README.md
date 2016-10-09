Technologies:
=============
1. Typescript2
2. Knockout.js
3. gulp
4. nodejs

How to run:
===========
1. Only dist folder is ever need to run this web application. Open index.html in any browser to start using the app.

How to start using code:
========================
1. nodejs is recommended to be installed so that it this development environment can be used without much change and to use gulp tasks configured.
2. Install all the required modules by npm install from root folder of the project.
    - type in the console from the root directory of the project
    `````````
    $ gulp
    `````````
    This will do 
    1. start watching changes for Typescript files
    2. Compile and bundle all .ts code to single js files
    - typing this 
    `````
    $ gulp minify
    `````
    uglifies and minifies code