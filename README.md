# Digizuite Drive

## Requirements
* NodeJS v6 or greater

## Build
```
npm install
npm run dist
```

## Usage

All interactions to Digizuite Connector, except for authentication, must be made after being successfully logged in.

### Create a connector instance
```js
const digizuite = new Digizuite.Connector({
    apiUrl : 'https://my-installation-of-digizuite.com/dmm3bwsv3/'
});
```

### Authentication
```js
digizuite.auth.login({
    username : 'username',
    password : 'password'
}).then( (response) => {
   console.log("Logged in successfully!", response);
}).catch( (error) => {
   console.log("Error logging in!", error);
});
```

## Copyright
Digizuite (C) 2017