# 🏎️CrashView

CrashView aims to provide comprehensive crash analysis for Formula 1 races. It provides statistical data about crashes, drivers, teams, etc., and serves as a forum for users to discuss these incidents.

## Technologies Used

- *Frontend*: React.js
- *Backend*: .NET Core, Entity Framework
- *Database*: SQL Server

## Prerequisites

Before running the project, make sure you have the following installed:

- *.NET SDK*: Version 8.0 or higher  
  - You can check your .NET version by running:
    ```bash
    dotnet --version
    ```
  - If you don't have the .NET SDK installed, you can download it from [here](https://dotnet.microsoft.com/download/dotnet).

- *Node.js*: Version 10 or higher  
  - You can check your Node.js version by running:
    ```bash
    node -v
    ```
  - If you don't have Node.js installed, you can download it from [here](https://nodejs.org/).

---

## Usage
### Docker Setup
_Working on it..._

### Manual Setup
To set up CrashView locally, follow these steps:

1. Clone the CrashView repository to your local machine:
    ```bash
    git clone https://github.com/efesn/CrashView-Advanced.git
    ```

2. Navigate to the cloned directory:
    ```bash
    cd CrashView-Advanced
    ```

### Backend (API)

1. Navigate to the Backend directory:
    ```bash
    cd api
    ```

2. Run this to install dependencies:
    ```bash
    dotnet restore
    ```

3. Set up the database:
   - Execute the `tables.sql` file to create the necessary tables.

4. Create and update the connection string with your SQL Server details and JWT settings in `appsettings.json`:

    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=YOUR_SERVER;Database=CrashViewAdvanced;Trusted_Connection=True;"
    },
    "JwtSettings": {
      "Issuer": "localhost",
      "Audience": "localhost",
      "SecretKey": "Choose a secure key"
    }
    ```

5. Run the Backend server via terminal or run it from Visual Studio.
   - *Using Terminal (make sure you are in the `/api` directory):*
    ```bash
    dotnet run --launch-profile "https"
    ```

### Frontend

1. Navigate to the client directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the Frontend server:
    ```bash
    npm start
    ```

### Accessing the Application

- Frontend will be running on: [http://localhost:3000](http://localhost:3000)
- API will be running on: [https://localhost:7237](https://localhost:7237)
- Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
  *(You will need a user with the admin role to access it. See the "Example Insertions" section in `tables.sql` to create one.)*
- Swagger docs will be accessible on: [https://localhost:7237/swagger/index.html](https://localhost:7237/swagger/index.html)