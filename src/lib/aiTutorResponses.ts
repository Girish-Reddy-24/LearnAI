export function generateContextualResponse(
  question: string,
  courseTitle?: string,
  moduleTitle?: string
): string {
  const lowerQuestion = question.toLowerCase();

  // Course-specific responses
  if (courseTitle) {
    const courseLower = courseTitle.toLowerCase();

    // Machine Learning course responses
    if (courseLower.includes('machine learning') || courseLower.includes('ml')) {
      if (lowerQuestion.includes('start') || lowerQuestion.includes('begin') || lowerQuestion.includes('introduction')) {
        return `Great! You're starting with Machine Learning. Here's what you need to know for **${moduleTitle || 'this module'}**:

**Key Concepts:**
• **Supervised Learning**: Learning from labeled data (input → output)
  - Classification: Predicting categories (spam/not spam)
  - Regression: Predicting continuous values (house prices)

• **Unsupervised Learning**: Finding patterns in unlabeled data
  - Clustering: Grouping similar items
  - Dimensionality reduction: Simplifying complex data

**Essential Python Libraries:**
\`\`\`python
import numpy as np           # Numerical operations
import pandas as pd          # Data manipulation
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
\`\`\`

**Your First ML Model:**
\`\`\`python
# Load data
X = [[1], [2], [3], [4]]  # Features
y = [2, 4, 6, 8]           # Target

# Train model
model = LinearRegression()
model.fit(X, y)

# Predict
prediction = model.predict([[5]])
print(f"Predicted: {prediction[0]}")  # Output: 10
\`\`\`

**What to Focus On:**
1. Understand the difference between supervised and unsupervised learning
2. Learn how to prepare and clean data
3. Practice with scikit-learn library
4. Start with simple algorithms before moving to complex ones

Ready to move forward? Let me know what specific topic you'd like to explore!`;
      }

      if (lowerQuestion.includes('overfitting') || lowerQuestion.includes('underfit')) {
        return `Excellent question about overfitting and underfitting in Machine Learning!

**Overfitting** 🔴
When your model memorizes training data instead of learning patterns:
• **Problem**: High training accuracy, poor test accuracy
• **Cause**: Model too complex for the amount of data
• **Solutions**:
  - Get more training data
  - Use regularization (L1, L2)
  - Simplify the model
  - Apply dropout (for neural networks)
  - Use cross-validation

**Underfitting** 🔵
When your model is too simple to capture patterns:
• **Problem**: Poor accuracy on both training and test data
• **Cause**: Model too simple or insufficient training
• **Solutions**:
  - Use more complex model
  - Add more features
  - Train longer
  - Reduce regularization

**The Sweet Spot:**
\`\`\`
Underfitting ← → Just Right ← → Overfitting
(Too Simple)    (Perfect)     (Too Complex)
\`\`\`

**Practical Example:**
\`\`\`python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

# Check if model is overfitting
train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5
)

# If training score >> validation score → Overfitting
# If both scores are low → Underfitting
\`\`\`

**Detection Tips:**
• Use train/validation/test split
• Monitor both training and validation metrics
• Plot learning curves
• Apply cross-validation

What specific aspect would you like to explore?`;
      }

      if (lowerQuestion.includes('neural network') || lowerQuestion.includes('deep learning')) {
        return `Great question about Neural Networks!

**Neural Network Basics:**
Neural networks are inspired by the human brain and consist of layers of interconnected nodes (neurons).

**Architecture:**
\`\`\`
Input Layer → Hidden Layers → Output Layer
   [X1]         [N1]  [N3]       [Y1]
   [X2]    →    [N2]  [N4]   →   [Y2]
   [X3]                           [Y3]
\`\`\`

**How It Works:**
1. **Forward Pass**: Data flows through layers
2. **Activation Functions**: Add non-linearity
   - ReLU: max(0, x) - Most common
   - Sigmoid: 1/(1+e^-x) - For probabilities
   - Tanh: Similar to sigmoid but centered at 0
3. **Loss Calculation**: Measure prediction error
4. **Backpropagation**: Update weights to reduce error

**Simple Neural Network in Python:**
\`\`\`python
import tensorflow as tf
from tensorflow import keras

# Create a simple neural network
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=(10,)),
    keras.layers.Dropout(0.2),  # Prevent overfitting
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(3, activation='softmax')  # 3 classes
])

# Compile
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train
model.fit(X_train, y_train, epochs=10, batch_size=32)
\`\`\`

**Key Parameters:**
• **Epochs**: Number of complete passes through data
• **Batch Size**: Number of samples per gradient update
• **Learning Rate**: How fast the model learns
• **Hidden Layers**: More layers = more complexity
• **Neurons per Layer**: More neurons = more capacity

**Common Applications:**
• Image recognition (CNNs)
• Text processing (RNNs, Transformers)
• Game playing (Reinforcement Learning)
• Speech recognition

**Tips for ${moduleTitle || 'your module'}:**
1. Start with simple architectures
2. Use pre-trained models when possible
3. Monitor training/validation loss
4. Experiment with different layer sizes
5. Use GPU for faster training

Need help with a specific neural network concept?`;
      }
    }

    // Python Programming responses
    if (courseLower.includes('python')) {
      if (lowerQuestion.includes('list') || lowerQuestion.includes('array')) {
        return `Let me explain Python Lists for **${moduleTitle || 'this module'}**!

**Lists in Python:**
Lists are ordered, mutable collections that can hold any type of data.

**Creating Lists:**
\`\`\`python
# Empty list
my_list = []
my_list = list()

# With elements
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4]]
\`\`\`

**Common Operations:**
\`\`\`python
# Access elements (0-indexed)
first = numbers[0]      # 1
last = numbers[-1]      # 5

# Slicing
subset = numbers[1:4]   # [2, 3, 4]
reversed_list = numbers[::-1]  # [5, 4, 3, 2, 1]

# Add elements
numbers.append(6)       # Add to end
numbers.insert(0, 0)    # Insert at index
numbers.extend([7, 8])  # Add multiple

# Remove elements
numbers.remove(3)       # Remove first occurrence
popped = numbers.pop()  # Remove and return last
del numbers[0]          # Delete by index

# Search
index = numbers.index(5)     # Find index
count = numbers.count(2)     # Count occurrences
exists = 4 in numbers        # Check existence

# Modify
numbers[0] = 100             # Change element
numbers.sort()               # Sort in place
numbers.reverse()            # Reverse in place
\`\`\`

**List Comprehension** (Powerful!):
\`\`\`python
# Instead of:
squares = []
for x in range(10):
    squares.append(x**2)

# Write:
squares = [x**2 for x in range(10)]

# With condition
evens = [x for x in range(20) if x % 2 == 0]

# Nested
matrix = [[i*j for j in range(3)] for i in range(3)]
\`\`\`

**Common Patterns:**
\`\`\`python
# Get length
length = len(numbers)

# Iterate
for num in numbers:
    print(num)

# Enumerate (with index)
for i, num in enumerate(numbers):
    print(f"Index {i}: {num}")

# Filter and transform
filtered = [x*2 for x in numbers if x > 5]

# Sum, min, max
total = sum(numbers)
minimum = min(numbers)
maximum = max(numbers)
\`\`\`

**Time Complexity:**
• Access by index: O(1)
• Append: O(1)
• Insert: O(n)
• Search: O(n)
• Delete: O(n)

Try practicing with lists in your exercises!`;
      }

      if (lowerQuestion.includes('function') || lowerQuestion.includes('def')) {
        return `Great question about Python Functions!

**Function Basics:**
\`\`\`python
# Simple function
def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")  # "Hello, Alice!"
\`\`\`

**Parameters and Arguments:**
\`\`\`python
# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Bob")                    # "Hello, Bob!"
greet("Bob", "Hi")              # "Hi, Bob!"

# Multiple parameters
def add(a, b):
    return a + b

# Keyword arguments
result = add(b=5, a=3)  # 8

# *args - variable positional arguments
def sum_all(*numbers):
    return sum(numbers)

sum_all(1, 2, 3, 4)  # 10

# **kwargs - variable keyword arguments
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
\`\`\`

**Type Hints** (Python 3.5+):
\`\`\`python
def calculate_area(length: float, width: float) -> float:
    """Calculate rectangle area."""
    return length * width

# With complex types
from typing import List, Dict, Optional

def process_data(items: List[int]) -> Dict[str, int]:
    return {"sum": sum(items), "count": len(items)}

def find_user(user_id: int) -> Optional[str]:
    # Returns string or None
    return users.get(user_id)
\`\`\`

**Lambda Functions** (Anonymous):
\`\`\`python
# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

# Useful with map, filter, sorted
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
\`\`\`

**Decorators** (Advanced):
\`\`\`python
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.2f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(2)
    return "Done"
\`\`\`

**Best Practices for ${moduleTitle || 'this module'}:**
1. Use descriptive function names (verb + noun)
2. Keep functions small and focused (single responsibility)
3. Add docstrings to explain purpose
4. Use type hints for clarity
5. Return values rather than printing

What specific function concept would you like to explore?`;
      }
    }

    // Web Development responses
    if (courseLower.includes('web') || courseLower.includes('react') || courseLower.includes('full stack')) {
      if (lowerQuestion.includes('react') || lowerQuestion.includes('component') || lowerQuestion.includes('jsx')) {
        return `Great question about React! Let me explain for **${moduleTitle || 'this module'}**:

**React Fundamentals:**
React is a JavaScript library for building user interfaces using reusable components.

**Component Basics:**
\`\`\`jsx
// Functional Component (Modern approach)
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function style
const Welcome = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

// Usage
<Welcome name="Alice" />
\`\`\`

**State Management with useState:**
\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
\`\`\`

**Effects with useEffect:**
\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Runs when userId changes
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // Cleanup function
    return () => {
      // Cancel requests, clear timers, etc.
    };
  }, [userId]); // Dependency array

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
\`\`\`

**Props and Children:**
\`\`\`jsx
// Passing props
function Button({ text, onClick, variant = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {text}
    </button>
  );
}

// Using children
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="Profile">
  <p>User information here</p>
  <Button text="Edit" onClick={handleEdit} />
</Card>
\`\`\`

**Conditional Rendering:**
\`\`\`jsx
function Dashboard({ user }) {
  // If/else
  if (!user) {
    return <Login />;
  }

  // Ternary
  return (
    <div>
      {user.isAdmin ? <AdminPanel /> : <UserPanel />}
    </div>
  );

  // && operator (for simple conditions)
  return (
    <div>
      {user.notifications.length > 0 && (
        <NotificationBadge count={user.notifications.length} />
      )}
    </div>
  );
}
\`\`\`

**Lists and Keys:**
\`\`\`jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

**Key React Concepts for ${moduleTitle || 'your module'}:**
1. **Components**: Building blocks of UI
2. **Props**: Pass data down to child components
3. **State**: Component's internal data that can change
4. **Effects**: Side effects (API calls, subscriptions)
5. **Keys**: Unique identifiers for list items
6. **Virtual DOM**: React's performance optimization

**Common Hooks:**
• useState - State management
• useEffect - Side effects
• useContext - Global state
• useRef - DOM references
• useMemo - Memoize expensive calculations
• useCallback - Memoize functions

Need more help with React concepts?`;
      }
    }
  }

  // General topic responses
  if (lowerQuestion.includes('how') && (lowerQuestion.includes('learn') || lowerQuestion.includes('study'))) {
    return `Great question about effective learning! Here are proven strategies:

**Active Learning Techniques:**

1. **The Feynman Technique**
   • Explain the concept in simple terms
   • Identify gaps in your understanding
   • Review and simplify further
   • Use analogies and examples

2. **Spaced Repetition**
   • Review material at increasing intervals
   • Day 1 → Day 3 → Day 7 → Day 14 → Month 1
   • Use flashcards or apps like Anki

3. **Practice-Based Learning**
   • Code along with tutorials
   • Build small projects
   • Solve coding challenges
   • Debug broken code

4. **Project-Based Learning**
   • Start with a clear goal
   • Break into smaller tasks
   • Learn concepts as needed
   • Document your process

**Study Schedule:**
\`\`\`
Daily:
• 25-min focused session (Pomodoro)
• 5-min break
• Repeat 3-4 times
• Take longer break

Weekly:
• Review previous week's material
• Complete 2-3 practice problems
• Build one small project
• Teach concept to someone
\`\`\`

**For ${courseTitle || 'Your Current Course'}:**
1. Watch video content actively (take notes)
2. Pause and try coding examples yourself
3. Experiment by changing parameters
4. Complete all module exercises
5. Build a mini-project using learned concepts

**Avoid These Mistakes:**
❌ Passive watching without coding
❌ Tutorial hell (watching without building)
❌ Skipping the fundamentals
❌ Not reviewing previous material
❌ Comparing yourself to others

**Track Progress:**
• Keep a learning journal
• Note concepts you understand
• Mark topics to review
• Celebrate small wins

What specific learning challenge are you facing?`;
  }

  // Error or debugging questions
  if (lowerQuestion.includes('error') || lowerQuestion.includes('bug') || lowerQuestion.includes('not work') || lowerQuestion.includes('problem')) {
    return `I can help you debug! When facing errors, follow this systematic approach:

**Debugging Process:**

1. **Read the Error Message**
   • Error type (SyntaxError, TypeError, etc.)
   • Line number where error occurred
   • Error description

2. **Common Errors and Fixes:**

**Python Errors:**
\`\`\`python
# IndentationError
# Fix: Check spacing/tabs are consistent
def greet():
    print("Hello")  # Must be indented

# NameError: name 'x' is not defined
# Fix: Define variable before using
x = 10  # Define first
print(x)

# TypeError: unsupported operand type(s)
# Fix: Check data types
age = "25"
age = int(age)  # Convert string to int

# IndexError: list index out of range
# Fix: Check list length
if len(my_list) > index:
    item = my_list[index]
\`\`\`

**JavaScript/React Errors:**
\`\`\`javascript
// Cannot read property of undefined
// Fix: Check if object exists
const user = data?.user;  // Optional chaining
const name = user?.name || 'Guest';

// Too many re-renders
// Fix: Don't call setState directly in render
// Wrong:
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1);  // ❌ Infinite loop
}
// Right:
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
  }, []);  // ✅ Runs once
}
\`\`\`

3. **Debugging Tools:**
   • **Console.log** / **print()**: Check variable values
   • **Debugger**: Set breakpoints, step through code
   • **Browser DevTools**: Inspect elements, network
   • **Error stack trace**: Follow the call stack

4. **Systematic Approach:**
   • Isolate the problem (remove code until it works)
   • Check recent changes
   • Google the exact error message
   • Read documentation
   • Ask specific questions

**For ${moduleTitle || 'Your Module'}:**
• Review the module's code examples
• Check syntax matches your language version
• Verify all imports/dependencies
• Test with simple examples first

What specific error are you encountering? Share the error message and I'll help you fix it!`;
  }

  // Default contextual response
  return `I'm here to help you with **${courseTitle || 'your course'}**${moduleTitle ? `, specifically for the module: "${moduleTitle}"` : ''}!

Your question: "${question}"

**Let me help you understand:**

This topic is an important part of your learning journey. ${courseTitle ? `In ${courseTitle}, ` : ''}understanding this concept will help you build a strong foundation.

**Key Points to Consider:**

1. **Break It Down**
   Start with the basics and gradually build complexity. Don't try to understand everything at once.

2. **Practical Application**
   The best way to learn is by doing. Try to implement what you're learning in small projects or exercises.

3. **Connect the Dots**
   Relate this concept to what you've already learned in previous modules. Everything builds on fundamentals.

4. **Practice Deliberately**
   Focus on areas where you struggle. Mistakes are learning opportunities!

**Suggested Next Steps:**
• Review the module content one more time
• Try the practice exercises
• Build a mini-project using this concept
• Explain it to someone else (or yourself!)
• Ask me more specific questions as they come up

**For Better Help, You Can Ask:**
• "Explain [specific concept] with examples"
• "How do I implement [feature]?"
• "What's the difference between [A] and [B]?"
• "Can you show me code for [task]?"
• "I'm getting [error], how do I fix it?"

What specific aspect of "${question}" would you like me to explain in detail?`;
}
