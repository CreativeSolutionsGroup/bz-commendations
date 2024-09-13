<p align="center">
  <img src="assets/BZ-letters-solid.png" alt="BravoZulu" width="45%">
</p>
<p align="center">
  A Product of Campus Experience, Cedarville University
</p>

# BZ Commendations

BZ Commendations is a web application built by CSG that allows members of Campus Experience to send commendations to other members. Commendations are a way to encourage and uplift others in the Cedarville Campus Experience Team.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)

## Project Structure

BZ Commendations is built with Next.js, a React framework. Read more about the Next.js project structure [here](https://nextjs.org/docs/getting-started/project-structure).

- [Assets](./assets/) - Graphics and other static files used in the project
- [Components](./components/) - React components used throughout the project (see [README](./components/README.md))
- [Config](./config/) - Configuration files for the project
- [Lib](./lib/) - Utility functions and other shared code (see [README](./lib/README.md))
- [Pages](./pages/) - Contains the top-level pages of the application
- [Prisma](./prisma/) - Prisma database schemas used by the project
- [Public](./public/) - Static files that are served directly by the server
- [Styles](./styles/) - Global CSS styles for the project
- [Types](./types/) - TypeScript types used throughout the project

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- Node.js
- Yarn
- Doppler CLI

## Local Development

1. Clone the repository: `git clone https://github.com/CreativeSolutionsGroup/bz-commendations.git`

2. Install dependencies: `yarn install`

3. Set up doppler CLI ([doppler docs](https://docs.doppler.com/docs/install-cli)):

    - run `doppler login` and follow instructions to connect your local machine to CSG's doppler account
    - `doppler setup --project bz-commendations --config dev` - tells doppler to inject environment variables from the `dev` config of the `bz-commendations` project

4. Start the development server: `yarn dev` and open [http://localhost:3000/](http://localhost:3000/) with your browser to see a live preview. The preview will update as you make and save changes to the project files.
5. If you need to access the dev database, run `yarn studio` to open a local database, view at [http://localhost:5555/](http://localhost:5555/)

*If you are working on anything admin-page related, you may add yourself to the admin group in the dev database by running `yarn studio`. Adding yourself to the admin group will give you access to the admin dashboard.*
