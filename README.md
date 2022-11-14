# **Full stack task implementation**

This is an assignment implementation of a simple and limited book browsing and managing system.

## **Description**
There are three major parts:
1. **MySQL** database with schema intialization script in `./db` directory;
2. Backend application (`./backend` directory) written with **Java 8** and **Spring-Boot**, that communicates with the database and provides frontenda **CRUD REST API** for **Book**-entities;
3. Frontend client application in `./frontend` directory; the client is written with **React** on **TypeScript** and styled with **TailwindCSS**

The whole project is then wrapped with **Docker-Compose** for easier start-up and interaction with the system

## **Running the application**

Please, refer to the checklist below, before you attempt to run the system!

### **Checklist before starting**

Make sure that your machine has the following tools installed and configured:

#### **For run in Docker containers**
* **Docker**
* **Docker-Compose** (though later versions of **Docker** include CLI commands for compose as well)

NB! `docker-compose.yml` needs to obtain value for the MySQL database password through an environment variable **MYSQL_ROOT_PASSWORD**.

The easiest way to do that is to create `.env` file in the same directory where `docker-compose.yml`. In that file provide a key-value pair of the environment variable like this: `MYSQL_ROOT_PASSWORD=mypassword` (this is just an example, instead of `mypassword` feel free to use any value).

#### **For local run of the `./backend`- and `./frontend`-application**
* **Java 8**
* **Maven 3.6+**
* **Node nad npm**

`./backend`- and `./frontend`-application also rely on environmental variables. 

For the `./backend` navigate to `./backend/src/main/resources/application.properties` and pay attention to parts written like this: `${MYSQL_HOST:localhost}`. The first string, all in capital letters and before the colon (`:`), is an environment variable name that the app needs and will try to look up. The second string, lower-case letters and before the colon (`:`), is a default value for the environment variable if the look up fails.

So, either provide the needed environment variables or update the default values!

For the `./frontend` navigate to `./frontend/src/setupProxy.js`. There you can find a line like this, for example:
```js
const host = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : 'localhost';
```
Here, the envrionment variable name is actually **REACT_APP_API_HOST** and the default value is coming after the colon (`:`) as well.

### **Starting the system via Docker-Compose**
1. Navigate to the root of the project in a terminal
2. Execute the following command:
```
docker-compose up -d
```
OR if you use the latest version of **Docker**
```
docker compose up -d
```

### **Starting each part separately**

* **MySQL**
You either need to have **MySQL** already installed or you can run it in a **Docker** container.

Use the `./db/schema.sql` file to initialize schema in your locally run **MySQL**.

OR in the project's root run the following command to start only **mysql-db** service:
```
docker-compose up mysql-db -d
```
OR if you use the latest version of **Docker**
```
docker compose up mysql-db -d
```

**NB!** If you opted for the **Docker** option, **the exposed port for the host will be 3307**, unless you specified otherwise! This is important to know for the `./backend` to connect to it.

* **Backend**
Open terminal in the `./backend` directory and run the following command:
```
mvn spring-boot:run
```
**NB!** Regarding environment variables: you can either write the ddefault values in the `./backend/src/main/resources/application.properties` as mentioned in the **For local run of the `./backend`- and `./frontend`-application** section, or you can pass them to the command:
```
mvn spring-boot:run -Dspring-boot.run.arguments="--MYSQL_HOST=localhost --MYSQL_PORT=3307 [etc]"
```
Remember, that if you have a local **MySQL** instance, then most probably it will listen on port **3306** (unless you configured it differently). If, however, you chose to start the **mysql-db** service, then the exposed port is **3307**!

* **Frontend**
Open terminal in the `./frontend` directory and run the following commands:
```
npm install
```
then
```
npm start
```

**NB!** The `./frontend/src/setupProxy.js` is needed to circumvent CORS issues. The file needs to know two important variables: **REACT_APP_API_HOST** and **REACT_APP_API_PORT**; the former is should `localhost`, unless you want to direct requests to some specific own API address; the latter, however, is crucial and dependens on **BACKEND_PORT** environment variable specified for the `./backend` (default is `8080`);
