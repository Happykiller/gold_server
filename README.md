# Lilith Planning Poker APIs

Back Planning Poker is a project that leverages TypeScript, NestJS, and GraphQL subscriptions to facilitate efficient back-end planning sessions using the popular Planning Poker technique. This project aims to streamline the estimation process for development tasks, ensuring better accuracy and collaboration among team members.

## Features

- **Real-time Collaboration**: Utilize GraphQL subscriptions to enable real-time collaboration during planning sessions, allowing team members to instantly see and discuss estimations.

- **Scalable Architecture**: Built on NestJS, a powerful and extensible Node.js framework, the project provides a scalable and modular architecture for easy maintenance and future enhancements.

- **TypeScript**: Leverage the benefits of TypeScript for static typing, enhanced code readability, and improved development productivity.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, scalable, and maintainable server-side applications.

- **GraphQL**: A query language and runtime for APIs that enables efficient data fetching and real-time updates.

- **TypeScript**: A superset of JavaScript that adds static types to the language, improving code quality and development experience.

## Getting Started

### Prerequisites

- Node.js: [Download and Install Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Happykiller/lilith_back.git
```

2. Install dependencies:

```bash
cd lilith_back
npm install
```

3. Set up environment variables:

Create a `.env` file in the project root and configure the necessary environment variables.

```env
# Sample .env file
APP_PORT=3000
TOKEN_CLIENT=token
```

4. Run the application:

```bash
npm run start
```

## Usage

[Apis documentations](docs/api/tableOfContent.md)

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the NestJS, GraphQL, and TypeScript communities for providing excellent tools and resources.

Happy Planning Poker! 🃏✨