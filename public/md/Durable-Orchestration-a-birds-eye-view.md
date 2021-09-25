# Durable Orchestration a bird’s eye view

The FaaS architecture is quite fascinating. Not due to its simplicity or its rapid development, but because of the way it works when it’s in the cloud. 

How does an Azure function work in the cloud you ask?

Well, if you have heard the pitches from Microsoft or AWS, about Lambdas or Functions. You have probably heard that they don’t have a dedicated processing unit. But they get assigned a processing unit when they are being used. Thereby lowering their cost down to zero. 

This fact intrigued me, and when I asked myself the question “what does this mean? And how can I use it?”.

Well the first question was simple. Just by looking in to the [Serverless auto-scaling](https://serverless.com/learn/), and the [Microsoft scale flexibly](https://azure.microsoft.com/en-gb/overview/serverless-computing/) you can hypothesize that azure functions can scale near “infinitely!” ... More like thousands, maybe a million or two.

 If an Azure function is trigged it will have access to one core, and for that core to be available as fast as possible, it should have a dedicated core. However, I don’t know for sure, if this is the way that Microsoft implemented the functions. But if we apply Occam’s razor into our hypothesis, the simplest solution is indeed what we have been talking about here. 
 
If I’m wrong about this, please do let me know.
So far, I have had a good hypothesis. But I liked to test it and see the results for myself.


## The Experiment

I started with writing two http triggered functions, F1 and F2. The F1 was simple, it had one job to call F2 asynchronously amounts of time. F2 was just supposed to do some repeatable functionality. But, I needed a controllable environment. So, I use `Task.Delay() `.

``` CSharp
public static class TheExperiment {
        private class PostBody {
            public int Calls { get; set; }
            public int Delay { get; set; }
        }

        [FunctionName("F1")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequestMessage req,
            TraceWriter log) {
            log.Info("C# HTTP trigger F1");

            // Get request body
            var data = await req.Content.ReadAsAsync<PostBody>();
            var calls = new List<Task>();
            for (int i = 0; i < data.Calls; i++) {
                calls.Add(CallF2(req, data));
            }
            await Task.WhenAll(calls.ToArray());
            return null;
        }
        private static async Task CallF2(HttpRequestMessage req, PostBody data) {
            using (HttpClient client = new HttpClient()) {
                var a = await client.GetAsync($"{req.RequestUri.ToString().Replace("/F1", "/F2")}?d={data.Delay}");
                //return a.StatusCode.ToString();
            }
        }

        [FunctionName("F2")]
        public static async Task<HttpResponseMessage> F2Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "Get")]HttpRequestMessage req,
            TraceWriter log) {

            string d = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "d", true) == 0)
                .Value;

            log.Info($"F2 started d = {d}... ");

            await Task.Delay(int.Parse(d));

            log.Info($"F2 ended d = {d}... ");

            return req.CreateResponse(HttpStatusCode.OK);
        }
    }
```

When I ran the functions in the CLI I saw that the F2 where being triggered in batches and that is quite reasonable because I ran the CLI on an Intel i7. The i7 have 4 cores and with hyperthreading it simulates 8 cores/ threads.

After that, I published the Function to Azure. What I saw was something beautiful. I saw true asynchronicity. No matter how many times F2 was called the latency was a few hundred milliseconds over the delay that I had.


### Post Analysis’
After I ran a few more tests I started asking myself if I could be writing a framework around this, to improve the development of my solutions.
But again, I was late to the party. Microsoft had been working on something similar. The Durable Orchestration Extension.

## Durable Orchestration Extension

The Durable Orchestration is a Microsoft open source Extension. That allows you to write flows for your functions. Just like Microsoft Flow but unlike Microsoft Flow it’s using code and code only. This gives you the same freedom that a developer always has. You can simply start by triggering an activity and as soon as that activity is finished you can start another activity. But why stop there, if your initial activity returns an array of values, you can start one Activity foreach value in the array. In its simplest terms you start a unique function for each Activity. As I previously mentioned an Azure function instance have one dedicated core. Giving you “unlimited” parallelization, with latency of course.


### My Experience 

Running it in the cloud, well you must just try it. 

An example was when I rewrote one of my simplest scripts. The script had to read a list of sites, and foreach site it had to acquire a new context, to call some of the APIs on that site. 

Sounds simple right, well it took me one hour to write the script in PowerShell. How long did one operation take, 1000 milliseconds to connect to the new site and around 2000 milliseconds to complete its tasks on the site. In summary it took 3 seconds to execute for each site. How many sites where in the list? Well around 1000. 

How long would that take, 1000 * 3 = 3000 seconds = 50 min. 

That script took one hour to complete, one hour that my machine was busy with that task. But hey it was using one of my cores and I had more cores to use. So, it wasn’t a big deal, but hey one hour is still one hour. 

Now you should have seen my face when I implemented that script in Azure functions with the Durable Extension. Could you imagine how long the operation took, for 1000 sites. Well it took around 5 to 10 seconds! Yeah, do the math on that!
Even if I would have implemented multithreading it would have still taken around 10 to 15 minutes.

### Patterns [ref](https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-overview)
you can read more about the pattern on Durable Functions overview. But I’ll be showcasing 3 of them here. These tree patterns are the back-bone of Durable Orchestration, and they are the ones I use most of the time.

#### Function chaining

![FuncChainT](/images/FuncChainT.png)

Function chaining is exactly what it sounds like. You call an Activity, it runs and when it’s completed it triggers the next Activity. When you call an Activity, it will return a Task with the content. I’ll be talking more about Activity’s and Orchestration when in the next segment.

####Fan-out/fan-in

![FuncFanT](/images/FuncFanT.png)

Fanning in and out. Is basically what I did in my experiment above. In that case F1 was fanning out F2. And when all the F2 instances where completed. F1 fanned them back in again, however I used Http calls in the experiment giving me the ability to wait for the http response. 

The Fan-out/ Fan-in pattern allows you to execute independent activity in parallel, decreasing runtime to the longest operation time of the activity. 

![OrchT-1](/images/OrchT-1.png)

Async HTTP APIs
The Extension works by using the storage account to store return values from activities and orchestration in a table. The Async Http APIs are a great way, to communicate with the Orchestration form the front-end or another service.
You basically get 3 URLs to communicate with the Orchestration. 
>  1. Get status 
>  2. Terminate Orchestration 
>  3. Raise event.

## Components 
Now that we have an idea how to use the Extension, let’s talk about the tools that we get from the extension.

### Orchestration Client [ref](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationClient.html)
The Orchestration Client is an in binding and you can implement it, on any function. Client’s job is to trigger Orchestration, this is the only way to trigger Orchestrations. 
The Client is an in binding that you wherever you need to, this allows you to start orchestration whenever you need to.
When you start an orchestration, you are given an instance id that you can use to communicate with the instance. This is the same id that you can use in with the Http APIs, from external sources.

### Orchestration Trigger [ref](https://azure.github.io/azure-functions-durable-extension/api/Microsoft.Azure.WebJobs.DurableOrchestrationContext.html)
The Orchestration Context is the orchestration trigger, it can be trigged from the orchestration Client. 

Here is where you write the Orchestration itself. Note, although it might be tempting to write business logic here, it’s not a good idea to do so here. You want to save the business logic for the activates. 

Form here you can trigger Activities; these activities are all task based giving you the control to fully manage them. But you can also call other Orchestrations here as well. For instance, you might have had an Orchestration from another part of the application that you can reuse here. Both the Activities and Sub Orchestrations are call Async and you can you can call them with retrying in mind.


### Activity Trigger
Ok finally here we are. The Activity Trigger is where the business logic of the Application goes, The Trigger is quite nimble, meaning that you don’t have to use the Durable Activity Context. It can convert the input parameter directly to the specified type on the fly. The Durable Activity Context doesn’t have a lot in it, just an Instance Id and the input, so I have never needed to use the Durable Activity Context. The activities are kind of a double-edged sword, firstly it's very easy to write activities and because of the input conversion on the fly, you can just focus on the code itself. But the problem is that an activity can’t call other activities. But you can always put an Orchestration Client in there, if you need to. I don’t know why you would need to do so, But you can! In case you might want to give it, a try let me remind you that the Client can only trigger orchestration.

Aside from that, there isn’t much more there. The principle is that instead of writing your functions here and there you would be writing them as Activity’s instead. There by you can reuse them for any Orchestration. Personally, I use a class library for the bigger projects can use them in my activities. for the smaller solution I don’t bother with class libraries.

You might be saying that, what if I need just an API. Why would I call three functions just to call to a single API? And that is a very good question but remember that Orchestration are used for communicating with multiple different functions. So, if you have an API that you don’t want to rewrite as an activity, you can write a rest activity that calls sends rest requests that you might have. Or you could write it the core of the function in a class library as a method and reuse it wherever you wish.


## Conclusion
This blog became much longer than I expected, so if you were here for some code don’t worry it is coming on my next blog called Durable Orchestration a deep dive.

Here we covered the overall functionality of FaaS architecture, and I designed the blog for a non-developer demographic. It’s mostly designed for Solution Architects, to get an overall view of the full force of cloud computing/ Processing.
