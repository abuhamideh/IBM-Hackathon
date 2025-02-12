
# AIVest - IBM Hackathon (Team 7)
Platform to ensure that anyone can break into investment and make wise decisions out of it.


<p align="center">
<img alt="Logo" src="https://github.com/abuhamideh/IBM-Hackathon/blob/9ff31ec208b32542b9f1f479d09cb484cbf065ff/AIVerse.jpg"/>
</p>

## Features

- Database to store user information and their money.
  
- Stock Plotter -  pulls the last 7 days of data from a stock specified by the user.
  
- InvestiGraph - game that allows users to invest their fake money into real stocks.
  
- IBM Chatbot that gives advice on types of investment accounts, tips for InvestiGraph and what stocks to invest in.


## Prerequisities
- MySQL Server (ideally 8.0, other versions untested).
- OpenJDK 21
- Rapidfire API account - [Once signed up, you can access your API key for Yahoo Finance here](https://rapidapi.com/sparior/api/yahoo-finance15/playground/apiendpoint_b7dd3888-f254-4081-a4cb-178d5638136e)


## Run Locally

Clone the project

```bash
  git clone https://github.com/abuhamideh/IBM-Hackathon
```

Go to the project directory

```bash
  cd IBM-Hackathon/hackathon
```

Change the database values in applications.properties (src/main/resources)

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/[INSERT_DATABASE_HERE]
spring.datasource.username=[INSERT_USERNAME_HERE]
spring.datasource.password=[INSERT_PASSWORD_HERE]
```

Insert your RapidAPI API Key in index.js (src/main/resources/static) for InvestiGraph and in the script tag for Stock Plotter (src/main/resources/templates) 

```bash
  const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${ticker}&interval=1d&diffandsplits=false`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '[INSERT_API_KEY_HERE]',
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
        }
    };
```

Build the Spring Boot Application (ideally using IntelliJ, other IDEs untested).


## Roadmap

- Allow for user to input a start and end date for Stock Plotter.

- Deploy the project so that anyone can access it (through Docker?)

- Modify the output for InvestiGraph so that data is displayed in a nicer way than alerts.

- Create skynet :)


## Impact

The impact of our project is revolutionising the way people look at investing. It intends to break down the difficulty barrier investing has so that the average person can easily learn and apply key concepts without any actual risk to their money.
