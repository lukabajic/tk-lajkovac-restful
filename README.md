# Teniski Klub Lajkovac

This project was designed and developed by [me](https://www.lukabajic.dev).
This repository contains the back-end.

## Description

Official web application of Tennic Club Lajkovac.

Main purpose is to allow registered users to schedule a court to play.
User can also access other registered users information to get in contact with them.

Later versions will implement:

- A way to challenge and accept challenges from other users
- To keep track of the town league scores and schedules online
- A recent match history of each user individually and in total
- Ranking system
- etc.

Will develop iOS/Android app later this year.

## Tech stack for this project:

This is a [MERN stack](https://www.mongodb.com/mern-stack) web app.
React logic and server-side logic are separated into different directories/repositories.

- [MongoDB](https://nextjs.org/) - for userbase and schedule.
- [Express](https://nextjs.org/) - minimal and flexible Node.js framework.
- [React](https://reactjs.org/) - UI and components.
- [Node.js](https://nextjs.org/) - server.

## Other packages used:

- [Redux](https://redux.js.org/) - state management.
- [React Redux](https://react-redux.js.org/) - react bindings for redux.
- [Redux Thunk](https://github.com/reduxjs/redux-thunk) - middleware for async logic.
- [React Router](https://reactrouter.com/web) - makes it a SPA.
- [socket.io-client](https://socket.io/docs/v3/client-api/index.html) - regoister changes.

- [mongoose](https://mongoosejs.com/) - makes communicating with MongoDB easier.
- [dotenv](https://github.com/motdotla/dotenv) - loads local variables.
- [jsonwebtoken](https://jwt.io/) - for authethication.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - password encryption.
- [@sendgrid/mail](https://sendgrid.com/) - for verifaction and reset password emails.
- [node-cron](https://www.npmjs.com/package/cron) - to schedule database updates every day.
- [socket.io](https://socket.io/) - web sockets to emit changes.
