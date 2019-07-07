# mongo-db-queries-node-js
Controller for mongodb with all necessary queries, easy to understand
for nodeJS
Made by Wilk Paweł
License: OpenSource

Documentation:

    Start with it:
    So, provide all required informations in mongo.settings and that's it.
    Provide one of the methods in routes.
    * - means it's not necessary

    So, let's start from beginning

    mongo.connect() / mongo.disconnect() - connect to db, it's already provided in next methods, so it's only for new methods
 
    = = = =

    mongo.allRecords(table, callback*) - shows every record in table
    [table = name of table], [callback* = response, all Records]
        example: 
            mongo.allRecords('players') 
        OR 
            mongo.allRecords('players', function(callback){
            callback(result)
        })

    = = = =    

    mongo.addRecord(table, {record}) - add single record to the table
    [table = name of table], [record = new record in]
        example:
            mongo.addRecord('players', {'user_nickname' : 'newUser' })
    = = = =

    mongo.searchRecords(table, {query}) - find all records in table with parameter
    [table = name of table], [query = which parameter must exist]
        example:
            mongo.searchRecords('players', { 'gender' : 'male' }, function(result){
                callback(result)
            })
        
    = = = =

    mongo.updateRecord(table, uniqueQuery, newValue) - change single value on unique record, if there is no record like this, then it will add it
    [table = name of table], [uniqueQuery = unique record], [newValue = new value]
        example:
            mongo.updateRecord('players', {'user_nickname':'Greensmurfz'}, {'joined': '2019-06-31'})
                                //table    //whichUser                     //changethevalue

    = = = = 

      mongo.updateRecords([table], [recordsToBeFound], [yourQuery]) -- find users which records matched and change it to your query
      [table = name of table], [recordsToBeFound = passed Query], [yourQuery = change it to that value] 
        example:
            mongo.updateRecords('players', { 'joined': { $lt: '2019-09-07' } }, { $set: { 'joined': '2019-09-10'} }) - change all values 
                                //table    //uniqueQuery, lower than this date    //newValue with $set operator, you can use other too

    = = = = 
    
    mongo.removeRecord([table], [query])
            example:
            mongo.updateRecords('players', { 'nickname': 'foobar'} }) 
