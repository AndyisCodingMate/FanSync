CREATE TABLE `events` (
`EventID` int NOT NULL AUTO_INCREMENT, 
`EventName` varchar(255) DEFAULT NULL,
`DateTime` datetime DEFAULT NULL,
`ZoneA` int DEFAULT NULL,
`ZoneB` int DEFAULT NULL,
`ZoneC` int DEFAULT NULL, 
`ZoneD` int DEFAULT NULL, 
`ZoneD` int DEFAULT NULL, 
`Availability` varchar(45) DEFAULT NULL,
`Venue` varchar(255) DEFAULT NULL,


PRIMARY KEY (`EventID`)
) ;


INSERT INTO events (EventName, DateTime, ZoneA, ZoneB, ZoneC, ZoneD, Availability, Venue) VALUES
('monke', "2024-12-30", 15, 15, 15, 15, 'Open', 'Chase Center' )
