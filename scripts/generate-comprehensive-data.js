import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Data arrays
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Raj', 'Priya', 'Wei', 'Yuki', 'Mohammed', 'Fatima', 'Carlos', 'Maria', 'Dmitri', 'Olga'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Patel', 'Kumar', 'Singh', 'Chen', 'Wang', 'Kim', 'Ali', 'Ahmed', 'Silva', 'Santos'];

const courseData = [
  { title: 'Introduction to Programming', category: 'Computer Science', level: 'Beginner', description: 'Learn programming fundamentals with Python' },
  { title: 'Data Structures and Algorithms', category: 'Computer Science', level: 'Intermediate', description: 'Master essential data structures and algorithms' },
  { title: 'Web Development Bootcamp', category: 'Web Development', level: 'Beginner', description: 'Full-stack web development from scratch' },
  { title: 'Machine Learning Fundamentals', category: 'Data Science', level: 'Intermediate', description: 'Introduction to ML concepts and applications' },
  { title: 'Advanced Deep Learning', category: 'Data Science', level: 'Advanced', description: 'Neural networks and deep learning architectures' },
  { title: 'Cloud Computing with AWS', category: 'Cloud', level: 'Intermediate', description: 'AWS services and cloud architecture' },
  { title: 'Database Design', category: 'Database', level: 'Intermediate', description: 'Relational and NoSQL database design' },
  { title: 'Cybersecurity Basics', category: 'Security', level: 'Beginner', description: 'Introduction to information security' },
  { title: 'Mobile App Development', category: 'Mobile', level: 'Intermediate', description: 'iOS and Android development' },
  { title: 'DevOps Engineering', category: 'Cloud', level: 'Advanced', description: 'CI/CD, containers, and automation' },
  { title: 'Artificial Intelligence', category: 'Data Science', level: 'Advanced', description: 'AI techniques and applications' },
  { title: 'Frontend Frameworks', category: 'Web Development', level: 'Intermediate', description: 'React, Vue, and Angular' },
  { title: 'Backend Development', category: 'Web Development', level: 'Intermediate', description: 'Server-side programming and APIs' },
  { title: 'Data Analysis with Python', category: 'Data Science', level: 'Beginner', description: 'Pandas, NumPy, and data visualization' },
  { title: 'Software Engineering Principles', category: 'Computer Science', level: 'Intermediate', description: 'Design patterns and best practices' },
  { title: 'Network Programming', category: 'Computer Science', level: 'Advanced', description: 'Socket programming and protocols' },
  { title: 'UI/UX Design', category: 'Design', level: 'Beginner', description: 'User interface and experience design' },
  { title: 'Blockchain Technology', category: 'Emerging Tech', level: 'Intermediate', description: 'Distributed ledger and cryptocurrencies' },
  { title: 'Internet of Things', category: 'Emerging Tech', level: 'Intermediate', description: 'IoT devices and applications' },
  { title: 'Quantum Computing', category: 'Emerging Tech', level: 'Advanced', description: 'Introduction to quantum algorithms' }
];

console.log('Starting comprehensive data generation...\n');

// 1. Generate Courses (100 courses)
async function generateCourses() {
  console.log('Generating courses...');
  const courses = [];

  for (let i = 0; i < 100; i++) {
    const baseourse = randomElement(courseData);
    const course = {
      title: `${baseCourse.title} ${i > 19 ? '- Section ' + String.fromCharCode(65 + ((i - 20) % 26)) : ''}`.trim(),
      description: baseCourse.description,
      category: baseCourse.category,
      level: baseCourse.level,
      external_source: randomElement(['SLU Catalog', 'Coursera', 'edX', 'Udacity', 'LinkedIn Learning']),
      duration: `${randomInt(4, 16)} weeks`,
      difficulty_level: baseCourse.level,
      is_active: Math.random() < 0.95
    };
    courses.push(course);
  }

  // Insert in batches
  for (let i = 0; i < courses.length; i += 50) {
    const batch = courses.slice(i, i + 50);
    const { error } = await supabase.from('courses').insert(batch);
    if (error) console.error('Error inserting courses:', error);
  }

  console.log(`✓ ${courses.length} courses generated\n`);
}

// 2. Generate Lessons (1500 lessons)
async function generateLessons() {
  console.log('Generating lessons...');

  const { data: courses } = await supabase.from('courses').select('id');
  if (!courses || courses.length === 0) {
    console.error('No courses found!');
    return;
  }

  const lessons = [];
  const lessonTitles = [
    'Introduction and Overview', 'Core Concepts', 'Practical Examples',
    'Hands-on Lab', 'Advanced Topics', 'Best Practices',
    'Case Studies', 'Real-world Applications', 'Common Pitfalls',
    'Performance Optimization', 'Testing Strategies', 'Deployment',
    'Security Considerations', 'Troubleshooting', 'Final Project'
  ];

  for (const course of courses) {
    const lessonCount = randomInt(10, 20);
    for (let i = 0; i < lessonCount; i++) {
      lessons.push({
        course_id: course.id,
        title: `${randomElement(lessonTitles)} - Module ${i + 1}`,
        description: `Comprehensive module covering important concepts and practical skills.`,
        content: `Detailed lesson content for module ${i + 1}. Includes video lectures, reading materials, and exercises.`,
        order_in_course: i + 1,
        duration: `${randomInt(20, 90)} minutes`,
        video_url: `https://example.com/videos/lesson-${i + 1}`,
        external_content_source: randomElement(['Internal', 'YouTube', 'Vimeo', 'Custom Platform']),
        site: randomElement(['Main Campus', 'Online', 'Hybrid']),
        is_active: true
      });
    }
  }

  console.log(`Inserting ${lessons.length} lessons...`);

  for (let i = 0; i < lessons.length; i += 100) {
    const batch = lessons.slice(i, i + 100);
    const { error } = await supabase.from('course_modules').insert(batch);
    if (error) console.error('Error inserting lessons:', error.message);
    console.log(`  ${Math.min(i + 100, lessons.length)}/${lessons.length} lessons inserted`);
  }

  console.log(`✓ ${lessons.length} lessons generated\n`);
}

// 3. Generate Enrollments (5000 enrollments)
async function generateEnrollments() {
  console.log('Generating enrollments...');

  const { data: students } = await supabase.from('profiles').select('id').limit(1200);
  const { data: courses } = await supabase.from('courses').select('id');

  if (!students || !courses) {
    console.error('Missing students or courses!');
    return;
  }

  const enrollments = [];
  const statuses = ['Not started', 'In progress', 'Completed'];

  // Each student enrolls in 3-6 courses
  for (const student of students) {
    const numEnrollments = randomInt(3, 6);
    const selectedCourses = [];

    for (let i = 0; i < numEnrollments; i++) {
      let course;
      do {
        course = randomElement(courses);
      } while (selectedCourses.includes(course.id));
      selectedCourses.push(course.id);

      const status = randomElement(statuses);
      const progressPercent = status === 'Completed' ? 100 :
                            status === 'In progress' ? randomInt(10, 95) : 0;

      enrollments.push({
        student_id: student.id,
        course_id: course.id,
        enrollment_date: randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0],
        progress_percent: progressPercent,
        grade: status === 'Completed' ? randomFloat(65, 100) : null,
        status: status,
        deadline: new Date(Date.now() + randomInt(1, 90) * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  }

  console.log(`Inserting ${enrollments.length} enrollments...`);

  for (let i = 0; i < enrollments.length; i += 100) {
    const batch = enrollments.slice(i, i + 100);
    const { error } = await supabase.from('enrollments').insert(batch);
    if (error) console.error('Error inserting enrollments:', error.message);
    console.log(`  ${Math.min(i + 100, enrollments.length)}/${enrollments.length} enrollments inserted`);
  }

  console.log(`✓ ${enrollments.length} enrollments generated\n`);
}

// Run all generators
async function main() {
  try {
    await generateCourses();
    await generateLessons();
    await generateEnrollments();

    console.log('\n✨ Comprehensive data generation complete!');
    console.log('\nNext steps: Run additional scripts for quizzes, notifications, etc.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
