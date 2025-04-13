# Contributing to Clinton CAT

Thank you for considering contributing to **Clinton CAT**! We appreciate your time and effort to improve this project. Please follow the guidelines below to ensure a smooth collaboration.

## Code Style & Guidelines
- Please adhere to the [Code Style Guidelines](docs/code-style.md).

## How to Contribute

### 1. Fork and Clone the Repository
- Fork the repository on GitHub.
- Clone your forked repository to your local machine:
  ```sh
  git clone git@github.com:YourUsername/ClintonCAT.git
  cd ClintonCAT
  ```

### 2. Install Dependencies
Ensure you have **Node.js** and **npm** installed. Then, run:
```sh
npm install
```

### 3. Development Workflow
- Use a **feature branch** for your changes:
  ```sh
  git checkout -b feature/your-feature-name
  ```
- Make your changes and commit them with clear commit messages.
- Run tests before submitting a PR:
  ```sh
  npm test
  ```
- Format your code before committing:
  ```sh
  npm run format
  ```
- Push the branch to your fork and submit a **Pull Request (PR)**.

### 4. Running the Development Server
To start the development server and watch for changes, run:
```sh
npm run dev:chromium
```
For Firefox (Gecko-based browsers), use:
```sh
npm run dev:gecko
```
This will start Webpack and watch for changes automatically. (Manually reloading the page is still required to reflect changes.)

### 5. Code Guidelines
- Follow the existing coding style.
- Run **Prettier** for formatting:
  ```sh
  npm run format
  ```
- Ensure **ESLint** passes without errors:
  ```sh
  npm run lint
  ```

### 6. Testing
We use **Jest** for unit and integration testing.
- Run all tests:
  ```sh
  npm test
  ```
- For manual browser testing:
  ```sh
  npx http-server tests/www
  ```

### 7. Submitting a Pull Request (PR)
- Ensure your branch is up to date with `main`:
  ```sh
  git pull origin main
  ```
- Open a PR on GitHub and follow the provided PR template.
- Include a **clear description** of your changes.

## Reporting Issues
If you find a bug or have a feature request:
- Check **existing issues** before creating a new one.
- Provide a clear **description**, **steps to reproduce**, and **expected behavior**.
- Add relevant **screenshots** or **logs**, if applicable.

## License
By contributing, you agree that your contributions will be licensed under the **MIT License**.

Thank you for contributing! 🚀

