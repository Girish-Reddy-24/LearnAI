"""
AI Service module for AI-powered features.
This module contains placeholder logic for AI features that can later be
connected to Google AI Studio / Gemini or other AI services.
"""

from datetime import datetime
from typing import List, Dict
import random


# ============================================
# AI TUTOR SERVICE
# ============================================

def generate_ai_tutor_response(student_id: int, message: str) -> str:
    """
    Generate a response from the AI tutor.

    TODO: Replace this with actual Google AI Studio / Gemini API call.
    For now, this returns intelligent mock responses based on keywords.

    Args:
        student_id: The student's ID
        message: The student's question

    Returns:
        AI-generated response text
    """
    message_lower = message.lower()

    # Keyword-based intelligent responses
    if any(word in message_lower for word in ['python', 'programming', 'code']):
        return """Great question about Python programming! Here's what you need to know:

**Python Basics:**
Python is a high-level, interpreted language known for its readability. Key concepts include:

• **Variables & Data Types**: int, float, str, list, dict, tuple, set
• **Control Flow**: if/elif/else, for loops, while loops
• **Functions**: Use `def` to define reusable code blocks
• **Object-Oriented Programming**: Classes, inheritance, encapsulation

**Example:**
```python
def calculate_average(numbers):
    return sum(numbers) / len(numbers)

scores = [85, 90, 78, 92]
print(f"Average: {calculate_average(scores)}")
```

**Best Practices:**
1. Follow PEP 8 style guide
2. Use meaningful variable names
3. Add docstrings to functions
4. Handle exceptions with try/except

Would you like me to explain any specific concept in more detail?"""

    elif any(word in message_lower for word in ['machine learning', 'ml', 'model']):
        return """Excellent question about Machine Learning!

**Machine Learning Overview:**
ML is about teaching computers to learn from data without explicit programming.

**Types of ML:**

1. **Supervised Learning**
   • Labeled training data
   • Examples: Classification, Regression
   • Algorithms: Linear Regression, Decision Trees, Random Forest, SVM

2. **Unsupervised Learning**
   • Unlabeled data, find patterns
   • Examples: Clustering, Dimensionality Reduction
   • Algorithms: K-Means, PCA, DBSCAN

3. **Reinforcement Learning**
   • Learn through rewards/penalties
   • Examples: Game AI, Robotics

**Key Concepts:**
• **Overfitting**: Model memorizes training data → Use regularization, cross-validation
• **Underfitting**: Model too simple → Increase complexity
• **Cross-validation**: K-fold validation for robust evaluation

**Popular Libraries:**
• scikit-learn: Traditional ML
• TensorFlow/Keras: Deep learning
• PyTorch: Research and production

What specific ML topic would you like to explore?"""

    elif any(word in message_lower for word in ['data structure', 'algorithm']):
        return """Great question about Data Structures and Algorithms!

**Essential Data Structures:**

1. **Arrays/Lists** - O(1) access, O(n) search
2. **Linked Lists** - O(1) insertion at head, O(n) access
3. **Stacks (LIFO)** - push(), pop(), peek()
4. **Queues (FIFO)** - enqueue(), dequeue()
5. **Hash Tables** - O(1) average for all operations
6. **Trees** - Binary Search Trees, AVL, Red-Black
7. **Graphs** - Adjacency matrix/list representation

**Common Algorithms:**

**Sorting:**
• Bubble Sort: O(n²)
• Merge Sort: O(n log n)
• Quick Sort: O(n log n) average

**Searching:**
• Linear Search: O(n)
• Binary Search: O(log n) - requires sorted array

**Graph Algorithms:**
• BFS/DFS: O(V + E)
• Dijkstra: O((V + E) log V)

**Big O Notation:**
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!)

Which data structure or algorithm would you like to explore further?"""

    elif any(word in message_lower for word in ['sql', 'database', 'query']):
        return """Excellent question about databases!

**SQL Fundamentals:**

**Basic Queries:**
```sql
-- SELECT data
SELECT column1, column2 FROM table_name WHERE condition;

-- INSERT data
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- UPDATE data
UPDATE users SET email = 'new@email.com' WHERE id = 1;

-- DELETE data
DELETE FROM users WHERE id = 1;
```

**JOINs:**
```sql
-- INNER JOIN (matching rows)
SELECT u.name, o.order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN (all from left + matching from right)
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

**Aggregations:**
```sql
SELECT category, COUNT(*), AVG(price)
FROM products
GROUP BY category
HAVING AVG(price) > 50;
```

**Key Concepts:**
• **Primary Key**: Unique identifier
• **Foreign Key**: Links tables
• **Indexes**: Speed up queries
• **Normalization**: 1NF, 2NF, 3NF
• **ACID**: Atomicity, Consistency, Isolation, Durability

Would you like more details on any SQL topic?"""

    elif any(word in message_lower for word in ['react', 'web', 'frontend', 'javascript']):
        return """Great question about Web Development!

**React Fundamentals:**

**Components:**
```jsx
function Greeting({ name }) {
    return <h1>Hello, {name}!</h1>;
}
```

**State Management:**
```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

**useEffect Hook:**
```jsx
useEffect(() => {
    // Side effects here
    document.title = `Count: ${count}`;
}, [count]); // Dependency array
```

**Key Concepts:**
• **Props**: Pass data to child components
• **State**: Component-level data
• **Hooks**: useState, useEffect, useContext
• **JSX**: JavaScript XML syntax
• **Virtual DOM**: Efficient updates

**Best Practices:**
1. Keep components small and focused
2. Use functional components with hooks
3. Lift state up when needed
4. Use proper key props in lists

What specific React concept would you like me to explain?"""

    else:
        # Generic helpful response
        return f"""Thank you for your question! I'm here to help you learn.

**Understanding Your Question:**
{message}

**Here's how I can assist:**

• **Programming**: Python, JavaScript, Java, algorithms
• **Data Science**: ML, data analysis, visualization
• **Databases**: SQL, database design, optimization
• **Web Development**: React, HTML/CSS, frontend/backend
• **Career Guidance**: Interview prep, skill development

**Learning Tips:**
1. Break complex topics into smaller pieces
2. Practice with hands-on coding
3. Review regularly to reinforce concepts
4. Don't hesitate to ask follow-up questions

Could you provide more details about what you'd like to learn? For example:
• What specific concept are you struggling with?
• What's your learning goal?
• Are you working on a particular project?

I'm here to help you succeed!"""


# ============================================
# QUIZ GENERATOR SERVICE
# ============================================

def generate_quiz_questions(topic: str, difficulty: str, num_questions: int) -> List[Dict]:
    """
    Generate quiz questions for a given topic.

    TODO: Replace with actual AI generation from Google AI Studio / Gemini.
    For now, returns pre-defined questions based on topic.

    Args:
        topic: The quiz topic
        difficulty: easy, medium, or hard
        num_questions: Number of questions to generate

    Returns:
        List of question dictionaries
    """

    # Question banks by topic and difficulty
    question_banks = {
        'python': {
            'easy': [
                {
                    'question': 'What is the correct way to create a list in Python?',
                    'options': ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
                    'correct_answer': 1,
                    'explanation': 'Square brackets [] are used to create lists in Python.'
                },
                {
                    'question': 'Which keyword is used to define a function in Python?',
                    'options': ['function', 'def', 'func', 'define'],
                    'correct_answer': 1,
                    'explanation': 'The "def" keyword is used to define functions in Python.'
                },
            ],
            'medium': [
                {
                    'question': 'What is a list comprehension in Python?',
                    'options': [
                        'A way to compress lists',
                        'A concise way to create lists',
                        'A method to understand lists',
                        'A type of data structure'
                    ],
                    'correct_answer': 1,
                    'explanation': 'List comprehensions provide a concise way to create lists.'
                },
            ],
            'hard': [
                {
                    'question': 'What is the GIL (Global Interpreter Lock) in Python?',
                    'options': [
                        'A security feature',
                        'A mutex preventing multiple threads from executing Python bytecode',
                        'A graphics library',
                        'A locking mechanism for files'
                    ],
                    'correct_answer': 1,
                    'explanation': 'The GIL is a mutex that protects Python objects, preventing multiple threads from executing Python bytecode at once.'
                },
            ]
        },
        'machine learning': {
            'easy': [
                {
                    'question': 'What is supervised learning?',
                    'options': [
                        'Learning without labels',
                        'Learning with labeled training data',
                        'Learning through rewards',
                        'Learning by supervision only'
                    ],
                    'correct_answer': 1,
                    'explanation': 'Supervised learning uses labeled training data.'
                },
            ],
            'medium': [
                {
                    'question': 'What is overfitting in machine learning?',
                    'options': [
                        'Model is too simple',
                        'Model memorizes training data too well',
                        'Model has too few parameters',
                        'Model trains too fast'
                    ],
                    'correct_answer': 1,
                    'explanation': 'Overfitting occurs when a model learns training data too well, including noise.'
                },
            ],
            'hard': [
                {
                    'question': 'What is the purpose of regularization in ML?',
                    'options': [
                        'To make data regular',
                        'To prevent overfitting by penalizing complexity',
                        'To speed up training',
                        'To normalize input data'
                    ],
                    'correct_answer': 1,
                    'explanation': 'Regularization adds penalty terms to prevent overfitting.'
                },
            ]
        },
        'data structures': {
            'easy': [
                {
                    'question': 'What is the time complexity of accessing an element in an array by index?',
                    'options': ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
                    'correct_answer': 1,
                    'explanation': 'Array access by index is O(1) - constant time.'
                },
            ],
            'medium': [
                {
                    'question': 'What is the average time complexity of binary search?',
                    'options': ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                    'correct_answer': 1,
                    'explanation': 'Binary search has O(log n) time complexity.'
                },
            ],
            'hard': [
                {
                    'question': 'What is amortized time complexity?',
                    'options': [
                        'Average time over many operations',
                        'Worst case time',
                        'Best case time',
                        'Time with memory included'
                    ],
                    'correct_answer': 0,
                    'explanation': 'Amortized analysis considers average time per operation over a sequence.'
                },
            ]
        }
    }

    # Normalize topic
    topic_key = topic.lower()
    for key in question_banks.keys():
        if key in topic_key:
            topic_key = key
            break

    # Get questions from bank or generate generic ones
    if topic_key in question_banks and difficulty in question_banks[topic_key]:
        questions = question_banks[topic_key][difficulty]
    else:
        # Generic questions if topic not found
        questions = [
            {
                'question': f'Sample question about {topic} ({difficulty} level)',
                'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                'correct_answer': random.randint(0, 3),
                'explanation': f'This is a sample explanation for {topic}.'
            }
            for _ in range(num_questions)
        ]

    # Return requested number of questions (cycle through if needed)
    result = []
    for i in range(num_questions):
        result.append(questions[i % len(questions)])

    return result


# ============================================
# RESEARCH ASSISTANT SERVICE
# ============================================

def generate_research_assistance(
    research_description: str,
    help_type: str
) -> Dict:
    """
    Generate research assistance based on the help type.

    TODO: Replace with actual Google AI Studio / Gemini API call.
    For now, returns structured mock assistance.

    Args:
        research_description: Description of the research project
        help_type: Type of help needed (research_question, literature_review, structure)

    Returns:
        Dictionary with research assistance
    """

    if help_type == 'research_question':
        return {
            'suggested_outline': [
                '1. Problem Statement: Define the specific problem you are investigating',
                '2. Research Gap: Identify what is missing in current research',
                '3. Objectives: List specific, measurable objectives',
                '4. Hypotheses: Formulate testable hypotheses (if applicable)',
                '5. Expected Contribution: Explain the value of your research'
            ],
            'suggested_keywords': [
                'artificial intelligence',
                'learning analytics',
                'personalized learning',
                'student engagement',
                'educational technology',
                'machine learning in education',
                'adaptive learning systems'
            ],
            'advice': """**Refining Your Research Question:**

A strong research question should be:
• **Specific**: Narrow focus on a particular aspect
• **Measurable**: Can be evaluated with data
• **Achievable**: Realistic given your resources
• **Relevant**: Addresses a real problem
• **Time-bound**: Has a clear timeframe

**SMART Framework:**
Use the SMART criteria to refine your question:
1. **S**pecific: What exactly are you studying?
2. **M**easurable: How will you measure success?
3. **A**chievable: Is it feasible?
4. **R**elevant**: Why does it matter?
5. **T**ime-bound: What is your timeline?

**Example Transformation:**
• Weak: "How does AI help education?"
• Strong: "How does an AI-powered personalized learning platform improve student engagement and academic performance in graduate-level computer science courses over one semester?"

**Next Steps:**
1. Review recent literature (last 3-5 years)
2. Identify specific metrics for measurement
3. Define your target population clearly
4. Consider ethical implications
5. Plan your methodology""",
            'references': [
                'Roll, I., & Wylie, R. (2016). Evolution and revolution in artificial intelligence in education. International Journal of Artificial Intelligence in Education, 26(2), 582-599.',
                'Zawacki-Richter, O., et al. (2019). Systematic review of research on artificial intelligence applications in higher education. International Journal of Educational Technology in Higher Education, 16(1), 39.',
                'Holmes, W., et al. (2019). Artificial intelligence in education: Promises and implications for teaching and learning. Center for Curriculum Redesign.'
            ]
        }

    elif help_type == 'literature_review':
        return {
            'suggested_outline': [
                '1. Introduction: Overview of the research area and its importance',
                '2. Search Methodology: Databases used, keywords, inclusion/exclusion criteria',
                '3. Thematic Analysis: Group studies by themes or approaches',
                '4. Historical Development: Evolution of the field over time',
                '5. Current State: Recent advances and current practices',
                '6. Research Gaps: What has not been adequately addressed',
                '7. Synthesis: Integrate findings across studies',
                '8. Conclusions: Summarize insights and future directions'
            ],
            'suggested_keywords': [
                'machine learning education',
                'intelligent tutoring systems',
                'personalized learning platforms',
                'learning management systems',
                'educational data mining',
                'student performance prediction',
                'adaptive learning',
                'AI in higher education'
            ],
            'advice': """**Conducting a Comprehensive Literature Review:**

**Search Strategy:**
1. **Define scope**: Time period, geographic region, study types
2. **Identify databases**: IEEE Xplore, ACM Digital Library, Google Scholar, ERIC
3. **Use Boolean operators**: AND, OR, NOT for precise searches
4. **Track your process**: Document search strings and results

**Quality Assessment:**
• Evaluate source credibility
• Check citation counts
• Review publication venues (journals > conferences > workshops)
• Assess methodology rigor
• Consider recency (prioritize last 5 years)

**Organization Tips:**
1. Use reference management software (Zotero, Mendeley)
2. Create a summary table for each paper:
   - Authors, Year, Method, Key Findings, Limitations
3. Group papers by themes or chronology
4. Identify trends and patterns
5. Note conflicting findings

**Writing Structure:**
• Start broad, then narrow focus
• Use subheadings for themes
• Compare and contrast studies
• Identify gaps clearly
• Use transitions between sections
• Cite extensively but synthesize

**Red Flags to Avoid:**
✗ Only descriptive summaries
✗ No critical analysis
✗ Missing recent papers
✗ Ignoring contradictory evidence
✗ Lack of synthesis

**Aim for:**
✓ Critical evaluation
✓ Thematic organization
✓ Clear identification of gaps
✓ Synthesis of findings
✓ Connection to your research""",
            'references': [
                'Plass, J. L., & Pawar, S. (2020). Toward a taxonomy of adaptivity for learning. Journal of Research on Technology in Education, 52(3), 275-300.',
                'Baker, R. S., & Inventado, P. S. (2014). Educational data mining and learning analytics. In Learning analytics (pp. 61-75). Springer.',
                'Luckin, R., et al. (2016). Intelligence unleashed: An argument for AI in education. Pearson Education.'
            ]
        }

    else:  # structure
        return {
            'suggested_outline': [
                '1. Title Page: Title, author, institution, date',
                '2. Abstract: 250-300 word summary of entire thesis',
                '3. Table of Contents: All chapters and sections with page numbers',
                '4. Chapter 1 - Introduction:',
                '   • Background and context',
                '   • Problem statement',
                '   • Research questions/objectives',
                '   • Significance of the study',
                '   • Scope and limitations',
                '   • Organization of thesis',
                '5. Chapter 2 - Literature Review:',
                '   • Theoretical framework',
                '   • Review of relevant research',
                '   • Research gaps',
                '6. Chapter 3 - Methodology:',
                '   • Research design',
                '   • Data collection methods',
                '   • Analysis techniques',
                '   • Ethical considerations',
                '7. Chapter 4 - System Design/Implementation:',
                '   • Architecture',
                '   • Technologies used',
                '   • Implementation details',
                '8. Chapter 5 - Results and Analysis:',
                '   • Presentation of findings',
                '   • Statistical analysis',
                '   • Interpretation',
                '9. Chapter 6 - Discussion:',
                '   • Interpretation of results',
                '   • Implications',
                '   • Comparison with literature',
                '10. Chapter 7 - Conclusion:',
                '   • Summary of findings',
                '   • Contributions',
                '   • Limitations',
                '   • Future work',
                '11. References: All cited works in required format',
                '12. Appendices: Supplementary materials'
            ],
            'suggested_keywords': [
                'thesis structure',
                'master\'s thesis',
                'research methodology',
                'academic writing',
                'thesis chapters'
            ],
            'advice': """**Structuring Your Master's Thesis:**

**Overall Length:** Typically 60-100 pages (excluding appendices)

**Chapter Guidelines:**

**Chapter 1 - Introduction (10-15 pages)**
• Hook the reader with context
• Clearly state the problem
• Define research questions
• Explain why it matters
• Preview the structure

**Chapter 2 - Literature Review (15-20 pages)**
• Organize thematically or chronologically
• Critically analyze, don't just summarize
• Build toward identifying your research gap
• End with how your research addresses the gap

**Chapter 3 - Methodology (10-15 pages)**
• Justify your approach
• Detail data collection procedures
• Explain analysis methods
• Address validity and reliability
• Discuss ethical considerations

**Chapter 4 - Implementation (15-20 pages)**
• System architecture diagrams
• Technology stack justification
• Key algorithms/components
• Screenshots or prototypes
• Challenges and solutions

**Chapter 5 - Results (10-15 pages)**
• Present findings objectively
• Use tables, charts, graphs
• Statistical significance
• Patterns and trends
• No interpretation yet (save for Discussion)

**Chapter 6 - Discussion (10-15 pages)**
• Interpret what results mean
• Compare with literature
• Explain unexpected findings
• Discuss implications
• Address limitations

**Chapter 7 - Conclusion (5-8 pages)**
• Restate research questions
• Summarize key findings
• Highlight contributions
• Acknowledge limitations
• Suggest future research

**Writing Tips:**
1. Write introduction and conclusion last
2. Use consistent formatting
3. Number all tables and figures
4. Cross-reference effectively
5. Proofread multiple times
6. Get feedback from advisor regularly

**Timeline Suggestion:**
• Months 1-2: Literature review
• Months 3-4: Methodology and implementation
• Months 5-6: Data collection and analysis
• Months 7-8: Writing and revisions
• Month 9: Final editing and submission""",
            'references': [
                'Dunleavy, P. (2003). Authoring a PhD: How to plan, draft, write and finish a doctoral thesis or dissertation. Palgrave Macmillan.',
                'Murray, R. (2011). How to write a thesis. McGraw-Hill Education.',
                'Evans, D., & Gruba, P. (2002). How to write a better thesis. Melbourne University Press.'
            ]
        }


# ============================================
# PLACEHOLDER FOR REAL AI SERVICE
# ============================================

async def call_google_ai_studio(prompt: str, model: str = "gemini-pro") -> str:
    """
    Placeholder for Google AI Studio / Gemini API call.

    TODO: Implement actual API integration:

    1. Install google-generativeai package:
       pip install google-generativeai

    2. Set up API key:
       import google.generativeai as genai
       genai.configure(api_key="YOUR_API_KEY")

    3. Call the model:
       model = genai.GenerativeModel(model)
       response = model.generate_content(prompt)
       return response.text

    Args:
        prompt: The prompt to send to the AI
        model: Model name (e.g., "gemini-pro")

    Returns:
        AI-generated response
    """
    # For now, return a placeholder message
    return f"[AI response would be generated here for prompt: {prompt[:100]}...]"
