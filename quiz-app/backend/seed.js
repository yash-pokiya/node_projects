/**
 * MERN Stack Quiz Seed Script
 * ----------------------------
 * Inserts 50 high-quality MERN Stack interview questions into the database.
 *
 * Distribution:
 *   - 20 Single Correct Answer questions
 *   - 30 Multiple Correct Answer questions
 *
 * Difficulty:
 *   - 20 Easy
 *   - 20 Medium
 *   - 10 Hard
 *
 * Usage:
 *   node seed.js          → Insert questions (skips if already seeded)
 *   node seed.js --force  → Drop existing questions and re-seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./src/models/Question.model');
const User = require('./src/models/User.model');

// ──────────────────────────────────────────────
// 50 MERN Stack Interview Questions
// ──────────────────────────────────────────────
const questions = [
  // ═══════════════════════════════════════════
  //  SINGLE CORRECT ANSWER (20 questions)
  // ═══════════════════════════════════════════

  // 1 — React.js / Hooks (Easy)
  {
    title: 'Which React Hook is used to manage local component state?',
    options: [
      { optionNumber: 1, text: 'useEffect' },
      { optionNumber: 2, text: 'useState' },
      { optionNumber: 3, text: 'useMemo' },
      { optionNumber: 4, text: 'useRef' },
    ],
    correctAnswers: [2],
    difficulty: 'easy',
    category: 'React.js',
  },

  // 2 — Node.js / Modules (Easy)
  {
    title: 'What is the default module system used in Node.js?',
    options: [
      { optionNumber: 1, text: 'ES Modules (import/export)' },
      { optionNumber: 2, text: 'AMD (Asynchronous Module Definition)' },
      { optionNumber: 3, text: 'CommonJS (require/module.exports)' },
      { optionNumber: 4, text: 'UMD (Universal Module Definition)' },
    ],
    correctAnswers: [3],
    difficulty: 'easy',
    category: 'Node.js',
  },

  // 3 — MongoDB / CRUD (Easy)
  {
    title: 'Which MongoDB method is used to insert a single document into a collection?',
    options: [
      { optionNumber: 1, text: 'db.collection.insertOne()' },
      { optionNumber: 2, text: 'db.collection.addOne()' },
      { optionNumber: 3, text: 'db.collection.pushOne()' },
      { optionNumber: 4, text: 'db.collection.createOne()' },
    ],
    correctAnswers: [1],
    difficulty: 'easy',
    category: 'MongoDB',
  },

  // 4 — Express.js / Middleware (Easy)
  {
    title: 'In Express.js, what does the next() function do inside middleware?',
    options: [
      { optionNumber: 1, text: 'Sends the response back to the client' },
      { optionNumber: 2, text: 'Passes control to the next middleware in the stack' },
      { optionNumber: 3, text: 'Terminates the request-response cycle' },
      { optionNumber: 4, text: 'Restarts the current middleware function' },
    ],
    correctAnswers: [2],
    difficulty: 'easy',
    category: 'Express.js',
  },

  // 5 — JavaScript / Scope (Easy)
  {
    title: 'What keyword declares a block-scoped variable in JavaScript that cannot be reassigned?',
    options: [
      { optionNumber: 1, text: 'var' },
      { optionNumber: 2, text: 'let' },
      { optionNumber: 3, text: 'const' },
      { optionNumber: 4, text: 'static' },
    ],
    correctAnswers: [3],
    difficulty: 'easy',
    category: 'JavaScript',
  },

  // 6 — Authentication / JWT (Easy)
  {
    title: 'What does JWT stand for in web authentication?',
    options: [
      { optionNumber: 1, text: 'JavaScript Web Transfer' },
      { optionNumber: 2, text: 'JSON Web Token' },
      { optionNumber: 3, text: 'Java Web Token' },
      { optionNumber: 4, text: 'JSON Web Transfer' },
    ],
    correctAnswers: [2],
    difficulty: 'easy',
    category: 'Authentication & Security',
  },

  // 7 — Full Stack / REST APIs (Easy)
  {
    title: 'Which HTTP method is typically used to update an existing resource in a REST API?',
    options: [
      { optionNumber: 1, text: 'GET' },
      { optionNumber: 2, text: 'POST' },
      { optionNumber: 3, text: 'PUT' },
      { optionNumber: 4, text: 'DELETE' },
    ],
    correctAnswers: [3],
    difficulty: 'easy',
    category: 'Full Stack Concepts',
  },

  // 8 — React.js / Components (Easy)
  {
    title: 'What is the correct way to pass data from a parent component to a child component in React?',
    options: [
      { optionNumber: 1, text: 'Using state' },
      { optionNumber: 2, text: 'Using props' },
      { optionNumber: 3, text: 'Using context only' },
      { optionNumber: 4, text: 'Using Redux only' },
    ],
    correctAnswers: [2],
    difficulty: 'easy',
    category: 'React.js',
  },

  // 9 — MongoDB / Mongoose (Medium)
  {
    title: 'In Mongoose, which method is used to define a pre-save hook on a schema?',
    options: [
      { optionNumber: 1, text: 'schema.before("save", callback)' },
      { optionNumber: 2, text: 'schema.pre("save", callback)' },
      { optionNumber: 3, text: 'schema.hook("save", callback)' },
      { optionNumber: 4, text: 'schema.onSave(callback)' },
    ],
    correctAnswers: [2],
    difficulty: 'medium',
    category: 'MongoDB',
  },

  // 10 — JavaScript / Closures (Medium)
  {
    title: 'What is a closure in JavaScript?',
    options: [
      { optionNumber: 1, text: 'A function that has no return value' },
      { optionNumber: 2, text: 'A function that retains access to variables from its outer lexical scope even after the outer function has returned' },
      { optionNumber: 3, text: 'A function that can only be called once' },
      { optionNumber: 4, text: 'A function that is immediately invoked upon declaration' },
    ],
    correctAnswers: [2],
    difficulty: 'medium',
    category: 'JavaScript',
  },

  // 11 — Node.js / Event Loop (Medium)
  {
    title: 'Which phase of the Node.js event loop handles setTimeout and setInterval callbacks?',
    options: [
      { optionNumber: 1, text: 'Poll phase' },
      { optionNumber: 2, text: 'Check phase' },
      { optionNumber: 3, text: 'Timer phase' },
      { optionNumber: 4, text: 'Close callbacks phase' },
    ],
    correctAnswers: [3],
    difficulty: 'medium',
    category: 'Node.js',
  },

  // 12 — Express.js / Error Handling (Medium)
  {
    title: 'How does Express.js identify an error-handling middleware function?',
    options: [
      { optionNumber: 1, text: 'By naming the function "errorHandler"' },
      { optionNumber: 2, text: 'By placing it in a special errors directory' },
      { optionNumber: 3, text: 'By defining it with exactly four parameters: (err, req, res, next)' },
      { optionNumber: 4, text: 'By calling app.useError() instead of app.use()' },
    ],
    correctAnswers: [3],
    difficulty: 'medium',
    category: 'Express.js',
  },

  // 13 — React.js / useEffect (Medium)
  {
    title: 'What does passing an empty dependency array [] to useEffect accomplish?',
    options: [
      { optionNumber: 1, text: 'The effect runs on every re-render' },
      { optionNumber: 2, text: 'The effect runs only once after the initial render' },
      { optionNumber: 3, text: 'The effect never runs' },
      { optionNumber: 4, text: 'The effect runs before the component mounts' },
    ],
    correctAnswers: [2],
    difficulty: 'medium',
    category: 'React.js',
  },

  // 14 — Authentication / bcrypt (Medium)
  {
    title: 'What is the purpose of a salt in bcrypt password hashing?',
    options: [
      { optionNumber: 1, text: 'To encrypt the password with AES-256' },
      { optionNumber: 2, text: 'To add random data so identical passwords produce different hashes' },
      { optionNumber: 3, text: 'To compress the password before storing' },
      { optionNumber: 4, text: 'To validate the password format' },
    ],
    correctAnswers: [2],
    difficulty: 'medium',
    category: 'Authentication & Security',
  },

  // 15 — JavaScript / Hoisting (Medium)
  {
    title: 'What will console.log(x) output if called before the line "var x = 5;"?',
    options: [
      { optionNumber: 1, text: '5' },
      { optionNumber: 2, text: 'ReferenceError' },
      { optionNumber: 3, text: 'undefined' },
      { optionNumber: 4, text: 'null' },
    ],
    correctAnswers: [3],
    difficulty: 'medium',
    category: 'JavaScript',
  },

  // 16 — MongoDB / Indexing (Medium)
  {
    title: 'What is the primary benefit of creating an index on a MongoDB collection field?',
    options: [
      { optionNumber: 1, text: 'It reduces the size of documents' },
      { optionNumber: 2, text: 'It speeds up query performance on that field' },
      { optionNumber: 3, text: 'It enforces data types on the field' },
      { optionNumber: 4, text: 'It automatically encrypts the field' },
    ],
    correctAnswers: [2],
    difficulty: 'medium',
    category: 'MongoDB',
  },

  // 17 — Node.js / Streams (Hard)
  {
    title: 'Which type of Node.js stream is both readable and writable, where the output is computed from the input?',
    options: [
      { optionNumber: 1, text: 'Duplex stream' },
      { optionNumber: 2, text: 'Transform stream' },
      { optionNumber: 3, text: 'PassThrough stream' },
      { optionNumber: 4, text: 'Writable stream' },
    ],
    correctAnswers: [2],
    difficulty: 'hard',
    category: 'Node.js',
  },

  // 18 — JavaScript / Event Loop (Hard)
  {
    title: 'In JavaScript, which of the following has the highest priority in the microtask queue?',
    options: [
      { optionNumber: 1, text: 'setTimeout callback' },
      { optionNumber: 2, text: 'setInterval callback' },
      { optionNumber: 3, text: 'Promise.then callback' },
      { optionNumber: 4, text: 'requestAnimationFrame callback' },
    ],
    correctAnswers: [3],
    difficulty: 'hard',
    category: 'JavaScript',
  },

  // 19 — MongoDB / Transactions (Hard)
  {
    title: 'What is required to use multi-document transactions in MongoDB?',
    options: [
      { optionNumber: 1, text: 'A standalone MongoDB server' },
      { optionNumber: 2, text: 'A replica set or sharded cluster' },
      { optionNumber: 3, text: 'The WiredTiger storage engine only in standalone mode' },
      { optionNumber: 4, text: 'MongoDB version 3.0 or higher' },
    ],
    correctAnswers: [2],
    difficulty: 'hard',
    category: 'MongoDB',
  },

  // 20 — React.js / Performance Optimization (Hard)
  {
    title: 'Which React API is used to memoize the rendered output of a functional component to prevent unnecessary re-renders?',
    options: [
      { optionNumber: 1, text: 'React.PureComponent' },
      { optionNumber: 2, text: 'React.memo' },
      { optionNumber: 3, text: 'React.useMemo' },
      { optionNumber: 4, text: 'React.useCallback' },
    ],
    correctAnswers: [2],
    difficulty: 'hard',
    category: 'React.js',
  },

  // ═══════════════════════════════════════════
  //  MULTIPLE CORRECT ANSWERS (30 questions)
  // ═══════════════════════════════════════════

  // 21 — React.js / Hooks (Easy)
  {
    title: 'Which of the following are built-in React Hooks?',
    options: [
      { optionNumber: 1, text: 'useState' },
      { optionNumber: 2, text: 'useEffect' },
      { optionNumber: 3, text: 'useClass' },
      { optionNumber: 4, text: 'useMemo' },
      { optionNumber: 5, text: 'useTemplate' },
    ],
    correctAnswers: [1, 2, 4],
    difficulty: 'easy',
    category: 'React.js',
  },

  // 22 — JavaScript / ES6+ (Easy)
  {
    title: 'Which of the following are valid ES6+ features in JavaScript?',
    options: [
      { optionNumber: 1, text: 'Arrow functions' },
      { optionNumber: 2, text: 'Template literals' },
      { optionNumber: 3, text: 'Block-scoped variables with let and const' },
      { optionNumber: 4, text: 'goto statements' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'easy',
    category: 'JavaScript',
  },

  // 23 — MongoDB / CRUD (Easy)
  {
    title: 'Which of the following are valid MongoDB CRUD operations?',
    options: [
      { optionNumber: 1, text: 'find()' },
      { optionNumber: 2, text: 'insertMany()' },
      { optionNumber: 3, text: 'deleteOne()' },
      { optionNumber: 4, text: 'selectAll()' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'easy',
    category: 'MongoDB',
  },

  // 24 — Full Stack / HTTP Methods (Easy)
  {
    title: 'Which HTTP methods are considered idempotent?',
    options: [
      { optionNumber: 1, text: 'GET' },
      { optionNumber: 2, text: 'POST' },
      { optionNumber: 3, text: 'PUT' },
      { optionNumber: 4, text: 'DELETE' },
    ],
    correctAnswers: [1, 3, 4],
    difficulty: 'easy',
    category: 'Full Stack Concepts',
  },

  // 25 — Express.js / Routing (Easy)
  {
    title: 'Which of the following are valid Express.js route methods?',
    options: [
      { optionNumber: 1, text: 'app.get()' },
      { optionNumber: 2, text: 'app.post()' },
      { optionNumber: 3, text: 'app.fetch()' },
      { optionNumber: 4, text: 'app.delete()' },
      { optionNumber: 5, text: 'app.patch()' },
    ],
    correctAnswers: [1, 2, 4, 5],
    difficulty: 'easy',
    category: 'Express.js',
  },

  // 26 — Node.js / Async (Easy)
  {
    title: 'Which of the following are valid ways to handle asynchronous operations in Node.js?',
    options: [
      { optionNumber: 1, text: 'Callbacks' },
      { optionNumber: 2, text: 'Promises' },
      { optionNumber: 3, text: 'async/await' },
      { optionNumber: 4, text: 'Synchronous blocking' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'easy',
    category: 'Node.js',
  },

  // 27 — Authentication / Security (Easy)
  {
    title: 'Which of the following are common web security vulnerabilities?',
    options: [
      { optionNumber: 1, text: 'Cross-Site Scripting (XSS)' },
      { optionNumber: 2, text: 'Cross-Site Request Forgery (CSRF)' },
      { optionNumber: 3, text: 'SQL Injection' },
      { optionNumber: 4, text: 'Responsive Design' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'easy',
    category: 'Authentication & Security',
  },

  // 28 — JavaScript / Array Methods (Easy)
  {
    title: 'Which of the following JavaScript array methods return a new array without modifying the original?',
    options: [
      { optionNumber: 1, text: 'map()' },
      { optionNumber: 2, text: 'filter()' },
      { optionNumber: 3, text: 'push()' },
      { optionNumber: 4, text: 'slice()' },
    ],
    correctAnswers: [1, 2, 4],
    difficulty: 'easy',
    category: 'JavaScript',
  },

  // 29 — React.js / State Management (Medium)
  {
    title: 'Which of the following are valid state management approaches in a React application?',
    options: [
      { optionNumber: 1, text: 'React Context API with useReducer' },
      { optionNumber: 2, text: 'Redux Toolkit' },
      { optionNumber: 3, text: 'Zustand' },
      { optionNumber: 4, text: 'jQuery data attributes' },
      { optionNumber: 5, text: 'Local component state with useState' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'medium',
    category: 'React.js',
  },

  // 30 — MongoDB / Aggregation (Medium)
  {
    title: 'Which of the following are valid MongoDB aggregation pipeline stages?',
    options: [
      { optionNumber: 1, text: '$match' },
      { optionNumber: 2, text: '$group' },
      { optionNumber: 3, text: '$filter' },
      { optionNumber: 4, text: '$project' },
      { optionNumber: 5, text: '$unwind' },
    ],
    correctAnswers: [1, 2, 4, 5],
    difficulty: 'medium',
    category: 'MongoDB',
  },

  // 31 — Express.js / Middleware (Medium)
  {
    title: 'Which of the following are valid types of middleware in Express.js?',
    options: [
      { optionNumber: 1, text: 'Application-level middleware' },
      { optionNumber: 2, text: 'Router-level middleware' },
      { optionNumber: 3, text: 'Error-handling middleware' },
      { optionNumber: 4, text: 'Component-level middleware' },
      { optionNumber: 5, text: 'Third-party middleware' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'medium',
    category: 'Express.js',
  },

  // 32 — JavaScript / Destructuring & Spread (Medium)
  {
    title: 'Which of the following are valid uses of the spread operator (...) in JavaScript?',
    options: [
      { optionNumber: 1, text: 'Copying an array: const copy = [...original]' },
      { optionNumber: 2, text: 'Merging objects: const merged = { ...obj1, ...obj2 }' },
      { optionNumber: 3, text: 'Passing array elements as function arguments: func(...args)' },
      { optionNumber: 4, text: 'Declaring variables: ...const x = 5' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'JavaScript',
  },

  // 33 — Node.js / Process & Cluster (Medium)
  {
    title: 'Which of the following are properties or methods available on the Node.js process object?',
    options: [
      { optionNumber: 1, text: 'process.env' },
      { optionNumber: 2, text: 'process.exit()' },
      { optionNumber: 3, text: 'process.argv' },
      { optionNumber: 4, text: 'process.render()' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'Node.js',
  },

  // 34 — React.js / React Router (Medium)
  {
    title: 'Which components are provided by React Router v6 for defining routes?',
    options: [
      { optionNumber: 1, text: '<Routes>' },
      { optionNumber: 2, text: '<Route>' },
      { optionNumber: 3, text: '<Switch>' },
      { optionNumber: 4, text: '<Outlet>' },
      { optionNumber: 5, text: '<Link>' },
    ],
    correctAnswers: [1, 2, 4, 5],
    difficulty: 'medium',
    category: 'React.js',
  },

  // 35 — Full Stack / MVC & Deployment (Easy)
  {
    title: 'Which of the following are valid layers in the MVC (Model-View-Controller) architecture?',
    options: [
      { optionNumber: 1, text: 'Model — handles data and business logic' },
      { optionNumber: 2, text: 'View — handles the presentation layer' },
      { optionNumber: 3, text: 'Controller — handles user input and updates the model' },
      { optionNumber: 4, text: 'Service — handles external API communication' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'easy',
    category: 'Full Stack Concepts',
  },

  // 36 — MongoDB / Schema Design & Validation (Medium)
  {
    title: 'Which of the following are valid Mongoose schema type options for field validation?',
    options: [
      { optionNumber: 1, text: 'required' },
      { optionNumber: 2, text: 'minlength' },
      { optionNumber: 3, text: 'enum' },
      { optionNumber: 4, text: 'autoRender' },
      { optionNumber: 5, text: 'default' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'medium',
    category: 'MongoDB',
  },

  // 37 — Authentication / Cookies & Sessions (Medium)
  {
    title: 'Which of the following are valid cookie attributes that improve security?',
    options: [
      { optionNumber: 1, text: 'HttpOnly' },
      { optionNumber: 2, text: 'Secure' },
      { optionNumber: 3, text: 'SameSite' },
      { optionNumber: 4, text: 'AutoDelete' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'Authentication & Security',
  },

  // 38 — Express.js / Authentication & Authorization (Medium)
  {
    title: 'Which of the following are commonly used strategies for implementing authentication in an Express.js application?',
    options: [
      { optionNumber: 1, text: 'JWT (JSON Web Tokens)' },
      { optionNumber: 2, text: 'Session-based authentication with express-session' },
      { optionNumber: 3, text: 'Passport.js with local strategy' },
      { optionNumber: 4, text: 'Using query parameters for passwords' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'Express.js',
  },

  // 39 — JavaScript / Promises (Medium)
  {
    title: 'Which of the following methods can be used to handle multiple Promises concurrently in JavaScript?',
    options: [
      { optionNumber: 1, text: 'Promise.all()' },
      { optionNumber: 2, text: 'Promise.allSettled()' },
      { optionNumber: 3, text: 'Promise.race()' },
      { optionNumber: 4, text: 'Promise.forEach()' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'JavaScript',
  },

  // 40 — React.js / useMemo & useCallback (Medium)
  {
    title: 'Which of the following statements about useMemo and useCallback in React are correct?',
    options: [
      { optionNumber: 1, text: 'useMemo memoizes a computed value' },
      { optionNumber: 2, text: 'useCallback memoizes a function reference' },
      { optionNumber: 3, text: 'Both accept a dependency array as the second argument' },
      { optionNumber: 4, text: 'useCallback returns the result of calling the function' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'medium',
    category: 'React.js',
  },

  // 41 — Node.js / Buffers & File System (Hard)
  {
    title: 'Which of the following statements about Node.js Buffers are correct?',
    options: [
      { optionNumber: 1, text: 'Buffers represent fixed-length sequences of raw binary data' },
      { optionNumber: 2, text: 'Buffer.alloc(size) creates a zero-filled buffer of the specified size' },
      { optionNumber: 3, text: 'Buffers are resizable after creation' },
      { optionNumber: 4, text: 'Buffer.from(string) creates a buffer from a string' },
    ],
    correctAnswers: [1, 2, 4],
    difficulty: 'hard',
    category: 'Node.js',
  },

  // 42 — MongoDB / Aggregation Advanced (Hard)
  {
    title: 'Which of the following MongoDB aggregation expressions are valid for performing calculations within a $project stage?',
    options: [
      { optionNumber: 1, text: '$add' },
      { optionNumber: 2, text: '$multiply' },
      { optionNumber: 3, text: '$concat' },
      { optionNumber: 4, text: '$calculate' },
      { optionNumber: 5, text: '$cond' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'hard',
    category: 'MongoDB',
  },

  // 43 — JavaScript / Prototype Chain (Hard)
  {
    title: 'Which of the following statements about the JavaScript prototype chain are correct?',
    options: [
      { optionNumber: 1, text: 'Every JavaScript object has a prototype, except the base Object.prototype' },
      { optionNumber: 2, text: 'Object.create(null) creates an object with no prototype' },
      { optionNumber: 3, text: 'The prototype chain is used for property and method lookup' },
      { optionNumber: 4, text: 'Primitive values have their own prototype chain' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'hard',
    category: 'JavaScript',
  },

  // 44 — React.js / Context API Advanced (Hard)
  {
    title: 'Which of the following are true about React Context API and performance?',
    options: [
      { optionNumber: 1, text: 'All consumers re-render when the context value changes' },
      { optionNumber: 2, text: 'Splitting contexts by concern can reduce unnecessary re-renders' },
      { optionNumber: 3, text: 'useMemo can be used to memoize the context value object' },
      { optionNumber: 4, text: 'React.memo alone prevents re-renders caused by context changes' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'hard',
    category: 'React.js',
  },

  // 45 — Full Stack / Environment & Scalability (Easy)
  {
    title: 'Which of the following are best practices for managing environment variables in a MERN stack application?',
    options: [
      { optionNumber: 1, text: 'Store secrets in a .env file and add .env to .gitignore' },
      { optionNumber: 2, text: 'Use process.env to access variables in Node.js' },
      { optionNumber: 3, text: 'Hardcode API keys directly in the frontend source code' },
      { optionNumber: 4, text: 'Use different .env files for development and production' },
    ],
    correctAnswers: [1, 2, 4],
    difficulty: 'easy',
    category: 'Full Stack Concepts',
  },

  // 46 — Express.js / CORS & Security (Medium)
  {
    title: 'Which of the following headers are set by the CORS middleware in an Express.js application?',
    options: [
      { optionNumber: 1, text: 'Access-Control-Allow-Origin' },
      { optionNumber: 2, text: 'Access-Control-Allow-Methods' },
      { optionNumber: 3, text: 'Access-Control-Allow-Headers' },
      { optionNumber: 4, text: 'Content-Security-Policy' },
      { optionNumber: 5, text: 'Access-Control-Allow-Credentials' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'medium',
    category: 'Express.js',
  },

  // 47 — Authentication / Secure Auth Flow (Hard)
  {
    title: 'Which of the following are considered best practices for a secure JWT authentication flow?',
    options: [
      { optionNumber: 1, text: 'Store JWT in an HttpOnly cookie instead of localStorage' },
      { optionNumber: 2, text: 'Set a short expiration time for access tokens' },
      { optionNumber: 3, text: 'Use refresh tokens to obtain new access tokens' },
      { optionNumber: 4, text: 'Include the user password in the JWT payload' },
    ],
    correctAnswers: [1, 2, 3],
    difficulty: 'hard',
    category: 'Authentication & Security',
  },

  // 48 — MongoDB / Relationships (Easy)
  {
    title: 'Which of the following are valid approaches for modeling relationships between documents in MongoDB?',
    options: [
      { optionNumber: 1, text: 'Embedding related documents within a parent document' },
      { optionNumber: 2, text: 'Using references (ObjectId) to link documents across collections' },
      { optionNumber: 3, text: 'Using SQL JOIN syntax directly in MongoDB queries' },
      { optionNumber: 4, text: 'Using the $lookup aggregation stage to perform a left outer join' },
    ],
    correctAnswers: [1, 2, 4],
    difficulty: 'easy',
    category: 'MongoDB',
  },

  // 49 — Node.js / Cluster Module (Hard)
  {
    title: 'Which of the following statements about the Node.js cluster module are correct?',
    options: [
      { optionNumber: 1, text: 'It allows creating child processes that share the same server port' },
      { optionNumber: 2, text: 'Worker processes run on separate threads within the same process' },
      { optionNumber: 3, text: 'The master process can detect when a worker crashes and fork a new one' },
      { optionNumber: 4, text: 'cluster.isMaster (or cluster.isPrimary) returns true in the master process' },
    ],
    correctAnswers: [1, 3, 4],
    difficulty: 'hard',
    category: 'Node.js',
  },

  // 50 — Full Stack / Performance & Deployment (Easy)
  {
    title: 'Which of the following techniques can improve the performance of a deployed MERN stack application?',
    options: [
      { optionNumber: 1, text: 'Implementing server-side caching with Redis' },
      { optionNumber: 2, text: 'Using a CDN to serve static frontend assets' },
      { optionNumber: 3, text: 'Enabling gzip or Brotli compression on the Express server' },
      { optionNumber: 4, text: 'Storing all data in global JavaScript variables instead of a database' },
      { optionNumber: 5, text: 'Code splitting and lazy loading React components' },
    ],
    correctAnswers: [1, 2, 3, 5],
    difficulty: 'easy',
    category: 'Full Stack Concepts',
  },
];

// ──────────────────────────────────────────────
// Seed Logic
// ──────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizmaster';
    await mongoose.connect(mongoURI);
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

    const forceReseed = process.argv.includes('--force');

    // Check if questions already exist
    const existingCount = await Question.countDocuments();
    if (existingCount > 0 && !forceReseed) {
      console.log(`⚠️  Database already has ${existingCount} questions.`);
      console.log('   Run "node seed.js --force" to drop existing questions and re-seed.');
      await mongoose.connection.close();
      process.exit(0);
    }

    if (forceReseed && existingCount > 0) {
      await Question.deleteMany({});
      console.log(`🗑️  Deleted ${existingCount} existing questions.`);
    }

    // Find or create an admin user for the createdBy field
    let adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('📝 No admin user found. Creating a seed admin user...');
      adminUser = await User.create({
        name: 'Quiz Admin',
        email: 'admin@quizmaster.com',
        password: 'Admin@123456',
        role: 'admin',
      });
      console.log(`✅ Seed admin created: ${adminUser.email}`);
    } else {
      console.log(`✅ Using existing admin user: ${adminUser.email}`);
    }

    // Attach createdBy to each question
    const questionsWithCreator = questions.map((q) => ({
      ...q,
      createdBy: adminUser._id,
    }));

    // Insert questions one-by-one to trigger pre-save hooks (auto-set questionType)
    let inserted = 0;
    const errors = [];

    for (let i = 0; i < questionsWithCreator.length; i++) {
      try {
        const doc = new Question(questionsWithCreator[i]);
        await doc.save();
        inserted++;
      } catch (err) {
        errors.push({ index: i + 1, title: questionsWithCreator[i].title, error: err.message });
      }
    }

    console.log('\n══════════════════════════════════════════');
    console.log('       MERN STACK QUIZ SEED REPORT');
    console.log('══════════════════════════════════════════');
    console.log(`✅ Successfully inserted: ${inserted} / ${questions.length} questions`);

    if (errors.length > 0) {
      console.log(`\n❌ Failed to insert ${errors.length} question(s):`);
      errors.forEach((e) => {
        console.log(`   Q${e.index}: ${e.title}`);
        console.log(`         Error: ${e.error}`);
      });
    }

    // Print distribution summary
    const singleCount = questions.filter((q) => q.correctAnswers.length === 1).length;
    const multipleCount = questions.filter((q) => q.correctAnswers.length > 1).length;
    const easyCount = questions.filter((q) => q.difficulty === 'easy').length;
    const mediumCount = questions.filter((q) => q.difficulty === 'medium').length;
    const hardCount = questions.filter((q) => q.difficulty === 'hard').length;

    const categories = {};
    questions.forEach((q) => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });

    console.log('\n📊 Distribution:');
    console.log(`   Type    → Single: ${singleCount} | Multiple: ${multipleCount}`);
    console.log(`   Level   → Easy: ${easyCount} | Medium: ${mediumCount} | Hard: ${hardCount}`);
    console.log('   Topics  →');
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`             ${cat}: ${count}`);
      });

    console.log('\n══════════════════════════════════════════\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
