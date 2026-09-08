import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const databasePath = fileURLToPath(new URL('../data/ircc.db', import.meta.url));

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_salt BLOB NOT NULL,
    password_hash BLOB NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) STRICT;
`);

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64);
}

function seedDemoUser() {
  const existingUser = database
    .prepare('SELECT id FROM users WHERE username = ?')
    .get('alex.morgan');

  if (existingUser) return;

  const salt = randomBytes(16);
  database.prepare(`
    INSERT INTO users (username, display_name, password_salt, password_hash)
    VALUES (?, ?, ?, ?)
  `).run(
    'alex.morgan',
    'Alex Morgan',
    salt,
    hashPassword('Alex2026!', salt),
  );
}

seedDemoUser();

export function authenticate(username, password) {
  const user = database.prepare(`
    SELECT username, display_name, password_salt, password_hash
    FROM users
    WHERE username = ?
  `).get(username);

  if (!user) return null;

  const suppliedHash = hashPassword(password, user.password_salt);
  if (!timingSafeEqual(suppliedHash, user.password_hash)) return null;

  return { name: user.display_name, username: user.username };
}
