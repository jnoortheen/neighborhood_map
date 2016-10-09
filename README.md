Tech:
=============
1. Knockout.js
2. gulp
3. nodejs

How to run:
===========
1. Only dist folder is ever need to run this web application. Open dist/index.html in any browser to start using the app.

How to start using code:
========================
1. nodejs is recommended to be installed so that this development environment can be used without much change with gulp tasks as configured.
2. Install all the required modules by 
    ``````````
    npm install 
    ```````````
    from root folder of the project.

3. Gulp Taks:
    *   gulp - run default task bundle all js/css/html/fonts and copy to dist folder
    `````````
    $ gulp
    `````````
    *   gulp prod - uglify and minidy all code in addition to the above mentioned task
    `````
    $ gulp prod
    `````
    *   gulp watchify - watch for any changes to css/js/html files 
    `````
    $ gulp watch
    `````
    