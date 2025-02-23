CREATE DATABASE CrashViewAdvanced
USE CrashViewAdvanced

CREATE TABLE Teams (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL
);

CREATE TABLE Drivers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    TeamId INT NOT NULL,
    FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

CREATE TABLE Crashes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Date DATETIME NOT NULL,
    Description NVARCHAR(500),
    VideoUrl NVARCHAR(255)
);

CREATE TABLE CrashDriver (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CrashId INT NOT NULL,
    DriverId INT NOT NULL,
    CONSTRAINT FK_CrashDriver_Crash FOREIGN KEY (CrashId) REFERENCES Crashes(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CrashDriver_Driver FOREIGN KEY (DriverId) REFERENCES Drivers(Id) ON DELETE CASCADE
);

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL
);

CREATE TABLE CrashTeam (
	Id INT PRIMARY KEY IDENTITY(1,1),
    CrashId INT NOT NULL,
    TeamId INT NOT NULL,
    FOREIGN KEY (CrashId) REFERENCES Crashes(Id) ON DELETE CASCADE,
    FOREIGN KEY (TeamId) REFERENCES Teams(Id) ON DELETE CASCADE
);

CREATE TABLE Discussions (
    Id INT PRIMARY KEY IDENTITY(1,1),  
    CrashId INT NOT NULL,               
    Title NVARCHAR(255) NOT NULL,       
    CreatedAt DATETIME DEFAULT GETDATE(),  
    UpdatedAt DATETIME DEFAULT GETDATE(),  
    FOREIGN KEY (CrashId) REFERENCES Crashes(Id)  
);

CREATE TABLE Comments (
    Id INT PRIMARY KEY IDENTITY(1,1),    
    DiscussionId INT NOT NULL,            
    Author NVARCHAR(255) NOT NULL,        
    CommentText NVARCHAR(MAX) NOT NULL,   
    CreatedAt DATETIME DEFAULT GETDATE(), 
    FOREIGN KEY (DiscussionId) REFERENCES Discussions(Id) 
);

CREATE TABLE Polls (
    Id INT PRIMARY KEY IDENTITY(1,1),  
    DiscussionId INT NOT NULL,          
    Question NVARCHAR(255) NOT NULL,    
    CreatedAt DATETIME DEFAULT GETDATE(),  
    FOREIGN KEY (DiscussionId) REFERENCES Discussions(Id)  
);


CREATE TABLE PollVotes (
    Id INT PRIMARY KEY IDENTITY(1,1),   
    PollId INT NOT NULL,                 
    Voter NVARCHAR(255) NOT NULL,       
    VoteOption NVARCHAR(255) NOT NULL,   
    CreatedAt DATETIME DEFAULT GETDATE(), 
    FOREIGN KEY (PollId) REFERENCES Polls(Id) 
);

----- Example Insertions -----
--Admin user (or just use /api/Auth/create-initial-admin endpoint from swagger on localhost:7237/swagger/index.html)
INSERT INTO Users (UserName, Email, PasswordHash, Role)
VALUES ('admin', 'admin@admin.com', '$2a$10$1nTna887HGBOeeQYzmbSvO1xQFe/gbd6coprRtiPKLQOEXb0cL3Ka', 'Admin'); -- password: '123456'
--Regular user (or use /api/Auth/register endpoint)
INSERT INTO Users (UserName, Email, PasswordHash, Role)
VALUES ('john', 'john@john.com', '$2a$10$1nTna887HGBOeeQYzmbSvO1xQFe/gbd6coprRtiPKLQOEXb0cL3Ka', 'User'); -- password: '123456'

---F1 Related Data---
INSERT INTO Teams (Name) VALUES 
('Scuderia Ferrari'),
('Red Bull Racing'),
('Aston Martin'),
('Mercedes'),
('McLaren'),
('Alpine'),
('Williams'),
('Haas'),
('Racing Bulls'),
('Kick Sauber');

INSERT INTO Drivers (FirstName, LastName, TeamId) VALUES
('Charles', 'Leclerc', (SELECT Id FROM Teams WHERE Name = 'Scuderia Ferrari')),
('Lewis', 'Hamilton', (SELECT Id FROM Teams WHERE Name = 'Scuderia Ferrari')),
('Max', 'Verstappen', (SELECT Id FROM Teams WHERE Name = 'Red Bull Racing')),
('Liam', 'Lawson', (SELECT Id FROM Teams WHERE Name = 'Red Bull Racing')),
('Fernando', 'Alonso', (SELECT Id FROM Teams WHERE Name = 'Aston Martin')),
('Lance', 'Stroll', (SELECT Id FROM Teams WHERE Name = 'Aston Martin')),
('Kimi', 'Antonelli', (SELECT Id FROM Teams WHERE Name = 'Mercedes')),
('George', 'Russell', (SELECT Id FROM Teams WHERE Name = 'Mercedes')),
('Lando', 'Norris', (SELECT Id FROM Teams WHERE Name = 'McLaren')),
('Oscar', 'Piastri', (SELECT Id FROM Teams WHERE Name = 'McLaren')),
('Jack', 'Doohan', (SELECT Id FROM Teams WHERE Name = 'Alpine')),
('Pierre', 'Gasly', (SELECT Id FROM Teams WHERE Name = 'Alpine')),
('Alexander', 'Albon', (SELECT Id FROM Teams WHERE Name = 'Williams')),
('Carlos', 'Sainz', (SELECT Id FROM Teams WHERE Name = 'Williams')),
('Esteban', 'Ocon', (SELECT Id FROM Teams WHERE Name = 'Haas')),
('Oliver', 'Bearman', (SELECT Id FROM Teams WHERE Name = 'Haas')),
('Yuki', 'Tsunoda', (SELECT Id FROM Teams WHERE Name = 'Racing Bulls')),
('Isack', 'Hadjar', (SELECT Id FROM Teams WHERE Name = 'Racing Bulls')),
('Nico', 'Hulkenberg', (SELECT Id FROM Teams WHERE Name = 'Kick Sauber')),
('Gabriel', 'Borteleto', (SELECT Id FROM Teams WHERE Name = 'Kick Sauber'));