/*
  # Add Sample Courses

  1. Purpose
    - Populate the courses table with sample courses for the learning platform
    - These courses include Machine Learning, Generative AI, and other career-focused topics

  2. Courses Added
    - Machine Learning Fundamentals
    - Generative AI & Large Language Models
    - Python Programming for Data Science
    - Deep Learning with TensorFlow
    - Data Engineering Essentials
    - Full Stack Web Development
    - UI/UX Design Masterclass
    - Data Analysis with SQL & Tableau

  3. Details
    - Each course has appropriate difficulty level, category, and duration
    - Courses are marked as active and ready for enrollment
*/

-- Insert sample courses
INSERT INTO courses (title, description, duration, difficulty_level, category, is_active)
VALUES
  (
    'Machine Learning Fundamentals',
    'Master the core concepts of machine learning including supervised, unsupervised learning, and neural networks. Build practical ML models using Python and popular libraries.',
    '12 weeks',
    'intermediate',
    'Machine Learning',
    true
  ),
  (
    'Generative AI & Large Language Models',
    'Explore the cutting-edge world of generative AI, transformers, and LLMs. Learn to build applications using GPT, DALL-E, and other generative models.',
    '10 weeks',
    'advanced',
    'Artificial Intelligence',
    true
  ),
  (
    'Python Programming for Data Science',
    'Learn Python from basics to advanced data manipulation, visualization, and analysis using NumPy, Pandas, and Matplotlib.',
    '8 weeks',
    'beginner',
    'Programming',
    true
  ),
  (
    'Deep Learning with TensorFlow',
    'Build advanced neural networks using TensorFlow and Keras. Cover CNNs, RNNs, GANs, and transfer learning for real-world applications.',
    '14 weeks',
    'advanced',
    'Machine Learning',
    true
  ),
  (
    'Data Engineering Essentials',
    'Master data pipelines, ETL processes, data warehousing, and big data technologies like Spark, Kafka, and Airflow.',
    '10 weeks',
    'intermediate',
    'Data Engineering',
    true
  ),
  (
    'Full Stack Web Development',
    'Build modern web applications from front to back using React, Node.js, Express, and MongoDB. Deploy production-ready applications.',
    '16 weeks',
    'intermediate',
    'Web Development',
    true
  ),
  (
    'UI/UX Design Masterclass',
    'Learn user-centered design principles, wireframing, prototyping, and user testing. Master tools like Figma and Adobe XD.',
    '8 weeks',
    'beginner',
    'Design',
    true
  ),
  (
    'Data Analysis with SQL & Tableau',
    'Master SQL for data querying and analysis, and create compelling data visualizations using Tableau for business insights.',
    '6 weeks',
    'beginner',
    'Data Analysis',
    true
  );
