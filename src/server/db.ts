import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'trendy_eventy.db');

export const db = new DatabaseSync(DB_PATH);

// Helper for password hashing
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
}

export function initDatabase() {
  // 1. Create admin_users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Create admin_sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users (id) ON DELETE CASCADE
    );
  `);

  // 3. Create quotes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      item_selection TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      material_choice TEXT,
      finishing_choice TEXT,
      occasion_type TEXT,
      custom_names_date TEXT,
      color_theme TEXT,
      scent_choice TEXT,
      setup_items TEXT,
      has_artwork TEXT,
      uploaded_design TEXT,
      event_date TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_city TEXT,
      notes TEXT,
      estimated_min INTEGER DEFAULT 0,
      estimated_max INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      message TEXT NOT NULL,
      source TEXT DEFAULT 'whatsapp_widget',
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      tagline_en TEXT,
      tagline_ar TEXT,
      description_en TEXT,
      description_ar TEXT,
      image TEXT,
      fallback_gradient TEXT,
      materials_used TEXT,
      materials_used_ar TEXT,
      suggested_occasions TEXT,
      suggested_occasions_ar TEXT,
      moq INTEGER DEFAULT 1,
      unit TEXT DEFAULT 'Pieces',
      unit_ar TEXT DEFAULT 'قطعة',
      estimated_price_range TEXT,
      catalogue_page INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Create materials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      category TEXT NOT NULL,
      category_en TEXT,
      category_ar TEXT,
      thickness_weight TEXT,
      description_en TEXT,
      description_ar TEXT,
      best_uses_en TEXT,
      best_uses_ar TEXT,
      durability_en TEXT,
      durability_ar TEXT,
      print_technique_en TEXT,
      print_technique_ar TEXT,
      finish_options_en TEXT,
      finish_options_ar TEXT,
      related_product_ids TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Create portfolio table
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label_en TEXT,
      category_label_ar TEXT,
      image TEXT,
      client_en TEXT,
      client_ar TEXT,
      occasion_en TEXT,
      occasion_ar TEXT,
      turnaround_en TEXT,
      turnaround_ar TEXT,
      materials_en TEXT,
      materials_ar TEXT,
      description_en TEXT,
      description_ar TEXT,
      deliverables_en TEXT,
      deliverables_ar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Create site_settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin if not exists: kirilloshelal@gmail.com / 123456
  const existingAdmin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get('kirilloshelal@gmail.com');
  if (!existingAdmin) {
    const { hash, salt } = hashPassword('123456');
    db.prepare(`
      INSERT INTO admin_users (email, password_hash, salt, role)
      VALUES (?, ?, ?, 'superadmin')
    `).run('kirilloshelal@gmail.com', hash, salt);
    console.log('✅ Initialized default admin account: kirilloshelal@gmail.com');
  }

  // Seed default settings
  const existingPhone = db.prepare('SELECT * FROM site_settings WHERE key = ?').get('phone');
  if (!existingPhone) {
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('phone', '01031450254');
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('address_ar', '8 شارع البصاء - شبرا مصر، القاهرة');
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('address_en', '8 El basaa Street - Shoubra Masr, Cairo, Egypt');
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('email', 'kirilloshelal@gmail.com');
  }
}
