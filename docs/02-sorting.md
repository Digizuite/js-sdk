# Sorting

## Sort the results 

Sort the results:
```js
instance.content.getAssets({
    sorting : {
        by       : Digizuite.Constants.SORT_BY.DATE,
        direction: Digizuite.Constants.SORT_DIRECTION.ASCENDING
    }
}).then(({assets})=>{
    console.log("Got assets sorted!", assets);
});
```

If ```direction``` parameter is not provided, the default direction for the selected sort criteria will be used.

If there are no sorting instructions provided, the system default will be used. 


### Advanced Sorting
Some systems offer additional sorting criteria. You can obtain them as follows:
```js
const sortCriteriaAvailable = instance.content.getSortBy();
```

Sort the results:
```js
instance.content.getAssets({
    sorting : {
        by       : sortCriteriaAvailable[0].by,
        direction: Digizuite.Constants.SORT_DIRECTION.ASCENDING
    }
}).then(({assets})=>{
    console.log("Got assets sorted!", assets);
});
```

If ```direction``` parameter is not provided, the default direction for the selected sort criteria will be used.

If there are no sorting instructions provided, the system default will be used. 
