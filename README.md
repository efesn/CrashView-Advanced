# 🏎️CrashView

__CrashView aiming to provide comprehensive crash analysis for Formula 1 races, it provides statistical data about crash, drivers, teams etc. and serves as a forum for users to discuss these incidents.__

## Technologies Used

- **Frontend**: React.js
- **Backend**: .NET Core, Entity Framework
- **Database**: SQL Server

## Prerequisites

Before running the project, make sure you have the following installed:

- **.NET SDK**: Version 8.0 or higher
  - You can check your .NET version by running:
    ```bash
    dotnet --version
    ```
  - If you don't have the .NET SDK installed, you can download it from [here](https://dotnet.microsoft.com/download/dotnet).

- **Node.js**: Version 10 or higher
  - You can check your Node.js version by running:
    ```bash
    node -v
    ```
  - If you don't have Node.js installed, you can download it from [here](https://nodejs.org/).

---

## Usage
### Docker Setup
*Working on it...*
### Manual Setup
To setup CrashView locally, follow these steps:

1. Clone the CrashView repository to your local machine:

```bash
git clone https://github.com/efesn/CrashView-Advanced.git
```
2. Navigate to the cloned directory:
```bash
cd CrashView-Advanced
```
### Backend (API)

1. Navigate to the Backend Directory

```bash
cd api
```
2. Run this to install dependencies 

```bash
dotnet restore
```

3. Set up the database:
- Execute the tables.sql file to create the necessary tables


4. Create and update the connection string with your SQL Server details and JWT settings in appsettings.json:

```bash
"ConnectionStrings": {
"DefaultConnection": "Server=YOUR_SERVER;Database=CrashViewAdvanced;Trusted_Connection=True;"
},
"JwtSettings": {
    "Issuer": "localhost",
    "Audience": "localhost",
    "SecretKey": "Choose a secure key"
  }
```
5. Run the Backend server via terminal or run it from visual studio
- **Using Terminal: (make sure you are on /api directory)**
```bash
dotnet run --launch-profile "https"
```

### Frontend

1. Navigate to the client directory
```bash
cd client
```
2. Install Dependencies

```bash
npm install
```

3. Run the Frontend server

```bash
npm start
```


### Accessing the Application
- Frontend will be running on: http://localhost:3000
- API will be running on: https://localhost:7237
- Admin dashboard: http://localhost:3000/admin/login (You will need an user with admin role to access there, see the "Example Insertions" section in tables.sql file to get one)
- Swagger docs will be accessible on: https://localhost:7237/swagger/index.html
