export const topicResponses: Record<string, string> = {
  python: `Great question about Python! Let me help you with that.

**Python Programming Fundamentals:**

Python is a versatile, high-level programming language known for its readability and simplicity.

**Core Concepts:**
• Variables & Data Types: int, float, str, list, dict, tuple, set
• Control Flow: if/elif/else, for/while loops
• Functions: def keyword, *args, **kwargs
• OOP: Classes, inheritance, encapsulation

**Example:**
\`\`\`python
def calculate_average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)

squares = [x**2 for x in range(10)]
student = {"name": "Alex", "grade": 95}
\`\`\`

**Best Practices:**
1. Follow PEP 8 style guide
2. Use meaningful variable names
3. Write docstrings
4. Handle exceptions with try/except
5. Use virtual environments

Would you like me to explain any specific Python concept in more detail?`,

  ml: `Excellent question about Machine Learning!

**ML Overview:**
Machine Learning enables systems to learn from experience without being explicitly programmed.

**Types:**
1. **Supervised Learning**: Labeled data (Classification, Regression)
2. **Unsupervised Learning**: Find patterns (Clustering, PCA)
3. **Reinforcement Learning**: Learn through rewards

**Neural Networks:**
• Structure: Input → Hidden → Output layers
• Activation: ReLU, Sigmoid, Tanh, Softmax
• Training: Backpropagation + Gradient Descent
• Types: CNN (images), RNN (sequences), Transformers (NLP)

**Key Concepts:**
• Overfitting: Use regularization, dropout
• Cross-validation: K-fold for robust evaluation
• Hyperparameter tuning: Grid/Random search

**Libraries:** scikit-learn, TensorFlow, PyTorch, pandas, numpy

Need help with a specific ML concept?`,

  dsa: `Great question about Data Structures and Algorithms!

**Data Structures:**
1. Arrays: O(1) access, O(n) search
2. Linked Lists: O(1) insert at head
3. Stacks (LIFO): push, pop, peek - DFS, undo
4. Queues (FIFO): enqueue, dequeue - BFS
5. Hash Tables: O(1) average - fast lookups
6. Trees: Binary, BST, AVL - hierarchical data
7. Heaps: O(log n) insert, O(1) find min/max
8. Graphs: Adjacency matrix/list - networks

**Algorithms:**
• Sorting: Merge O(n log n), Quick O(n log n) avg
• Searching: Binary O(log n) on sorted arrays
• Graph: DFS/BFS O(V+E), Dijkstra O((V+E)log V)
• Dynamic Programming: Memoization, Tabulation

Which would you like to explore further?`,

  database: `Excellent question about databases!

**SQL Databases:**
• Structured tables with ACID properties
• Examples: PostgreSQL, MySQL, SQLite

**Key SQL:**
\`\`\`sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

SELECT s.name, c.title, e.grade
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE e.grade > 80;
\`\`\`

**Design:**
• Normalization: 1NF, 2NF, 3NF
• Primary/Foreign Keys
• Indexes for performance

**NoSQL:**
• Document: MongoDB (JSON docs)
• Key-Value: Redis (caching)
• Graph: Neo4j (relationships)

**Optimization:**
1. Index frequently queried columns
2. Avoid SELECT *
3. Use EXPLAIN for query plans
4. Connection pooling
5. Caching with Redis

Need more details on any concept?`,

  web: `Great question about web development!

**Frontend:**
• HTML/CSS/JavaScript foundation
• React: Component-based UI
• Hooks: useState, useEffect, useContext
• Styling: Tailwind CSS, CSS Modules

**React Example:**
\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>;
}
\`\`\`

**Backend:**
• Node.js + Express for APIs
• REST: GET, POST, PUT, DELETE
• Authentication: JWT, OAuth
• Database integration

**Full Stack:**
• State Management: Redux, Zustand
• Build Tools: Vite, Webpack
• Testing: Jest, React Testing Library
• TypeScript for type safety

**Best Practices:**
1. Component composition
2. Small, focused components
3. Error boundaries
4. Performance optimization
5. Accessibility (ARIA)

What aspect would you like to explore?`,

  career: `Great question about career development!

**Tech Career Paths:**
1. Software Engineer: $80K-$200K+ (Programming, algorithms, system design)
2. Data Scientist: $90K-$180K+ (Statistics, ML, Python, SQL)
3. ML Engineer: $100K-$220K+ (Deep learning, MLOps)
4. Full Stack Dev: $75K-$160K+ (Frontend + Backend + DB)
5. Cloud Architect: $120K-$200K+ (AWS/Azure, security)

**Interview Prep:**
• Coding: LeetCode daily (Easy → Medium → Hard)
• System Design: Scalability, caching, load balancing
• Behavioral: STAR method examples

**Job Search:**
1. Build portfolio projects
2. Contribute to open source
3. Network on LinkedIn
4. Apply to 5-10 positions daily

**Resources:**
• LeetCode, HackerRank
• System Design Primer (GitHub)
• "Cracking the Coding Interview"

**Certifications:** AWS, Google Cloud, Azure, TensorFlow

What specific area needs guidance?`,

  cloud: `Excellent question about cloud computing!

**Cloud Providers:**
1. AWS: EC2, S3, RDS, Lambda, CloudFront
2. Azure: VMs, Storage, SQL DB, Functions
3. GCP: Compute, Storage, SQL, Functions

**Service Models:**
• IaaS: Full infrastructure control (EC2, VMs)
• PaaS: Managed runtime (Heroku, App Engine)
• SaaS: Ready apps (Gmail, Salesforce)

**DevOps:**
• CI/CD: GitHub Actions, Jenkins
• Containers: Docker, Kubernetes
• IaC: Terraform, CloudFormation
• Monitoring: Prometheus, Grafana

**Docker Example:**
\`\`\`dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

**Best Practices:**
1. Automate everything
2. Infrastructure as Code
3. Monitor and log
4. Security first
5. Regular backups

**Security:** IAM, encryption, security groups, audits

Would you like to dive deeper into any topic?`,
};

export function generateIntelligentResponse(question: string, courseInfo: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('python') || lowerQuestion.includes('programming')) {
    return topicResponses.python;
  }
  if (lowerQuestion.includes('machine learning') || lowerQuestion.includes('ml') ||
      lowerQuestion.includes('neural network') || lowerQuestion.includes('ai')) {
    return topicResponses.ml;
  }
  if (lowerQuestion.includes('data structure') || lowerQuestion.includes('algorithm') ||
      lowerQuestion.includes('sorting') || lowerQuestion.includes('array') ||
      lowerQuestion.includes('tree') || lowerQuestion.includes('graph')) {
    return topicResponses.dsa;
  }
  if (lowerQuestion.includes('database') || lowerQuestion.includes('sql') || lowerQuestion.includes('query')) {
    return topicResponses.database;
  }
  if (lowerQuestion.includes('web') || lowerQuestion.includes('react') ||
      lowerQuestion.includes('frontend') || lowerQuestion.includes('html') ||
      lowerQuestion.includes('css') || lowerQuestion.includes('javascript')) {
    return topicResponses.web;
  }
  if (lowerQuestion.includes('career') || lowerQuestion.includes('job') || lowerQuestion.includes('interview')) {
    return topicResponses.career;
  }
  if (lowerQuestion.includes('cloud') || lowerQuestion.includes('aws') ||
      lowerQuestion.includes('azure') || lowerQuestion.includes('devops')) {
    return topicResponses.cloud;
  }

  return `That's an interesting question! Let me help you with "${question}".

${courseInfo ? `**Context:** ${courseInfo}\n\n` : ""}**Understanding the Topic:**

**Key Principles:**

1. **Foundation First**: Break down complex topics into manageable pieces
2. **Practical Application**: Implement through projects and exercises
3. **Resources**: Documentation, courses, tutorials, practice platforms
4. **Best Practices**: Clean code, testing, continuous learning

**Study Strategy:**
• Spaced Repetition & Active Recall
• Feynman Technique: Explain in simple terms
• Pomodoro: 25-min focused sessions
• Project-Based Learning

**Next Steps:**
1. Research the topic thoroughly
2. Find examples and tutorials
3. Practice with hands-on coding
4. Build a project applying the concept
5. Discuss with peers/mentors

**Topics I can help with:**
• Programming (Python, JavaScript, Java)
• Algorithms & Data Structures
• Web Development (React, Node.js)
• Machine Learning & AI
• Databases & SQL
• Cloud & DevOps
• Career & Interview Prep

What specific aspect would you like to explore?`;
}
