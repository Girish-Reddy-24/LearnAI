import { useState } from 'react';
import { Brain, Send, Sparkles, BookOpen, Code, Database, Lightbulb, TrendingUp } from 'lucide-react';
import { apiService } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAIResponse = (question: string): string => {
    return generateContextualResponse(question);
  };

  const legacyGenerateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('python') || lowerQuestion.includes('programming')) {
      return `Great question about Python programming! Let me help you with that.

**Python** is a versatile, high-level programming language known for its readability and simplicity. Here are some key points:

**Core Concepts:**
• **Variables & Data Types**: Python is dynamically typed, supporting int, float, str, list, dict, tuple, and set
• **Control Flow**: if/elif/else statements, for and while loops
• **Functions**: Defined with \`def\` keyword, support default parameters and *args, **kwargs
• **Object-Oriented**: Classes, inheritance, encapsulation, polymorphism

**Example Code:**
\`\`\`python
# Function with type hints
def calculate_average(numbers: list[float]) -> float:
    return sum(numbers) / len(numbers)

# List comprehension
squares = [x**2 for x in range(10)]

# Dictionary usage
student = {"name": "Alex", "grade": 95}
\`\`\`

**Best Practices:**
1. Follow PEP 8 style guide
2. Use meaningful variable names
3. Write docstrings for functions
4. Handle exceptions with try/except
5. Use virtual environments for projects

Would you like me to explain any specific Python concept in more detail?`;
    }

    if (lowerQuestion.includes('machine learning') || lowerQuestion.includes('ml') || lowerQuestion.includes('neural network')) {
      return `Excellent question about Machine Learning! Let me break this down for you.

**Machine Learning Overview:**
Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

**Types of ML:**

1. **Supervised Learning**
   • Labeled training data
   • Examples: Classification, Regression
   • Algorithms: Linear Regression, Decision Trees, Random Forest, SVM, Neural Networks

2. **Unsupervised Learning**
   • Unlabeled data, find patterns
   • Examples: Clustering, Dimensionality Reduction
   • Algorithms: K-Means, DBSCAN, PCA, t-SNE

3. **Reinforcement Learning**
   • Learn through rewards/penalties
   • Examples: Game playing, Robotics
   • Algorithms: Q-Learning, Deep Q-Networks (DQN)

**Neural Networks:**
• **Structure**: Input layer → Hidden layers → Output layer
• **Activation Functions**: ReLU, Sigmoid, Tanh, Softmax
• **Training**: Backpropagation + Gradient Descent
• **Types**: CNN (images), RNN/LSTM (sequences), Transformers (NLP)

**Key Concepts:**
• **Overfitting**: Model memorizes training data → use regularization, dropout
• **Underfitting**: Model too simple → increase complexity
• **Cross-validation**: K-fold validation for robust evaluation
• **Hyperparameter tuning**: Grid search, Random search, Bayesian optimization

**Common Libraries:**
• **scikit-learn**: Traditional ML algorithms
• **TensorFlow/Keras**: Deep learning
• **PyTorch**: Research and production DL
• **pandas/numpy**: Data manipulation

Need help with a specific ML algorithm or concept?`;
    }

    if (lowerQuestion.includes('data structure') || lowerQuestion.includes('algorithm')) {
      return `Great question about Data Structures and Algorithms!

**Fundamental Data Structures:**

1. **Arrays/Lists**
   • Time: Access O(1), Search O(n), Insert/Delete O(n)
   • Use: Sequential data, iteration

2. **Linked Lists**
   • Time: Access O(n), Insert/Delete O(1) at head
   • Use: Dynamic size, frequent insertions

3. **Stacks (LIFO)**
   • Operations: push(), pop(), peek()
   • Use: Function calls, undo mechanisms, DFS

4. **Queues (FIFO)**
   • Operations: enqueue(), dequeue()
   • Use: Task scheduling, BFS

5. **Hash Tables/Dictionaries**
   • Time: Average O(1) for all operations
   • Use: Fast lookups, counting, caching

6. **Trees**
   • **Binary Trees**: Each node has ≤2 children
   • **BST**: Left < Root < Right
   • **AVL/Red-Black**: Self-balancing
   • Use: Hierarchical data, searching

7. **Heaps**
   • Min-heap/Max-heap
   • Time: Insert/Delete O(log n), Find min/max O(1)
   • Use: Priority queues

8. **Graphs**
   • Directed/Undirected
   • Representations: Adjacency matrix, list
   • Use: Networks, relationships

**Common Algorithms:**

**Sorting:**
• Bubble Sort: O(n²) - Simple but slow
• Merge Sort: O(n log n) - Divide and conquer
• Quick Sort: O(n log n) average - In-place
• Heap Sort: O(n log n) - Uses heap structure

**Searching:**
• Linear Search: O(n)
• Binary Search: O(log n) - Sorted arrays only

**Graph Algorithms:**
• DFS/BFS: O(V + E)
• Dijkstra: O((V + E) log V) - Shortest path
• Kruskal/Prim: O(E log E) - Minimum spanning tree

**Dynamic Programming:**
• Memoization (top-down)
• Tabulation (bottom-up)
• Examples: Fibonacci, Knapsack, LCS

Which data structure or algorithm would you like to explore further?`;
    }

    if (lowerQuestion.includes('database') || lowerQuestion.includes('sql')) {
      return `Excellent question about databases! Let me explain.

**Database Fundamentals:**

**Relational Databases (SQL):**
• Structured data in tables (rows & columns)
• ACID properties: Atomicity, Consistency, Isolation, Durability
• Examples: PostgreSQL, MySQL, SQLite, SQL Server

**SQL Key Concepts:**

1. **DDL (Data Definition Language)**
   \`\`\`sql
   CREATE TABLE students (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE,
     enrolled_date DATE DEFAULT CURRENT_DATE
   );
   \`\`\`

2. **DML (Data Manipulation Language)**
   \`\`\`sql
   -- Insert
   INSERT INTO students (name, email) VALUES ('Alice', 'alice@example.com');

   -- Update
   UPDATE students SET name = 'Alice Smith' WHERE id = 1;

   -- Delete
   DELETE FROM students WHERE id = 1;
   \`\`\`

3. **Queries**
   \`\`\`sql
   -- Select with JOIN
   SELECT s.name, c.title, e.grade
   FROM students s
   JOIN enrollments e ON s.id = e.student_id
   JOIN courses c ON c.id = e.course_id
   WHERE e.grade > 80;

   -- Aggregation
   SELECT course_id, AVG(grade) as avg_grade, COUNT(*) as total
   FROM enrollments
   GROUP BY course_id
   HAVING AVG(grade) > 75;
   \`\`\`

**Database Design:**
• **Normalization**: 1NF, 2NF, 3NF - reduce redundancy
• **Primary Keys**: Unique identifier for each row
• **Foreign Keys**: Establish relationships between tables
• **Indexes**: Speed up queries (B-tree, Hash indexes)

**NoSQL Databases:**
• **Document**: MongoDB, Couchbase - JSON-like documents
• **Key-Value**: Redis, DynamoDB - Simple key-value pairs
• **Column-Family**: Cassandra - Wide column stores
• **Graph**: Neo4j - Nodes and relationships

**When to use SQL vs NoSQL:**
• **SQL**: Complex queries, transactions, structured data, ACID requirements
• **NoSQL**: Flexibility, horizontal scaling, high write throughput, unstructured data

**Performance Optimization:**
1. Use indexes on frequently queried columns
2. Avoid SELECT * - specify columns
3. Use EXPLAIN to analyze query plans
4. Denormalize for read-heavy workloads
5. Use connection pooling
6. Implement caching (Redis)

Need more details on any database concept?`;
    }

    if (lowerQuestion.includes('web development') || lowerQuestion.includes('react') || lowerQuestion.includes('frontend')) {
      return `Great question about web development! Let me help you understand this better.

**Modern Web Development Stack:**

**Frontend (Client-Side):**

1. **HTML/CSS/JavaScript** - The foundation
   • HTML: Structure
   • CSS: Styling (Flexbox, Grid, Animations)
   • JavaScript: Interactivity (ES6+ features)

2. **React** - Component-based UI library
   \`\`\`jsx
   // Functional Component with Hooks
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

**React Key Concepts:**
• **JSX**: JavaScript XML syntax
• **Components**: Reusable UI pieces
• **Props**: Pass data to child components
• **State**: Component-level data management
• **Hooks**: useState, useEffect, useContext, useReducer, useMemo
• **Context API**: Global state management
• **React Router**: Client-side routing

3. **Styling Solutions:**
   • Tailwind CSS: Utility-first CSS framework
   • Styled Components: CSS-in-JS
   • CSS Modules: Scoped CSS
   • SASS/SCSS: CSS preprocessor

**Backend (Server-Side):**

1. **Node.js + Express**
   \`\`\`javascript
   const express = require('express');
   const app = express();

   app.get('/api/users', async (req, res) => {
     const users = await db.query('SELECT * FROM users');
     res.json(users);
   });

   app.listen(3000);
   \`\`\`

2. **RESTful API Design:**
   • GET /api/resources - Fetch all
   • GET /api/resources/:id - Fetch one
   • POST /api/resources - Create
   • PUT/PATCH /api/resources/:id - Update
   • DELETE /api/resources/:id - Delete

**Full Stack Concepts:**
• **Authentication**: JWT tokens, OAuth, Sessions
• **Authorization**: Role-based access control (RBAC)
• **API Security**: CORS, Rate limiting, Input validation
• **State Management**: Redux, Zustand, Recoil
• **Build Tools**: Vite, Webpack, Babel
• **Version Control**: Git, GitHub workflow

**Best Practices:**
1. Component composition over inheritance
2. Keep components small and focused
3. Use TypeScript for type safety
4. Implement error boundaries
5. Optimize performance (React.memo, lazy loading)
6. Follow accessibility guidelines (ARIA)
7. Write tests (Jest, React Testing Library)

What specific aspect of web development would you like to explore?`;
    }

    if (lowerQuestion.includes('help') || lowerQuestion.includes('how') || lowerQuestion.includes('what') || lowerQuestion.includes('explain')) {
      return `I'm here to help you learn! I can assist with:

**📚 Computer Science Topics:**
• Programming Languages (Python, JavaScript, Java, C++)
• Data Structures & Algorithms
• Object-Oriented Programming
• Functional Programming

**🤖 AI & Machine Learning:**
• Machine Learning fundamentals
• Neural Networks & Deep Learning
• Natural Language Processing
• Computer Vision

**💾 Databases & Backend:**
• SQL & NoSQL databases
• Database design & optimization
• REST APIs & GraphQL
• Server architecture

**🌐 Web Development:**
• Frontend: HTML, CSS, JavaScript, React
• Backend: Node.js, Express, Python/Flask
• Full-stack development
• Web security best practices

**☁️ Cloud & DevOps:**
• AWS, Azure, GCP services
• Docker & Kubernetes
• CI/CD pipelines
• Infrastructure as Code

**📊 Data Science:**
• Data analysis with Pandas
• Data visualization
• Statistical analysis
• Big Data technologies

**💡 Study Tips:**
• Breaking down complex topics
• Practice problem strategies
• Project ideas
• Career guidance

Just ask me any specific question, and I'll provide detailed explanations with examples!

What would you like to learn about?`;
    }

    if (lowerQuestion.includes('career') || lowerQuestion.includes('job') || lowerQuestion.includes('interview')) {
      return `Great question about career development! Let me help you.

**Career Paths in Tech:**

1. **Software Engineer**
   • Skills: Programming, algorithms, system design
   • Salary Range: $80K - $200K+
   • Companies: Google, Meta, Amazon, startups

2. **Data Scientist**
   • Skills: Statistics, ML, Python, SQL, visualization
   • Salary Range: $90K - $180K+
   • Industries: Finance, Healthcare, E-commerce

3. **ML Engineer**
   • Skills: Deep learning, model deployment, MLOps
   • Salary Range: $100K - $220K+
   • Growing demand in AI companies

4. **Full Stack Developer**
   • Skills: Frontend + Backend + Database
   • Salary Range: $75K - $160K+
   • Versatile role in startups and enterprises

5. **Cloud Architect**
   • Skills: AWS/Azure/GCP, networking, security
   • Salary Range: $120K - $200K+
   • High demand for cloud expertise

**Interview Preparation:**

**Technical Interviews:**
1. **Coding (LeetCode style)**
   • Arrays, Strings, Hash Tables
   • Trees, Graphs, Dynamic Programming
   • Practice: Easy → Medium → Hard
   • Target: 2-3 problems daily

2. **System Design**
   • Scalability, load balancing
   • Database sharding
   • Caching strategies (Redis, CDN)
   • Microservices architecture

3. **Behavioral Questions**
   • STAR method (Situation, Task, Action, Result)
   • Leadership examples
   • Conflict resolution
   • Team collaboration

**Resume Tips:**
• Quantify achievements (improved performance by 40%)
• Highlight relevant projects with tech stack
• Include GitHub with quality projects
• Tailor for each application

**Job Search Strategy:**
1. Build portfolio projects
2. Contribute to open source
3. Network on LinkedIn
4. Apply to 5-10 positions daily
5. Prepare for rejections (it's normal!)

**Resources:**
• LeetCode, HackerRank for coding practice
• System Design Primer on GitHub
• "Cracking the Coding Interview" book
• Mock interviews with peers

**Certifications that Help:**
• AWS Certified Solutions Architect
• Google Cloud Professional
• Microsoft Azure Certifications
• TensorFlow Developer Certificate

What specific area would you like guidance on?`;
    }

    return `That's an interesting question! Let me help you with that.

**Understanding Your Question:**
${question}

**Key Points to Consider:**

1. **Foundation First**
   Start by understanding the fundamental concepts. Break down complex topics into smaller, manageable pieces.

2. **Practical Application**
   Theory is important, but practice is crucial. Try to implement what you're learning through small projects or exercises.

3. **Learning Resources**
   • Official documentation
   • Online courses (Coursera, Udemy, edX)
   • YouTube tutorials
   • Books and research papers
   • Practice platforms (LeetCode, HackerRank)

4. **Best Practices**
   • Write clean, readable code
   • Comment your code appropriately
   • Test your implementations
   • Learn from others' code
   • Stay updated with industry trends

**Study Tips:**
• **Spaced Repetition**: Review material at increasing intervals
• **Active Recall**: Test yourself instead of passive reading
• **Feynman Technique**: Explain concepts in simple terms
• **Pomodoro Technique**: 25-min focused sessions with breaks

**Next Steps:**
1. Research this topic in depth
2. Find relevant examples and tutorials
3. Practice with hands-on coding
4. Build a small project applying this concept
5. Discuss with peers or mentors

Would you like me to elaborate on any specific aspect? Feel free to ask more detailed questions about:
• Programming concepts
• Algorithms and data structures
• Web development
• Machine learning
• Databases
• System design
• Career advice

I'm here to help you succeed in your learning journey!`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const result = await apiService.askAITutor(
        userMessage.content,
        undefined,
        undefined,
        conversationHistory
      );

      const aiMessage: Message = {
        role: 'assistant',
        content: result.response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Explain Python programming basics",
    "How do neural networks work?",
    "What are data structures and algorithms?",
    "Explain SQL databases",
    "How to prepare for technical interviews?",
    "What is React and how does it work?",
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
              <p className="text-sm text-gray-600">Your personal learning assistant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h2>
              <p className="text-gray-600 mb-6">Ask me anything about your courses, programming, AI, databases, and more!</p>

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

              <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Code className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700 font-medium">Programming</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700 font-medium">AI & ML</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Database className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700 font-medium">Databases</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700 font-medium">Web Dev</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-700 font-medium">Career</p>
                </div>
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
          {loading && (
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
                  handleSend();
                }
              }}
              placeholder="Ask me anything about programming, AI, databases, web development..."
              rows={1}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
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
