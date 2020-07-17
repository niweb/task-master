# Task Master

This is a project enabling you and your team members to manage and plan your tasks together.

## Installation
### Prerequisites
Make sure you have npm and php installed. You will need npm to bundle the sources for the client app and php to serve the spa and to provide an API. 

### Steps
1. Clone or download this repository onto a php server 
1. In the root directory run the following command: `(cd client && npm i && npm run build)`
1. Visit the website through a browser where you have deployed it

## Development
For developing it is advised to install a local php server (xampp, easyphp, or similar).

1. Clone this repository to your local machine in a location, so it can be served by the php server
1. Start the php server
1. In the root directory run the following command: `(cd client && npm i && npm run watch)`
1. Visit the website through a browser where you serve it (typically [http://localhost/task-master](http://localhost/task-master))

## Project Structure
The app consist of an API and the client sources.
The API is a REST API written in PHP and needs to be served from a server. It is located under the `/api` directory.
In the `/client` directory a JavaScript SPA is located, which uses vue.js as a framework.     