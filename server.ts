import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, initDatabase, hashPassword, verifyPassword } from './src/server/db.ts';
import { CATALOGUE_PRODUCTS } from './src/data/catalogueData.ts';
import { PRINTING_MATERIALS } from './src/data/materialsData.ts';
import { PORTFOLIO_PROJECTS } from './src/data/portfolioData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & default admin credentials
initDatabase();

// Seed initial products, materials, portfolio if empty
seedInitialTables();

function seedInitialTables() {
  // Seed products
  const productCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any)?.count || 0;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, category_id, name_en, name_ar, tagline_en, tagline_ar,
        description_en, description_ar, image, fallback_gradient,
        materials_used, materials_used_ar, suggested_occasions, suggested_occasions_ar,
        moq, unit, unit_ar, estimated_price_range, catalogue_page, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of CATALOGUE_PRODUCTS) {
      insertProduct.run(
        p.id, p.categoryId, p.nameEn, p.nameAr, p.taglineEn, p.taglineAr,
        p.descriptionEn, p.descriptionAr, p.image, p.fallbackGradient,
        JSON.stringify(p.materialsUsed), JSON.stringify(p.materialsUsedAr),
        JSON.stringify(p.suggestedOccasions), JSON.stringify(p.suggestedOccasionsAr),
        p.moq, p.unit, p.unitAr, p.estimatedPriceRange, p.cataloguePage, p.featured ? 1 : 0
      );
    }
    console.log(`✅ Seeded ${CATALOGUE_PRODUCTS.length} products into SQLite`);
  }

  // Seed materials
  const matCount = (db.prepare('SELECT COUNT(*) as count FROM materials').get() as any)?.count || 0;
  if (matCount === 0) {
    const insertMat = db.prepare(`
      INSERT INTO materials (
        id, name_en, name_ar, category, category_en, category_ar,
        thickness_weight, description_en, description_ar,
        best_uses_en, best_uses_ar, durability_en, durability_ar,
        print_technique_en, print_technique_ar, finish_options_en, finish_options_ar,
        related_product_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const m of PRINTING_MATERIALS) {
      insertMat.run(
        m.id, m.nameEn, m.nameAr, m.category, m.categoryEn, m.categoryAr,
        m.thicknessWeight, m.descriptionEn, m.descriptionAr,
        JSON.stringify(m.bestUsesEn), JSON.stringify(m.bestUsesAr),
        m.durabilityEn, m.durabilityAr, m.printTechniqueEn, m.printTechniqueAr,
        JSON.stringify(m.finishOptionsEn), JSON.stringify(m.finishOptionsAr),
        JSON.stringify(m.relatedProductIds)
      );
    }
    console.log(`✅ Seeded ${PRINTING_MATERIALS.length} materials into SQLite`);
  }

  // Seed portfolio
  const portCount = (db.prepare('SELECT COUNT(*) as count FROM portfolio').get() as any)?.count || 0;
  if (portCount === 0) {
    const insertPort = db.prepare(`
      INSERT INTO portfolio (
        id, title_en, title_ar, category, category_label_en, category_label_ar,
        image, client_en, client_ar, occasion_en, occasion_ar,
        turnaround_en, turnaround_ar, materials_en, materials_ar,
        description_en, description_ar, deliverables_en, deliverables_ar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const proj of PORTFOLIO_PROJECTS) {
      insertPort.run(
        proj.id, proj.titleEn, proj.titleAr, proj.category, proj.categoryLabelEn, proj.categoryLabelAr,
        proj.image, proj.clientEn, proj.clientAr, proj.occasionEn, proj.occasionAr,
        proj.turnaroundEn, proj.turnaroundAr,
        JSON.stringify(proj.materialsEn), JSON.stringify(proj.materialsAr),
        proj.descriptionEn, proj.descriptionAr,
        JSON.stringify(proj.deliverablesEn), JSON.stringify(proj.deliverablesAr)
      );
    }
    console.log(`✅ Seeded ${PORTFOLIO_PROJECTS.length} portfolio items into SQLite`);
  }

  // Seed demo quotes if empty
  const quoteCount = (db.prepare('SELECT COUNT(*) as count FROM quotes').get() as any)?.count || 0;
  if (quoteCount === 0) {
    const insertQuote = db.prepare(`
      INSERT INTO quotes (
        id, date, category, item_selection, quantity,
        material_choice, finishing_choice, occasion_type, custom_names_date,
        color_theme, scent_choice, setup_items, has_artwork, uploaded_design,
        event_date, customer_name, customer_phone, customer_city, notes,
        estimated_min, estimated_max, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertQuote.run(
      'TE-9241', '2026-10-12 14:35', 'printing', 'Business Cards (كروت شخصية فاخرة)', 1000,
      'ورق كوشيه 350 جم فاخر (Couche 350gsm)', 'سلوفان حراري مط + بصمة فويل ذهبي (Gold Foil)',
      null, null, null, null, null, 'yes',
      JSON.stringify({ name: 'Forge_Business_Cards_PrintReady.pdf', size: '4.2 MB', type: 'application/pdf' }),
      null, 'م. أحمد توفيق', '01012345678', 'القاهرة - التجمع الخامس',
      'اللوجو ذهبي لامع بارز مع زوايا دائرية، مطلوب تسليم خلال 3 أيام.',
      650, 1200, 'in_production'
    );

    insertQuote.run(
      'TE-8820', '2026-10-12 11:15', 'decor', 'Ornate Welcome Board Mirror (مرآة ترحيبية كلاسيكية)', 1,
      null, null, 'حفل زفاف (Wedding)', 'سارة & مايكل - 28/10/2026',
      null, null, JSON.stringify(['Welcome Mirror', 'Audio Guestbook']), 'need_design', null,
      '2026-10-28', 'سارة كمال', '01287654321', 'مصر الجديدة - القاهرة',
      'إطار مذهب أنتيك مع ورد أبيض وخضرة، التوصيل والتركيب في قاعة الفرح.',
      1800, 2600, 'contacted'
    );

    insertQuote.run(
      'TE-8104', '2026-10-11 18:40', 'candles', 'Mini Bubble Candles (توزيعات شمع ميني بابلز)', 150,
      null, null, 'سبوع واستقبال مولود (Sebou3)', 'Baby Noah - 15/11/2026',
      'بيبي بلو وباستيل أبيض', 'فانيليا فرنسية دافئة', null, 'have_draft',
      JSON.stringify({ name: 'Baby_Noah_Theme_Card.png', size: '1.8 MB', type: 'image/png' }),
      null, 'د. ندى الشريف', '01198765432', 'شبرا مصر - القاهرة',
      'مع فيونكة ستان زرقاء وكارت إهداء بالاسم وتاريخ الولادة.',
      3000, 4800, 'pending'
    );
  }
}

// Authentication Middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing authentication token' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.prepare(`
    SELECT * FROM admin_sessions 
    WHERE token = ? AND expires_at > datetime('now')
  `).get(token) as any;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: token invalid or expired' });
  }

  (req as any).adminUser = session;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- AUTHENTICATION API ROUTES ---
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email.trim().toLowerCase()) as any;
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isValid = verifyPassword(password, user.password_hash, user.salt);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate session token (valid for 7 days)
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      db.prepare(`
        INSERT INTO admin_sessions (token, user_id, email, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(token, user.id, user.email, expiresAt);

      return res.json({
        token,
        email: user.email,
        role: user.role,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get('/api/auth/me', authenticateAdmin, (req: Request, res: Response) => {
    const admin = (req as any).adminUser;
    return res.json({ email: admin.email, role: 'admin' });
  });

  app.post('/api/auth/logout', authenticateAdmin, (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
    }
    return res.json({ success: true });
  });

  // Change Password endpoint
  app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const admin = (req as any).adminUser;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(admin.user_id) as any;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!verifyPassword(currentPassword, user.password_hash, user.salt)) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const { hash, salt } = hashPassword(newPassword);
      db.prepare(`
        UPDATE admin_users 
        SET password_hash = ?, salt = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(hash, salt, user.id);

      return res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      console.error('Change password error:', err);
      return res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // Change Email endpoint
  app.post('/api/auth/change-email', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { newEmail, password } = req.body;
      const admin = (req as any).adminUser;

      if (!newEmail || !newEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(admin.user_id) as any;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!verifyPassword(password, user.password_hash, user.salt)) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      db.prepare(`
        UPDATE admin_users 
        SET email = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(newEmail.trim().toLowerCase(), user.id);

      // Update sessions
      db.prepare('UPDATE admin_sessions SET email = ? WHERE user_id = ?').run(newEmail.trim().toLowerCase(), user.id);

      return res.json({ success: true, email: newEmail.trim().toLowerCase() });
    } catch (err: any) {
      console.error('Change email error:', err);
      return res.status(500).json({ error: 'Failed to update email' });
    }
  });

  // --- QUOTES API ---
  app.get('/api/quotes', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all() as any[];
      const quotes = rows.map((r) => ({
        id: r.id,
        date: r.date,
        category: r.category,
        itemSelection: r.item_selection,
        quantity: r.quantity,
        materialChoice: r.material_choice,
        finishingChoice: r.finishing_choice,
        occasionType: r.occasion_type,
        customNamesDate: r.custom_names_date,
        colorTheme: r.color_theme,
        scentChoice: r.scent_choice,
        setupItems: r.setup_items ? JSON.parse(r.setup_items) : undefined,
        hasArtwork: r.has_artwork,
        uploadedDesign: r.uploaded_design ? JSON.parse(r.uploaded_design) : null,
        eventDate: r.event_date,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerCity: r.customer_city,
        notes: r.notes,
        estimatedTotalMinEGP: r.estimated_min,
        estimatedTotalMaxEGP: r.estimated_max,
        status: r.status,
      }));
      res.json(quotes);
    } catch (err) {
      console.error('Fetch quotes error:', err);
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  });

  app.post('/api/quotes', (req: Request, res: Response) => {
    try {
      const q = req.body;
      const id = q.id || `#TE-${Math.floor(1000 + Math.random() * 9000)}`;
      const date = q.date || new Date().toISOString().slice(0, 16).replace('T', ' ');

      db.prepare(`
        INSERT INTO quotes (
          id, date, category, item_selection, quantity,
          material_choice, finishing_choice, occasion_type, custom_names_date,
          color_theme, scent_choice, setup_items, has_artwork, uploaded_design,
          event_date, customer_name, customer_phone, customer_city, notes,
          estimated_min, estimated_max, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, date, q.category, q.itemSelection, q.quantity || 1,
        q.materialChoice || null, q.finishingChoice || null, q.occasionType || null, q.customNamesDate || null,
        q.colorTheme || null, q.scentChoice || null,
        q.setupItems ? JSON.stringify(q.setupItems) : null,
        q.hasArtwork || 'have_draft',
        q.uploadedDesign ? JSON.stringify(q.uploadedDesign) : null,
        q.eventDate || null,
        q.customerName || 'Online Client',
        q.customerPhone || '01031450254',
        q.customerCity || 'Cairo',
        q.notes || null,
        q.estimatedTotalMinEGP || 0,
        q.estimatedTotalMaxEGP || 0,
        q.status || 'pending'
      );

      res.status(201).json({ id, success: true });
    } catch (err) {
      console.error('Insert quote error:', err);
      res.status(500).json({ error: 'Failed to create quote' });
    }
  });

  app.patch('/api/quotes/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      db.prepare('UPDATE quotes SET status = ? WHERE id = ?').run(status, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update quote' });
    }
  });

  app.delete('/api/quotes/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.prepare('DELETE FROM quotes WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete quote' });
    }
  });

  // --- MESSAGES API ---
  app.get('/api/messages', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all() as any[];
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', (req: Request, res: Response) => {
    try {
      const { customerName, customerPhone, message, source } = req.body;
      const id = `msg-${Date.now().toString().slice(-4)}`;
      const date = new Date().toISOString().slice(0, 16).replace('T', ' ');

      db.prepare(`
        INSERT INTO messages (id, date, customer_name, customer_phone, message, source, status)
        VALUES (?, ?, ?, ?, ?, ?, 'unread')
      `).run(id, date, customerName || 'Visitor', customerPhone || '01031450254', message, source || 'whatsapp_widget');

      res.status(201).json({ id, success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  app.patch('/api/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      db.prepare('UPDATE messages SET status = ? WHERE id = ?').run(status, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  app.delete('/api/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.prepare('DELETE FROM messages WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // --- PRODUCTS MANAGEMENT API (ALL SITE SECTIONS) ---
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM products ORDER BY catalogue_page ASC, id ASC').all() as any[];
      const products = rows.map((r) => ({
        id: r.id,
        categoryId: r.category_id,
        nameEn: r.name_en,
        nameAr: r.name_ar,
        taglineEn: r.tagline_en,
        taglineAr: r.tagline_ar,
        descriptionEn: r.description_en,
        descriptionAr: r.description_ar,
        image: r.image,
        fallbackGradient: r.fallback_gradient,
        materialsUsed: r.materials_used ? JSON.parse(r.materials_used) : [],
        materialsUsedAr: r.materials_used_ar ? JSON.parse(r.materials_used_ar) : [],
        suggestedOccasions: r.suggested_occasions ? JSON.parse(r.suggested_occasions) : [],
        suggestedOccasionsAr: r.suggested_occasions_ar ? JSON.parse(r.suggested_occasions_ar) : [],
        moq: r.moq,
        unit: r.unit,
        unitAr: r.unit_ar,
        estimatedPriceRange: r.estimated_price_range,
        cataloguePage: r.catalogue_page,
        featured: Boolean(r.featured),
      }));
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/products', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const p = req.body;
      const id = p.id || `prod-${Date.now()}`;
      db.prepare(`
        INSERT INTO products (
          id, category_id, name_en, name_ar, tagline_en, tagline_ar,
          description_en, description_ar, image, fallback_gradient,
          materials_used, materials_used_ar, suggested_occasions, suggested_occasions_ar,
          moq, unit, unit_ar, estimated_price_range, catalogue_page, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, p.categoryId, p.nameEn, p.nameAr, p.taglineEn || '', p.taglineAr || '',
        p.descriptionEn || '', p.descriptionAr || '', p.image || '/src/assets/images/trendy_print_services_1791875459940.jpg',
        p.fallbackGradient || 'from-purple-900 to-indigo-900',
        JSON.stringify(p.materialsUsed || []), JSON.stringify(p.materialsUsedAr || []),
        JSON.stringify(p.suggestedOccasions || []), JSON.stringify(p.suggestedOccasionsAr || []),
        p.moq || 1, p.unit || 'Pieces', p.unitAr || 'قطعة', p.estimatedPriceRange || '',
        p.cataloguePage || 1, p.featured ? 1 : 0
      );
      res.status(201).json({ id, success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  app.put('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const p = req.body;
      db.prepare(`
        UPDATE products SET
          category_id = ?, name_en = ?, name_ar = ?, tagline_en = ?, tagline_ar = ?,
          description_en = ?, description_ar = ?, image = ?,
          materials_used = ?, materials_used_ar = ?,
          moq = ?, estimated_price_range = ?, catalogue_page = ?, featured = ?
        WHERE id = ?
      `).run(
        p.categoryId, p.nameEn, p.nameAr, p.taglineEn, p.taglineAr,
        p.descriptionEn, p.descriptionAr, p.image,
        JSON.stringify(p.materialsUsed || []), JSON.stringify(p.materialsUsedAr || []),
        p.moq, p.estimatedPriceRange, p.cataloguePage, p.featured ? 1 : 0,
        id
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // --- MATERIALS API ---
  app.get('/api/materials', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM materials ORDER BY id ASC').all() as any[];
      const materials = rows.map((r) => ({
        id: r.id,
        nameEn: r.name_en,
        nameAr: r.name_ar,
        category: r.category,
        categoryEn: r.category_en,
        categoryAr: r.category_ar,
        thicknessWeight: r.thickness_weight,
        descriptionEn: r.description_en,
        descriptionAr: r.description_ar,
        bestUsesEn: r.best_uses_en ? JSON.parse(r.best_uses_en) : [],
        bestUsesAr: r.best_uses_ar ? JSON.parse(r.best_uses_ar) : [],
        durabilityEn: r.durability_en,
        durabilityAr: r.durability_ar,
        printTechniqueEn: r.print_technique_en,
        printTechniqueAr: r.print_technique_ar,
        finishOptionsEn: r.finish_options_en ? JSON.parse(r.finish_options_en) : [],
        finishOptionsAr: r.finish_options_ar ? JSON.parse(r.finish_options_ar) : [],
        relatedProductIds: r.related_product_ids ? JSON.parse(r.related_product_ids) : [],
      }));
      res.json(materials);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch materials' });
    }
  });

  // --- PORTFOLIO API ---
  app.get('/api/portfolio', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM portfolio ORDER BY id ASC').all() as any[];
      const portfolio = rows.map((r) => ({
        id: r.id,
        titleEn: r.title_en,
        titleAr: r.title_ar,
        category: r.category,
        categoryLabelEn: r.category_label_en,
        categoryLabelAr: r.category_label_ar,
        image: r.image,
        clientEn: r.client_en,
        clientAr: r.client_ar,
        occasionEn: r.occasion_en,
        occasionAr: r.occasion_ar,
        turnaroundEn: r.turnaround_en,
        turnaroundAr: r.turnaround_ar,
        materialsEn: r.materials_en ? JSON.parse(r.materials_en) : [],
        materialsAr: r.materials_ar ? JSON.parse(r.materials_ar) : [],
        descriptionEn: r.description_en,
        descriptionAr: r.description_ar,
        deliverablesEn: r.deliverables_en ? JSON.parse(r.deliverables_en) : [],
        deliverablesAr: r.deliverables_ar ? JSON.parse(r.deliverables_ar) : [],
      }));
      res.json(portfolio);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  // --- SITE SETTINGS API ---
  app.get('/api/settings', (req: Request, res: Response) => {
    try {
      const rows = db.prepare('SELECT * FROM site_settings').all() as any[];
      const settings: Record<string, string> = {};
      for (const r of rows) {
        settings[r.key] = r.value;
      }
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/settings', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const stmt = db.prepare(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `);
      for (const [key, value] of Object.entries(updates)) {
        stmt.run(key, String(value));
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Mount Vite development middlewares in dev
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TrenDy EvenTy Full-Stack Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔐 Admin Route active on /admin with SQL Database (kirilloshelal@gmail.com)`);
  });
}

startServer();
