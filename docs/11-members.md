# Members

## Getting information about the logged in member

```js
instance.member.getMemberLoggedIn().then( (member) => {
    console.debug(member);
} );
```

## Getting information about a member

```js
instance.member.getMemberById({
    id : 666
}).then( (member) => {
    console.debug(member);
} );
```

The parameter ```id``` is required and it is expected to be an integer.

## Check if a member has a required role

The ```Member``` model exposes a helper method for determining if the member has a given role.

```js
instance.member.getMemberById({
    id : 666
}).then( (member) => {
    console.debug(member.hasRole('Uploader') ? "Member has Uploader role" : "Member DOESNT have Uploader role");
} );
```

## Lighter imports

The lock endpoint can be imported from ```digizuite/src/endpoint/member```;