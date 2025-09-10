import { db } from '../models/db.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

db.exec(schema);

db.exec('DELETE FROM favorites;');
db.exec('DELETE FROM resources;');
db.exec('DELETE FROM users;');

const passwordHash = bcrypt.hashSync('password123', 10);
db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
  .run('Demo User', 'demo@example.com', passwordHash);

const sampleResources = [
  { title: 'You Don\'t Know JS Yet', type: 'book', author: 'Kyle Simpson', url: 'https://github.com/getify/You-Dont-Know-JS', description: 'Deep dive into JS.' },
  { title: 'Clean Code', type: 'book', author: 'Robert C. Martin', url: 'https://www.oreilly.com/library/view/clean-code/9780136083238/', description: 'Best practices for readable code.' },
  { title: 'MDN Web Docs', type: 'article', author: 'Mozilla', url: 'https://developer.mozilla.org/', description: 'Comprehensive web documentation.' },
  { title: 'The Pragmatic Programmer', type: 'book', author: 'Andrew Hunt, David Thomas', url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', description: 'Timeless software wisdom.' },
  { title: 'What is Node.js?', type: 'article', author: 'Node.js', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', description: 'Intro to Node.js.' },
  { title: 'JavaScript Async: Promises, async/await', type: 'video', author: 'Fireship', url: 'https://www.youtube.com/watch?v=vn3tm0quoqE', description: 'Quick guide to async.' }
];

const insert = db.prepare('INSERT INTO resources (title, type, author, url, description) VALUES (@title, @type, @author, @url, @description)');
const insertMany = db.transaction((rows) => {
  for (const row of rows) insert.run(row);
});
insertMany(sampleResources);

console.log('Database seeded.');

