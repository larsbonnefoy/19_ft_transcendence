# Project README

The project aims to create a mutliplayer pong game as a web application with a backend using NestJs and a frontend using VueJs. The application will use PostgreSQL as its database and will be launched with Docker. The goal is to build a single-page application that is compatible with Chrome and at least one other browser.

## General Requirements

- Backend: NestJs
- Frontend: TypeScript framework (VueJs)
- Library: Use the latest stable one available
- Database: PostgreSQL
- Application Type: Single-page application
- Browser Compatibility: Compatible with Chrome and at least one other browser.
- Launch: The entire application should be launched using Docker

## Security Requirements

- Passwords: User passwords should be securely hashed
- SQL Injection: Implement measures to make the application SQL injection safe
- Input Validation: Implement server-side validation for all user inputs

## User Account Features

- 0Auth Login: Implement an OAuth login system using the API provided by 42 for user authentication
- Unique Name: Users should have unique usernames when registering for an account
- Upload Avatar: Users should be able to upload and set an avatar for their profile
- Two-Factor ID: Implement a two-factor identification system for added security
- Friends: Users can add other users as friends
  - Friend Status: Display the status of friends, whether they are online, offline, in-game, etc.
- Stats Display: Display user statistics on their profile, including wins, ladder level, and achievements
- Match History: Users should be able to view their match history, including 1v1 matches and ladder matches

## Chat Features

- Create Chat Rooms: Users can create chat rooms with options for public, private, or protected by a password
- Direct Messages: Users can send direct messages to each other
- Block Users: Users have the option to block other users
- Channel Ownership: The user who creates a channel becomes the owner until they leave it
  - Admin Privileges: The creator is the admin and can appoint other users as admins
  - Admin Actions: Admins can kick, ban, and mute users within the channel
- Invites: Users can invite others to play pong through the chat interface

## Game Features

- Live Matches: Users can play live matches against other players
- Matchmaking System: Implement a matchmaking system that allows users to join a queue until they are matched with other players
- Customization: Users can customize the game with different maps and power-ups, with an option to play a vanilla version
- Responsive Gameplay: Implement measures to handle network issues and ensure a smooth gaming experience

Please note that this is just an overview of the project requirements and features. Detailed implementation and technical specifications would be provided in individual documentation files for each component (backend, frontend, chat, game, etc.).
