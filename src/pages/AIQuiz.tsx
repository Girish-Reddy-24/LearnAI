import { useState } from 'react';
import { FileQuestion, Brain, CheckCircle, XCircle, RotateCcw, Sparkles, MessageSquare, Send, Lightbulb } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  total: number;
  answers: { questionId: number; userAnswer: number; correct: boolean }[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIQuiz() {
  const [mode, setMode] = useState<'quiz' | 'ask'>('quiz');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [askLoading, setAskLoading] = useState(false);

  const topics = [
    { id: 'python', name: 'Python Programming', icon: '🐍' },
    { id: 'ml', name: 'Machine Learning', icon: '🤖' },
    { id: 'ds', name: 'Data Structures', icon: '📊' },
    { id: 'web', name: 'Web Development', icon: '🌐' },
    { id: 'database', name: 'Databases & SQL', icon: '💾' },
    { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
  ];

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('python') || lowerQuestion.includes('list') || lowerQuestion.includes('function') || lowerQuestion.includes('programming')) {
      return `Great question about Python! Here's a comprehensive answer:

**Python Fundamentals:**

Python is a high-level, interpreted programming language known for its simplicity and readability.

**Key Concepts:**

1. **Variables & Data Types**
   \`\`\`python
   # Numbers
   age = 25
   price = 19.99

   # Strings
   name = "Alice"

   # Lists (mutable)
   numbers = [1, 2, 3, 4, 5]

   # Tuples (immutable)
   coordinates = (10, 20)

   # Dictionaries
   person = {"name": "Bob", "age": 30}
   \`\`\`

2. **Functions**
   \`\`\`python
   def greet(name, greeting="Hello"):
       return f"{greeting}, {name}!"

   # Lambda functions
   square = lambda x: x ** 2
   \`\`\`

3. **Loops & Conditionals**
   \`\`\`python
   # For loop
   for i in range(5):
       print(i)

   # While loop
   while count < 10:
       count += 1

   # If-elif-else
   if score >= 90:
       grade = "A"
   elif score >= 80:
       grade = "B"
   else:
       grade = "C"
   \`\`\`

4. **List Comprehensions**
   \`\`\`python
   squares = [x**2 for x in range(10)]
   evens = [x for x in range(20) if x % 2 == 0]
   \`\`\`

**Common Python Interview Questions:**
• Difference between list and tuple?
• What are decorators?
• Explain *args and **kwargs
• What is the GIL (Global Interpreter Lock)?
• Mutable vs immutable objects

Need more details on any specific Python topic?`;
    }

    if (lowerQuestion.includes('machine learning') || lowerQuestion.includes('ml') || lowerQuestion.includes('neural') || lowerQuestion.includes('ai')) {
      return `Excellent question about Machine Learning!

**Machine Learning Overview:**

ML is a subset of AI that enables systems to learn from data without explicit programming.

**Types of Machine Learning:**

1. **Supervised Learning**
   • Has labeled training data
   • Goal: Predict output from input
   • Examples:
     - Classification: Spam detection, image recognition
     - Regression: House price prediction, stock prices
   • Algorithms: Linear/Logistic Regression, Decision Trees, Random Forest, SVM, Neural Networks

2. **Unsupervised Learning**
   • No labeled data
   • Goal: Find patterns in data
   • Examples:
     - Clustering: Customer segmentation
     - Dimensionality Reduction: Data visualization
   • Algorithms: K-Means, DBSCAN, PCA, t-SNE

3. **Reinforcement Learning**
   • Learn through trial and error
   • Agent receives rewards/penalties
   • Examples: Game AI, robotics, autonomous vehicles
   • Algorithms: Q-Learning, Deep Q-Networks, Policy Gradients

**Key ML Concepts:**

**Overfitting vs Underfitting:**
• Overfitting: Model memorizes training data (high variance)
  - Solutions: More data, regularization, dropout, early stopping
• Underfitting: Model too simple (high bias)
  - Solutions: More complex model, more features

**Model Evaluation:**
• Accuracy: Correct predictions / Total predictions
• Precision: TP / (TP + FP) - How many predicted positives are correct
• Recall: TP / (TP + FN) - How many actual positives were found
• F1 Score: Harmonic mean of precision and recall
• ROC-AUC: Trade-off between true positive and false positive rates

**Neural Networks:**
\`\`\`
Input Layer → Hidden Layers → Output Layer

Activation Functions:
• ReLU: max(0, x) - Most common
• Sigmoid: 1/(1+e^-x) - Output layer for binary classification
• Tanh: (e^x - e^-x)/(e^x + e^-x) - Hidden layers
• Softmax: For multi-class classification

Training:
1. Forward propagation
2. Calculate loss
3. Backpropagation
4. Update weights with gradient descent
\`\`\`

**Popular Libraries:**
• scikit-learn: Traditional ML
• TensorFlow/Keras: Deep learning
• PyTorch: Research & production
• XGBoost: Gradient boosting

What specific ML topic would you like to explore?`;
    }

    if (lowerQuestion.includes('data structure') || lowerQuestion.includes('algorithm') || lowerQuestion.includes('array') || lowerQuestion.includes('tree')) {
      return `Great question about Data Structures and Algorithms!

**Essential Data Structures:**

1. **Arrays/Lists**
   • Access: O(1)
   • Search: O(n)
   • Insert/Delete: O(n)
   • Use: Sequential access, iteration

2. **Linked Lists**
   \`\`\`
   [Data|Next] → [Data|Next] → [Data|None]
   \`\`\`
   • Access: O(n)
   • Insert/Delete at head: O(1)
   • Use: Dynamic size, frequent insertions

3. **Stacks (LIFO)**
   • push(), pop(), peek()
   • Use: Function calls, undo/redo, DFS, expression evaluation

4. **Queues (FIFO)**
   • enqueue(), dequeue()
   • Use: BFS, task scheduling, message queues

5. **Hash Tables**
   • Average: O(1) for all operations
   • Use: Fast lookups, caching, counting

6. **Trees**
   **Binary Search Tree (BST):**
   • Left < Root < Right
   • Search/Insert/Delete: O(log n) average

   **Balanced Trees (AVL, Red-Black):**
   • Guaranteed O(log n) operations

   **Heaps:**
   • Min-heap: Parent ≤ children
   • Max-heap: Parent ≥ children
   • Insert/Delete: O(log n)
   • Find min/max: O(1)

7. **Graphs**
   • Vertices + Edges
   • Representations:
     - Adjacency Matrix: O(V²) space
     - Adjacency List: O(V + E) space

**Common Algorithms:**

**Sorting:**
\`\`\`
Bubble Sort: O(n²) - Simple but slow
Selection Sort: O(n²) - Minimize swaps
Insertion Sort: O(n²) - Good for small/nearly sorted data
Merge Sort: O(n log n) - Stable, uses extra space
Quick Sort: O(n log n) avg - In-place, unstable
Heap Sort: O(n log n) - In-place, uses heap
\`\`\`

**Searching:**
• Linear Search: O(n) - Any array
• Binary Search: O(log n) - Sorted array only

**Graph Algorithms:**
• BFS (Breadth-First): Queue, shortest path in unweighted
• DFS (Depth-First): Stack/recursion, detect cycles
• Dijkstra: Shortest path with weights (non-negative)
• Bellman-Ford: Shortest path (handles negative weights)
• Kruskal/Prim: Minimum spanning tree

**Dynamic Programming:**
Break problems into overlapping subproblems:
• Fibonacci: O(n) with memoization vs O(2^n) naive
• Knapsack: Maximum value within weight limit
• Longest Common Subsequence
• Edit Distance

**Big O Complexity:**
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!)

**Interview Tips:**
1. Always clarify constraints
2. Start with brute force, then optimize
3. Consider time vs space trade-offs
4. Practice on LeetCode, HackerRank

Which algorithm or data structure would you like to dive deeper into?`;
    }

    if (lowerQuestion.includes('database') || lowerQuestion.includes('sql') || lowerQuestion.includes('query')) {
      return `Excellent question about databases!

**SQL Fundamentals:**

**1. Basic Queries:**
\`\`\`sql
-- SELECT
SELECT column1, column2 FROM table_name;
SELECT * FROM users WHERE age > 25;

-- INSERT
INSERT INTO users (name, email, age)
VALUES ('Alice', 'alice@example.com', 30);

-- UPDATE
UPDATE users SET age = 31 WHERE name = 'Alice';

-- DELETE
DELETE FROM users WHERE age < 18;
\`\`\`

**2. Filtering & Sorting:**
\`\`\`sql
-- WHERE conditions
SELECT * FROM products
WHERE price > 100 AND category = 'Electronics';

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'A%';

-- Sorting
SELECT * FROM products
ORDER BY price DESC, name ASC;

-- Limiting results
SELECT * FROM users LIMIT 10 OFFSET 20;
\`\`\`

**3. Aggregations:**
\`\`\`sql
-- Group by with aggregates
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 50;

-- Common aggregate functions
COUNT(), SUM(), AVG(), MIN(), MAX()
\`\`\`

**4. JOINs:**
\`\`\`sql
-- INNER JOIN (matching rows only)
SELECT u.name, o.order_date, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN (all from left, matching from right)
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- RIGHT JOIN (all from right, matching from left)
-- FULL OUTER JOIN (all from both)
\`\`\`

**5. Subqueries:**
\`\`\`sql
-- Subquery in WHERE
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 1000);

-- Subquery in FROM
SELECT avg_sales.category, avg_sales.avg_price
FROM (
  SELECT category, AVG(price) as avg_price
  FROM products
  GROUP BY category
) as avg_sales
WHERE avg_sales.avg_price > 100;
\`\`\`

**Database Design Principles:**

**Normalization:**
• **1NF**: Atomic values, no repeating groups
• **2NF**: 1NF + no partial dependencies
• **3NF**: 2NF + no transitive dependencies

**Keys:**
• **Primary Key**: Unique identifier (NOT NULL, UNIQUE)
• **Foreign Key**: References primary key in another table
• **Unique Key**: Ensures uniqueness, can be NULL
• **Composite Key**: Multiple columns as primary key

**Indexes:**
\`\`\`sql
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_name_age ON users(name, age);
\`\`\`
• Speed up SELECT queries
• Slow down INSERT/UPDATE/DELETE
• Use on frequently queried columns

**Transactions (ACID):**
• **Atomicity**: All or nothing
• **Consistency**: Valid state transitions
• **Isolation**: Concurrent transactions don't interfere
• **Durability**: Committed changes persist

\`\`\`sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

**SQL vs NoSQL:**

**SQL (Relational):**
• Structured schema
• ACID transactions
• Complex queries with JOINs
• Examples: PostgreSQL, MySQL, SQL Server

**NoSQL:**
• Flexible schema
• Horizontal scaling
• Types:
  - Document: MongoDB, CouchDB
  - Key-Value: Redis, DynamoDB
  - Column: Cassandra, HBase
  - Graph: Neo4j

**Query Optimization:**
1. Use indexes on WHERE/JOIN columns
2. Avoid SELECT *, specify columns
3. Use LIMIT for large datasets
4. Avoid functions in WHERE clause
5. Use EXPLAIN to analyze queries

What specific database topic would you like to explore?`;
    }

    if (lowerQuestion.includes('web') || lowerQuestion.includes('react') || lowerQuestion.includes('html') || lowerQuestion.includes('css') || lowerQuestion.includes('javascript')) {
      return `Great question about Web Development!

**Modern Web Development Stack:**

**1. HTML (Structure)**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <header>
        <nav>Navigation</nav>
    </header>
    <main>
        <section>Content</section>
    </main>
    <footer>Footer</footer>
</body>
</html>
\`\`\`

**2. CSS (Styling)**
\`\`\`css
/* Flexbox */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

/* Grid */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
}
\`\`\`

**3. JavaScript (Behavior)**
\`\`\`javascript
// Modern ES6+ features
const greet = (name) => \`Hello, \${name}!\`;

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);

// Destructuring
const { name, age } = person;
const [first, ...rest] = array;

// Promises & Async/Await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
\`\`\`

**4. React (UI Library)**
\`\`\`jsx
import { useState, useEffect } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = \`Count: \${count}\`;
    }, [count]);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
\`\`\`

**React Hooks:**
• **useState**: Component state
• **useEffect**: Side effects, lifecycle
• **useContext**: Global state access
• **useReducer**: Complex state logic
• **useMemo**: Memoize expensive computations
• **useCallback**: Memoize functions
• **useRef**: DOM references, mutable values

**Component Patterns:**
\`\`\`jsx
// Props
function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}

// Conditional rendering
{isLoggedIn ? <Dashboard /> : <Login />}

// Lists
{items.map(item => <Item key={item.id} {...item} />)}
\`\`\`

**API Integration:**
\`\`\`javascript
// Fetch data
useEffect(() => {
    async function loadData() {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    }
    loadData();
}, []);

// POST request
const createUser = async (userData) => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};
\`\`\`

**State Management:**
• **Context API**: Built-in React
• **Redux**: Predictable state container
• **Zustand**: Lightweight alternative
• **Recoil**: Atom-based state

**Styling Solutions:**
• **Tailwind CSS**: Utility-first framework
• **CSS Modules**: Scoped CSS
• **Styled Components**: CSS-in-JS
• **Sass/SCSS**: CSS preprocessor

**Best Practices:**
1. Component composition over inheritance
2. Keep components small and focused
3. Use TypeScript for type safety
4. Implement proper error handling
5. Optimize with React.memo, lazy loading
6. Follow accessibility guidelines (ARIA)
7. Write tests (Jest, React Testing Library)

**Performance Optimization:**
• Code splitting with lazy()
• Memoization (useMemo, useCallback)
• Virtual scrolling for long lists
• Image optimization
• Bundle size analysis

What specific web development topic interests you?`;
    }

    return `Thank you for your question! Here's a helpful response:

**Understanding Your Topic:**

${question}

**Key Points:**

1. **Foundation**
   Start with the fundamentals. Understanding core concepts is crucial before moving to advanced topics.

2. **Practice**
   Theory is important, but hands-on practice solidifies learning. Build projects to apply concepts.

3. **Resources:**
   • Official documentation
   • Online courses (Udemy, Coursera, edX)
   • YouTube tutorials
   • Practice platforms (LeetCode, HackerRank)
   • Books and blogs

4. **Problem-Solving Approach:**
   • Break down complex problems
   • Start with brute force solutions
   • Optimize iteratively
   • Consider time/space complexity

**Common Study Topics:**

**Programming:**
• Variables, data types, control flow
• Functions and scope
• Object-oriented programming
• Error handling
• Testing and debugging

**Algorithms:**
• Big O notation
• Sorting and searching
• Recursion and iteration
• Dynamic programming
• Greedy algorithms

**System Design:**
• Scalability principles
• Database design
• API design
• Caching strategies
• Load balancing

**Interview Prep:**
• Data structures mastery
• Algorithm problem-solving
• System design scenarios
• Behavioral questions (STAR method)
• Mock interviews

**Tips for Success:**
✓ Consistent daily practice
✓ Learn from mistakes
✓ Explain concepts to others
✓ Build real projects
✓ Join coding communities
✓ Stay updated with tech trends

Would you like more specific information on any topic? Feel free to ask about:
• Programming languages (Python, JavaScript, Java)
• Machine Learning & AI
• Data Structures & Algorithms
• Web Development (React, Node.js)
• Databases (SQL, NoSQL)
• Career advice and interview preparation

I'm here to help you learn!`;
  };

  const handleSendQuestion = () => {
    if (!input.trim() || askLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAskLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      const aiMessage: Message = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, aiMessage]);
      setAskLoading(false);
    }, 1500);
  };

  const generateQuestions = (topic: string, level: string): Question[] => {
    const questionBank: { [key: string]: { [key: string]: Question[] } } = {
      python: {
        easy: [
          {
            id: 1,
            question: 'What is the correct way to create a list in Python?',
            options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
            correctAnswer: 1,
            explanation: 'Square brackets [] are used to create lists in Python. Parentheses () create tuples, and curly braces {} create dictionaries or sets.'
          },
          {
            id: 2,
            question: 'Which keyword is used to define a function in Python?',
            options: ['function', 'def', 'func', 'define'],
            correctAnswer: 1,
            explanation: 'The "def" keyword is used to define functions in Python. For example: def my_function():'
          },
          {
            id: 3,
            question: 'What is the output of: print(type([1, 2, 3]))?',
            options: ['<class \'tuple\'>', '<class \'list\'>', '<class \'array\'>', '<class \'dict\'>'],
            correctAnswer: 1,
            explanation: 'The type() function returns the class type. [1, 2, 3] is a list, so it returns <class \'list\'>.'
          },
          {
            id: 4,
            question: 'How do you start a comment in Python?',
            options: ['//', '/* */', '#', '<!--'],
            correctAnswer: 2,
            explanation: 'In Python, comments start with the # symbol. Everything after # on that line is ignored.'
          },
          {
            id: 5,
            question: 'What does the len() function do?',
            options: ['Lengthens a string', 'Returns the length of an object', 'Creates a new list', 'Loops through items'],
            correctAnswer: 1,
            explanation: 'len() returns the number of items in an object like a list, string, tuple, or dictionary.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is a list comprehension in Python?',
            options: [
              'A way to compress lists',
              'A concise way to create lists based on existing lists',
              'A method to understand lists',
              'A type of data structure'
            ],
            correctAnswer: 1,
            explanation: 'List comprehensions provide a concise way to create lists. For example: [x**2 for x in range(10)] creates a list of squares.'
          },
          {
            id: 2,
            question: 'What is the difference between "==" and "is" in Python?',
            options: [
              'There is no difference',
              '"==" checks value equality, "is" checks identity',
              '"is" checks value equality, "==" checks identity',
              'Both check identity'
            ],
            correctAnswer: 1,
            explanation: '"==" compares values for equality, while "is" checks if two references point to the same object in memory.'
          },
          {
            id: 3,
            question: 'What are *args and **kwargs used for?',
            options: [
              'To multiply numbers',
              'To pass variable numbers of arguments to functions',
              'To create decorators',
              'To define class methods'
            ],
            correctAnswer: 1,
            explanation: '*args allows passing a variable number of positional arguments, **kwargs allows passing a variable number of keyword arguments.'
          },
          {
            id: 4,
            question: 'What is a Python decorator?',
            options: [
              'A way to decorate output',
              'A function that modifies another function',
              'A design pattern',
              'A type of class'
            ],
            correctAnswer: 1,
            explanation: 'Decorators are functions that modify the behavior of other functions. They use the @decorator_name syntax.'
          },
          {
            id: 5,
            question: 'What does the "with" statement do in Python?',
            options: [
              'Creates a loop',
              'Ensures proper resource management',
              'Imports modules',
              'Defines a context'
            ],
            correctAnswer: 1,
            explanation: 'The "with" statement ensures proper acquisition and release of resources, commonly used with file operations.'
          }
        ]
      },
      ml: {
        easy: [
          {
            id: 1,
            question: 'What is supervised learning?',
            options: [
              'Learning without labeled data',
              'Learning with labeled training data',
              'Learning through rewards',
              'Learning by supervision only'
            ],
            correctAnswer: 1,
            explanation: 'Supervised learning uses labeled training data where the correct output is known for each input.'
          },
          {
            id: 2,
            question: 'What is overfitting?',
            options: [
              'Model is too simple',
              'Model memorizes training data too well',
              'Model has too few parameters',
              'Model trains too fast'
            ],
            correctAnswer: 1,
            explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data.'
          },
          {
            id: 3,
            question: 'What is a feature in machine learning?',
            options: [
              'A bug in the code',
              'An input variable used for prediction',
              'The output of the model',
              'A type of algorithm'
            ],
            correctAnswer: 1,
            explanation: 'A feature is an individual measurable property or characteristic used as input for the model.'
          },
          {
            id: 4,
            question: 'What does "training" a model mean?',
            options: [
              'Teaching humans to use the model',
              'Adjusting model parameters based on data',
              'Running the model on test data',
              'Deploying the model'
            ],
            correctAnswer: 1,
            explanation: 'Training involves adjusting the model\'s parameters to minimize error on the training data.'
          },
          {
            id: 5,
            question: 'What is a neural network activation function?',
            options: [
              'A function to activate the network',
              'A function that determines neuron output',
              'A way to start training',
              'A type of layer'
            ],
            correctAnswer: 1,
            explanation: 'Activation functions determine the output of a neural network node given input(s). Examples include ReLU, sigmoid, and tanh.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is the purpose of cross-validation?',
            options: [
              'To validate user input',
              'To assess model performance on unseen data',
              'To cross-check code',
              'To validate training data'
            ],
            correctAnswer: 1,
            explanation: 'Cross-validation splits data into multiple folds to evaluate model performance and reduce overfitting.'
          },
          {
            id: 2,
            question: 'What is the gradient descent algorithm used for?',
            options: [
              'To descend mountains',
              'To minimize the loss function',
              'To increase accuracy',
              'To generate gradients'
            ],
            correctAnswer: 1,
            explanation: 'Gradient descent is an optimization algorithm that iteratively adjusts parameters to minimize the loss function.'
          },
          {
            id: 3,
            question: 'What is the difference between precision and recall?',
            options: [
              'They are the same',
              'Precision is TP/(TP+FP), Recall is TP/(TP+FN)',
              'Precision measures speed, recall measures accuracy',
              'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'Precision measures the accuracy of positive predictions, while recall measures how many actual positives were identified.'
          },
          {
            id: 4,
            question: 'What is regularization in machine learning?',
            options: [
              'Making data regular',
              'Adding penalty terms to prevent overfitting',
              'Normalizing input data',
              'Regular model updates'
            ],
            correctAnswer: 1,
            explanation: 'Regularization adds penalty terms (L1 or L2) to the loss function to prevent overfitting by constraining model complexity.'
          },
          {
            id: 5,
            question: 'What is transfer learning?',
            options: [
              'Transferring data between models',
              'Using a pre-trained model for a new task',
              'Moving models to production',
              'Transferring knowledge between people'
            ],
            correctAnswer: 1,
            explanation: 'Transfer learning uses a model trained on one task as the starting point for a different but related task.'
          }
        ]
      },
      ds: {
        easy: [
          {
            id: 1,
            question: 'What is the time complexity of accessing an element in an array by index?',
            options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
            correctAnswer: 1,
            explanation: 'Array access by index is O(1) - constant time, as elements are stored in contiguous memory.'
          },
          {
            id: 2,
            question: 'What data structure uses LIFO (Last In First Out)?',
            options: ['Queue', 'Stack', 'Array', 'Tree'],
            correctAnswer: 1,
            explanation: 'A stack follows LIFO principle - the last element added is the first one to be removed.'
          },
          {
            id: 3,
            question: 'What is a linked list?',
            options: [
              'A list of links',
              'A sequence of nodes where each points to the next',
              'A type of array',
              'A sorting algorithm'
            ],
            correctAnswer: 1,
            explanation: 'A linked list is a linear data structure where elements are stored in nodes, and each node points to the next.'
          },
          {
            id: 4,
            question: 'What does FIFO stand for in data structures?',
            options: ['First In First Out', 'Fast In Fast Out', 'First In Forever Out', 'Fixed Input Fixed Output'],
            correctAnswer: 0,
            explanation: 'FIFO (First In First Out) is the principle used by queues - first element added is first to be removed.'
          },
          {
            id: 5,
            question: 'What is a hash table used for?',
            options: [
              'Sorting data',
              'Fast key-value lookups',
              'Storing passwords',
              'Creating tables'
            ],
            correctAnswer: 1,
            explanation: 'Hash tables provide O(1) average-case time complexity for insertions, deletions, and lookups.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is the average time complexity of binary search?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'Binary search has O(log n) time complexity as it halves the search space with each iteration.'
          },
          {
            id: 2,
            question: 'In a balanced binary search tree, what is the height?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
            correctAnswer: 1,
            explanation: 'A balanced BST maintains O(log n) height, ensuring efficient search, insertion, and deletion operations.'
          },
          {
            id: 3,
            question: 'What is the purpose of a heap data structure?',
            options: [
              'To store heap memory',
              'To efficiently find min/max elements',
              'To sort arrays',
              'To implement stacks'
            ],
            correctAnswer: 1,
            explanation: 'Heaps are used to efficiently access the minimum (min-heap) or maximum (max-heap) element in O(1) time.'
          },
          {
            id: 4,
            question: 'What is the difference between BFS and DFS?',
            options: [
              'No difference',
              'BFS explores level by level, DFS explores depth first',
              'BFS is faster',
              'DFS uses less memory'
            ],
            correctAnswer: 1,
            explanation: 'BFS (Breadth-First Search) explores nodes level by level, while DFS (Depth-First Search) explores as far as possible along each branch.'
          },
          {
            id: 5,
            question: 'What is amortized time complexity?',
            options: [
              'Average time over many operations',
              'Worst case time',
              'Best case time',
              'Time with memory included'
            ],
            correctAnswer: 0,
            explanation: 'Amortized analysis considers the average time per operation over a sequence of operations.'
          }
        ]
      },
      web: {
        easy: [
          {
            id: 1,
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Markup Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML (Hyper Text Markup Language) is the standard markup language for creating web pages.'
          },
          {
            id: 2,
            question: 'What does CSS stand for?',
            options: [
              'Computer Style Sheets',
              'Cascading Style Sheets',
              'Creative Style Sheets',
              'Colorful Style Sheets'
            ],
            correctAnswer: 1,
            explanation: 'CSS (Cascading Style Sheets) is used to style and layout web pages.'
          },
          {
            id: 3,
            question: 'What is the purpose of the <div> tag?',
            options: [
              'To divide numbers',
              'To define a division or section in HTML',
              'To create divisions in code',
              'To separate pages'
            ],
            correctAnswer: 1,
            explanation: 'The <div> tag is a container used to group and style sections of HTML content.'
          },
          {
            id: 4,
            question: 'Which HTTP method is used to retrieve data?',
            options: ['POST', 'GET', 'PUT', 'DELETE'],
            correctAnswer: 1,
            explanation: 'GET is used to retrieve data from a server. It should not modify server state.'
          },
          {
            id: 5,
            question: 'What is React?',
            options: [
              'A programming language',
              'A JavaScript library for building UIs',
              'A database',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, especially single-page applications.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is the Virtual DOM in React?',
            options: [
              'A virtual reality feature',
              'A lightweight copy of the actual DOM',
              'A database',
              'A testing tool'
            ],
            correctAnswer: 1,
            explanation: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize updates and improve performance.'
          },
          {
            id: 2,
            question: 'What is the purpose of React hooks?',
            options: [
              'To catch fish',
              'To use state and lifecycle in functional components',
              'To create animations',
              'To style components'
            ],
            correctAnswer: 1,
            explanation: 'React hooks like useState and useEffect allow functional components to use state and lifecycle features.'
          },
          {
            id: 3,
            question: 'What is CORS?',
            options: [
              'A programming language',
              'Cross-Origin Resource Sharing security mechanism',
              'A type of database',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'CORS is a security mechanism that allows or restricts web applications from making requests to a different domain.'
          },
          {
            id: 4,
            question: 'What is the difference between let and const in JavaScript?',
            options: [
              'No difference',
              'let allows reassignment, const does not',
              'const is faster',
              'let is deprecated'
            ],
            correctAnswer: 1,
            explanation: 'Variables declared with let can be reassigned, while const creates read-only references.'
          },
          {
            id: 5,
            question: 'What is a RESTful API?',
            options: [
              'An API that rests',
              'An API following REST architectural principles',
              'A sleeping API',
              'A type of database'
            ],
            correctAnswer: 1,
            explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications using HTTP methods.'
          }
        ]
      },
      database: {
        easy: [
          {
            id: 1,
            question: 'What does SQL stand for?',
            options: [
              'Structured Query Language',
              'Simple Query Language',
              'Standard Query Language',
              'Sequential Query Language'
            ],
            correctAnswer: 0,
            explanation: 'SQL (Structured Query Language) is used to communicate with databases.'
          },
          {
            id: 2,
            question: 'Which SQL statement is used to retrieve data?',
            options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
            correctAnswer: 1,
            explanation: 'SELECT is used to query and retrieve data from database tables.'
          },
          {
            id: 3,
            question: 'What is a primary key?',
            options: [
              'The most important key',
              'A unique identifier for table rows',
              'The first column',
              'A key for locking tables'
            ],
            correctAnswer: 1,
            explanation: 'A primary key uniquely identifies each record in a database table and cannot contain NULL values.'
          },
          {
            id: 4,
            question: 'What is a foreign key?',
            options: [
              'A key from another country',
              'A column that references a primary key in another table',
              'An external key',
              'A backup key'
            ],
            correctAnswer: 1,
            explanation: 'A foreign key creates a link between two tables by referencing the primary key of another table.'
          },
          {
            id: 5,
            question: 'What does CRUD stand for?',
            options: [
              'Create, Read, Update, Delete',
              'Copy, Read, Update, Delete',
              'Create, Retrieve, Update, Delete',
              'Copy, Retrieve, Upload, Delete'
            ],
            correctAnswer: 0,
            explanation: 'CRUD represents the four basic operations for persistent storage: Create, Read, Update, Delete.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is database normalization?',
            options: [
              'Making data normal',
              'Organizing data to reduce redundancy',
              'Normalizing values',
              'Backing up data'
            ],
            correctAnswer: 1,
            explanation: 'Normalization organizes database tables to reduce redundancy and improve data integrity through 1NF, 2NF, 3NF, etc.'
          },
          {
            id: 2,
            question: 'What is an index in a database?',
            options: [
              'A table of contents',
              'A data structure to speed up queries',
              'The first column',
              'A backup mechanism'
            ],
            correctAnswer: 1,
            explanation: 'Database indexes improve query performance by creating efficient lookup structures, typically using B-trees.'
          },
          {
            id: 3,
            question: 'What is a JOIN in SQL?',
            options: [
              'Joining tables together',
              'Combining rows from multiple tables based on a condition',
              'Adding new rows',
              'Merging databases'
            ],
            correctAnswer: 1,
            explanation: 'JOINs combine rows from two or more tables based on related columns. Types include INNER, LEFT, RIGHT, and FULL JOINs.'
          },
          {
            id: 4,
            question: 'What does ACID stand for in databases?',
            options: [
              'Atomic, Consistent, Isolated, Durable',
              'Advanced, Consistent, Isolated, Durable',
              'Atomic, Complete, Isolated, Durable',
              'Automatic, Consistent, Integrated, Durable'
            ],
            correctAnswer: 0,
            explanation: 'ACID properties ensure reliable transaction processing: Atomicity, Consistency, Isolation, Durability.'
          },
          {
            id: 5,
            question: 'What is the difference between SQL and NoSQL databases?',
            options: [
              'No difference',
              'SQL is relational and structured, NoSQL is flexible and unstructured',
              'NoSQL is newer',
              'SQL is faster'
            ],
            correctAnswer: 1,
            explanation: 'SQL databases are relational with fixed schemas, while NoSQL databases are flexible and can handle unstructured data.'
          }
        ]
      },
      algorithms: {
        easy: [
          {
            id: 1,
            question: 'What is the time complexity of bubble sort?',
            options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'Bubble sort has O(n²) time complexity in average and worst cases due to nested iterations.'
          },
          {
            id: 2,
            question: 'What is recursion?',
            options: [
              'A loop',
              'A function that calls itself',
              'An error',
              'A sorting method'
            ],
            correctAnswer: 1,
            explanation: 'Recursion is when a function calls itself to solve smaller instances of the same problem.'
          },
          {
            id: 3,
            question: 'What is Big O notation used for?',
            options: [
              'Measuring file sizes',
              'Describing algorithm time/space complexity',
              'Counting operations',
              'Testing algorithms'
            ],
            correctAnswer: 1,
            explanation: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity as input size grows.'
          },
          {
            id: 4,
            question: 'Which is faster: linear search or binary search?',
            options: [
              'Linear search',
              'Binary search',
              'Same speed',
              'Depends on data'
            ],
            correctAnswer: 1,
            explanation: 'Binary search is O(log n) which is faster than linear search O(n), but requires sorted data.'
          },
          {
            id: 5,
            question: 'What is a greedy algorithm?',
            options: [
              'An algorithm that uses a lot of memory',
              'An algorithm that makes locally optimal choices',
              'An algorithm that is very fast',
              'An algorithm that is selfish'
            ],
            correctAnswer: 1,
            explanation: 'Greedy algorithms make the locally optimal choice at each step, hoping to find a global optimum.'
          }
        ],
        medium: [
          {
            id: 1,
            question: 'What is dynamic programming?',
            options: [
              'Programming while moving',
              'Solving problems by breaking them into overlapping subproblems',
              'A programming language',
              'Real-time programming'
            ],
            correctAnswer: 1,
            explanation: 'Dynamic programming solves complex problems by breaking them into simpler overlapping subproblems and storing their solutions.'
          },
          {
            id: 2,
            question: 'What is the time complexity of merge sort?',
            options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
            correctAnswer: 3,
            explanation: 'Merge sort consistently has O(n log n) time complexity through divide-and-conquer approach.'
          },
          {
            id: 3,
            question: 'What is memoization?',
            options: [
              'Memorizing code',
              'Storing results of expensive function calls',
              'A memory leak',
              'A design pattern'
            ],
            correctAnswer: 1,
            explanation: 'Memoization is an optimization technique that stores results of expensive function calls and returns cached results.'
          },
          {
            id: 4,
            question: 'What is Dijkstra\'s algorithm used for?',
            options: [
              'Sorting arrays',
              'Finding shortest paths in graphs',
              'Searching trees',
              'Hashing data'
            ],
            correctAnswer: 1,
            explanation: 'Dijkstra\'s algorithm finds the shortest path between nodes in a graph with non-negative edge weights.'
          },
          {
            id: 5,
            question: 'What is the difference between BFS and Dijkstra\'s algorithm?',
            options: [
              'No difference',
              'BFS is for unweighted graphs, Dijkstra for weighted',
              'BFS is faster',
              'Dijkstra uses less memory'
            ],
            correctAnswer: 1,
            explanation: 'BFS finds shortest paths in unweighted graphs, while Dijkstra handles weighted graphs with non-negative weights.'
          }
        ]
      }
    };

    return questionBank[topic]?.[level] || [];
  };

  const handleGenerateQuiz = () => {
    if (!selectedTopic) return;

    setLoading(true);
    setTimeout(() => {
      const generated = generateQuestions(selectedTopic, difficulty);
      setQuestions(generated);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResults(false);
      setLoading(false);
    }, 1500);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateResults = (): QuizResult => {
    const answers = questions.map(q => ({
      questionId: q.id,
      userAnswer: userAnswers[q.id] ?? -1,
      correct: userAnswers[q.id] === q.correctAnswer
    }));

    const score = answers.filter(a => a.correct).length;
    return { score, total: questions.length, answers };
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setSelectedTopic('');
  };

  const suggestedQuestions = [
    "Explain Python list comprehensions",
    "What is machine learning overfitting?",
    "How does binary search work?",
    "Explain SQL JOIN operations",
    "What are React hooks?",
    "What is Big O notation?",
  ];

  if (mode === 'ask') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Quiz Helper</h1>
                  <p className="text-sm text-gray-600">Ask questions and get instant answers</p>
                </div>
              </div>
              <button
                onClick={() => setMode('quiz')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Take Quiz
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ask Me Anything!</h2>
                <p className="text-gray-600 mb-6">Get detailed explanations on programming, ML, algorithms, and more</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                    >
                      <Lightbulb className="w-4 h-4 text-blue-600 mb-2" />
                      <p className="text-sm text-gray-700">{question}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl rounded-2xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {askLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuestion();
                  }
                }}
                placeholder="Ask about Python, ML, algorithms, databases, web dev..."
                rows={1}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSendQuestion}
                disabled={!input.trim() || askLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <FileQuestion className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Quiz Generator</h1>
                <p className="text-gray-600">Test your knowledge with AI-generated quizzes</p>
              </div>
            </div>
            <button
              onClick={() => setMode('ask')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Ask Questions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Custom Quiz</h2>
              <p className="text-gray-600">Select a topic and difficulty level to generate personalized quiz questions</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Choose a Topic
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        selectedTopic === topic.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{topic.icon}</span>
                        <span className="font-medium text-gray-900">{topic.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Select Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition ${
                        difficulty === level
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={!selectedTopic || loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Generate Quiz (5 Questions)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const percentage = Math.round((results.score / results.total) * 100);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-4xl font-bold ${
                percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>{percentage}%</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">
              You scored {results.score} out of {results.total}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </p>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correctAnswer;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : isUserAnswer
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600 mr-2" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600 mr-2" />}
                                <span className={isCorrectAnswer || isUserAnswer ? 'font-medium' : ''}>
                                  {option}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Another Quiz</span>
            </button>
            <button
              onClick={() => setMode('ask')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition flex items-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Ask Questions</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition ${
                userAnswers[currentQuestion.id] === index
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  userAnswers[currentQuestion.id] === index
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion.id] === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
