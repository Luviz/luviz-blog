# Azure Functions for the Faint of Heart

![MSAzure-functions](/images/MSAzure-functions.png)

Azure Functions is a service provided by Microsoft that allows you to create back-end code without having to deal with server management, configuration and routing. It's all packed into a simple package that takes 10 min to setup.

## Serverless Framework

![serverless_Loho](/images/serverless_Loho.png)

Azure functions are built on the [ServerLess](https://serverless.com) framework.
The Serverless framework simplifies most of the work that goes into a back-end application. It removes the administrative layer meaning you dont have to fiddle around with server statuses and the deallocation of memory. It enables auto-scaling which means you do not need to worry about disc-space and RAM. It activates the servers as they are needed meaning you can lower your running costs down to 0 when your application is not running. And as I mentioned above it allows you to quickly test your ideas/ solutions.

### Other Cloud Distributors

As you can imagine this is primarily a cloud service, the Cloud simply allows you to have near "infinite" scalability, in the case of azure you can use the [consumption plan](https://azure.microsoft.com/en-us/pricing/details/functions/).
The consumption plan gives you a million requests per month for free and allows you 10 min max run time per call. So as long as you don't work with big-data you should be fine.

But enough of Microsoft, there are distributors that give you similar functionality other than Microsoft.

> 1. Amazon Web Services Lambdas
> 2. Microsoft Azure Functions
> 3. Google Cloud Platform
> 4. IBM OpenWhisk
> 5. Kubeless
> 
> and many more [Read more here](https://serverless.com/framework/docs/) 

I'm personally most familiar with Azure Functions, so I'll be sticking to what I know best.

### Serverless On Premises

Microsoft have recently announced azure functions runtime for premises.

Read more about in [Azure Functions runtime](https://docs.microsoft.com/en-us/azure/azure-functions/functions-runtime-overview)

Although it sounds good, please do note that Serverless service is indeed running on a server somewhere in this case on your server. And unlike a cloud service you have limitations on your server. Limitations like the number of cores and the size of RAM you have available, so you might not get the same performance as you would be getting on Cloud.

### Multi Language support
![MultiLingo](/images/MultiLingo.png)

The Serverless Framework supports multiple languages.

> 1. Python
> 2. Node.js (JavaScript)
> 3. Java
> 4. Scala
> 5. C#

Azure Functions Support a few more languages as well

> 6. PowerShell
> 7. TypeScript
> 8. PHP
> 9. F#
> 10. Bash
> 11. Batch

This gives you the ability to choose the best language or the language that you are most comfortable with, for a given solution.

--------------------------

## Triggers

Azure functions are primarily event driven, and there is a long list of events that will trigger Azure functions. The list is quite long, hence I will showcase a few good ones.

> 1. Http - API
> 2. Storage Account
>    - Queue triggers
>    - Blob triggers
> 3. Service Bus - IoT etc.  
> 4. Event Hub - Push requests
> 5. Timer

[List of triggers for Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)

### Bindings

Bindings allow you to connect to different services and use them as parameters in your code.

In most cases you can change your bindings by updating a JSON file `function.json`.

``` Json
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "post"
      ],
      "name": "req"
    },
    {
      "name": "outTable",
      "type": "table",
      "tableName": "Person",
      /* place you connection string here or in settings json */
      "connection": "AzureWebJobsStorage",
      "direction": "out"
    },
    {
      "name": "inTable",
      "type": "table",
      "tableName": "Person",
      "connection": "AzureWebJobsStorage",
      "direction": "in"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

In this case we are triggering the function by a http call and we are outputting a value in to storage table, as we do that we also return a http response back to the requester.

```JS
module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  // the out bindings aren't initallzed
  context.bindings.outTable = [];

  //the inTable is only used for index
  currentSize = context.bindings.inTable.length

  if (req.body && req.body.name) {
    context.bindings.outTable.push({
      PartitionKey: "Test",
      RowKey: currentSize + 1,
      Name: req.body.name
    });
    context.res = {
      body: "Hello " + req.body.name
    };
  }
  else {
    context.res = {
      status: 400,
      body: "Please pass a name on the request body"
    };
  }
  context.done();
};
```

 > Remember that your function can only have one trigger. 

But if you are working with C# you use parameter decoration to bind the resources to the function.

```CSharp
namespace BlogEg {
    public static class PushToTable {
        public class Person:TableEntity {
            public string Name { get; set; }
        }

        [FunctionName("PushToTable")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequest req,
            [Table("Person", Connection = "AzureWebJobsStorage")]CloudTable table,
            TraceWriter log
            ) {
            log.Info("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            // Get the Table values for indexing later
            var querySegment = table.ExecuteQuerySegmentedAsync(new TableQuery<Person>(), null);
            var people = new List<Person>();
            foreach (Person per in querySegment.Result)
                people.Add(per);

            // Getting Name from Query String or Request body
            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            // if there is a name, push it to table
            if (name != null) {
                var insertOp = TableOperation.Insert(new Person {
                    PartitionKey = "Test",
                    RowKey = $"{people.Count + 1}",
                    Name = name
                });
                table.ExecuteAsync(insertOp);
            }

            // Reply Ok Status
            return name != null
                ? (ActionResult)new OkObjectResult($"Hello, {name}")
                : new BadRequestObjectResult(
                    "Please pass a name on the query string or in the request body");
        }
    }
}
```

As you can see there are some differences in the C# vs JS example, The C# code is naturally more "complex" compared to the JS code. But on the other hand the JS code has a few more bindings.

> also the C# code is running on Azure Functions CLI v.2.x, where the JS runs on v.1.x

As a developer it's up to you to decide what to use and how to use it. Pay attention to the solutions requirement and the libraries available to you.

--------------------------

## Demo Time

### C# full Crud

Based on what we know let's try a CRUD API. I will be using C# but you can try whatever language you prefer.
I will be making a simple comment table, that might prove useful in the future.

The comment Table is going to look like this.

<table>
	<thead>
		<tr>
			<th style="color:#B2B6BD !important">Comments</th>
			<th style="color:#B2B6BD !important">TableEntity</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Display Name</td> <td>string</td>
		</tr>
		<tr>
			<td>Email</td> <td>string</td>
		</tr>
		<tr>
			<td>Karma</td> <td>int</td>
		</tr>
		<tr>
			<td>Content</td> <td>string</td>
		</tr>
	</tbody>
</table>

``` CSharp
 public class Comment: TableEntity {
   public string Name { get; set; }
   public string Email { get; set; }
   public int Karma { get; set; }
   public string Content { get; set; }
 }
```

* The Partition key is going to be a constant ```Comment```, and the Row Key is going to be a GUID to ensure uniqueness.
* Post, to add new items.
* Get, to get all items or one Item based on the GUID.
* Patch, to update based on the GUID.
* Delete, to Remove based on the GUID.

In the front end I'm going to Include the GUID so that I have the Karma functionally working.

#### Post Operation

```CSharp
[FunctionName("Comments")]
[return: Table("Comments", "AzureWebJobsStorage")]
public static Comment Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]HttpRequest req,
    TraceWriter log) {

    log.Info("C# HTTP trigger Post Comment.");

    string requestBody = new StreamReader(req.Body).ReadToEnd();
    var data = JsonConvert.DeserializeObject<Comment>(requestBody);

    // thorw if the input is incorrect
    if (data == null)
        throw new InvalidDataException("The Incoming Items dose not match a comment");

    // Set the Entity Values
    data.PartitionKey = "Comment";
    data.RowKey = System.Guid.NewGuid().ToString();

    // Push to table
    return data;
}
```

This time I'm writing my function a bit differently. I'm using the out binding of the Table instead of the in binding.

After all we are making an API that is going to be called from other applications. Thereby there is no need for any feedback, status code 200 will do just fine here.

#### Get Operation

``` CSharp
[FunctionName("GetComments")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Comments/")]HttpRequest req,
    [Table("Comments", Connection = "AzureWebJobsStorage")] CloudTable table,
    TraceWriter log) {
    log.Info("C# HTTP trigger Geting ALL the Comments");

    // Return List
    var comments = new System.Collections.Generic.List<Comment>();

    // Query to Select all item this PK Comment
    var tablequery = new TableQuery<Comment>().Where("PartitionKey eq 'Comment'");
    var querySegment = table.ExecuteQuerySegmentedAsync(tablequery, null);

    foreach (var c in querySegment.Result)
        comments.Add(c);

    return new OkObjectResult($"{JsonConvert.SerializeObject(comments)}");
}

```

Please do note the ```Route```. Even though the function name is ```GetComments```, the route is ```Comments/```. Allowing us to use the same address as in the post ```~/api/Comments```.

Now let's get an individual item.

``` CSharp
[FunctionName("GetComment")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Comments/{commentID}/")]HttpRequest req,
    [Table("Comments", "Comment", "{commentID}", Connection = "AzureWebJobsStorage")]Comment comment,
    string commentID,
    TraceWriter log) {
    log.Info($"C# HTTP trigger Getting the Comment with Id {commentID}");

    return new OkObjectResult(JsonConvert.SerializeObject(comment));
}
```

Note the ```Route``` again, this time we want to get one item, so we must be able to point to a specific item in the table. So we need to target both the primary keys.

In order to get the ```commentID``` we have two choices. We can either use the string query, or we can use the URL path to our advantage.

By using ```{ }``` we can tell the function that this part of the route is dynamic, and it is a good idea to keep it stored.  By putting a name inside the ```{ }``` we can store the parameter for later use.

``` CSharp
[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Comments/{commentID}/")]HttpRequest req,
[Table("Comments", "Comment", "{commentID}", Connection = "AzureWebJobsStorage")]Comment comment,
string commentID
```

All the ```commentID``` above will refer to the same reference point.

### Patch Operation

Now we can add items and we can get item(s), but we need to have a functionality to update an item as well, so that we can get that karma updated!

``` CSharp
[FunctionName("PatchComments")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "patch", Route = "Comments/{commentID}/")]HttpRequest req,
    [Table("Comments", Connection = "AzureWebJobsStorage")] CloudTable table,
    [Table("Comments", "Comment", "{commentID}", Connection = "AzureWebJobsStorage")] Comment comment,
    TraceWriter log) {
    log.Info("C# HTTP trigger Updating Comment");

    var body = new StreamReader(req.Body).ReadToEnd();
    Comment c = JsonConvert.DeserializeObject<Comment>(body);

    // Required Parameter for Merge!
    c.PartitionKey = comment.PartitionKey;
    c.RowKey = comment.RowKey;
    c.ETag = comment.ETag;

    var updateOp = TableOperation.Merge(c);
    table.ExecuteAsync(updateOp);

    return new OkResult();
}
```

When merging two rows with each other, back-end functionally of the table requires a few properties to be matching.

``` CSharp
c.PartitionKey = comment.PartitionKey;
c.RowKey = comment.RowKey;
c.ETag = comment.ETag;
```

### Delete Operation

Well I guess we have the CRU part of the CRUD in place all that is left is removal of an item.

``` CSharp
[FunctionName("DeleteComment")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "Comments/{commentID}/")]HttpRequest req,
    [Table("Comments", Connection = "AzureWebJobsStorage")] CloudTable table,
    [Table("Comments", "Comment", "{commentID}", Connection = "AzureWebJobsStorage")] Comment comment,
    TraceWriter log) {

    var removeOp = TableOperation.Delete(comment);
    table.ExecuteAsync(removeOp);

    return (ActionResult)new OkObjectResult($"Item Deleted");
}
```

Wow that was easy it took me like a minute to write that whole thing.

And that finishes the CRUD operation.

--------------------------

## A few final words

To all of you that have made it here I want to say thank for reading. The Source can be found on GitHub [link to repo](https://github.com/Luviz/blogAzFunction101).

The Source material that was used are located below:

* [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
* [Serveless](https://serverless.com/)
