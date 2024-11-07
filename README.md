
# ChefExpress

  

Hey guys whats up, whats up, whats up. So here is the repository for our 581 project. I've gone ahead and layed out the template for the project as well as defined the software stack we're going to be using. I think this is fairly in line with what we've already talked about but if we want to change something then that fine.

  
  

# Stack

  

For what I have setup here is what's called a MERN stack. MERN stands for:

* MongoDB

* Express.js (with Typescript)

* React.JS (with Typescript)

* Node for execution of our Javascript.

  
  

## MongoDB

  

This is honestly the part of the stack that I'm least tied to, I have more experience in other DB environments such as postgreSQL, and mySQL. If anyone wants to head up the database systems, let me know, if not I can worry about it.

  

## Express.TS

  

Express is a framework for Javascript and Typescipt that makes handling http or other external traffic a lot easier. I would look into Express's **Routers** for where it really shines. Great for building API's, serving webpages and files, and any other server side stuff that needs to be run (database calls). This framework is meant to be used as a library, meaning Node is running the exact code that youre writing, and not some compiled version of it

  

## React.JS

  

React is a front-end focused JS framework that handles client-side logic like conditional HTML, components talking to each other and other complex JS related interactions. React breaks the page into small reusable pieces called "components," each handling a specific part of the interface. When something changes, like new data coming in, React only updates the parts of the page that need to change, making websites faster and more responsive. This approach simplifies building complex apps while keeping everything organized.

**React is meant to be compiled or *built* before before you can display it in a broswer. So all of our many `.tsx` files may be condesnsed to one set of `index.html` AND `index.js`**

  

## Node.js

  

Node.js is a runtime environment that allows you to run JavaScript on the server side, not just in the browser. Normally, JavaScript is used to make websites interactive for users, but with Node.js, you can also use it to handle tasks like managing databases, processing requests, or serving web pages

  
  

# Project Layout

  

The projects root directory is seperated into 2 main folders: `frontend` & `server`.

*  `frontend` holds the node 'package' responsible for making the user facing website.

*  `server` holds the node package responsible for the running of server side code. It listens on port 3000 by default

  

## Front-end

  

*  `public` - This is where statically displayed objects such as images are stored for displaying?? not actuall sure

*  `src` - General folder for source code files

*  `src/assets` - Probably where you should actually put statically displayed assets such as photos

*  `src/components/` - where specific and single use component objects should go.

> Think 'LoginModel' or 'RecipeDisplay', 'Header', 'Footer', etc

*  `src/subcomponents/` - where general and __reusuable__ components of a webpage should go

> Think buttons, input fields, etc...

src/pages

*  `src/pages/` - where top level page objects should go, these are big picture *containers* for other components and subcomponents

*  `App.tsx` Think of this file as `Executive.Cpp`, should only handle displaying of other pages

*  `main.tsx` Think of this file as `main.cpp`

  

## Server (Back-end)

*  `build` - This is where the Typescript Compiler will/should output its compiled TS into JS, this may not be needed based on deployment specs, but its there for now

*  `src` - For now this only has index.ts in it. Depending on how the server side get organized the directory may change

*  `static` - Plan is to have built react code export to here, that away the server can serve it as a static content. Allows the frontend to talk to back end a bit easier.

  

## Top Level

*  `install.sh` run this to install/update all node dependencies

> NOTE: tis requires node and NPM to be installed
> You can check with `node -v` and `npm -v` respectively

  
  

# Running front or backend

  

You can run the server at any time by running the command

`npm run dev`

while being in the server directory.

This will start the server listening on port 3000

  

Similarly you can run the front end at anytime by running

`npm run dev`

This will start the front end listening at http://localhost:5173/

  

HHS is enabled by default, meaning that the server will look for changes to anyfiles, and restart the server to show the latest saved changes.