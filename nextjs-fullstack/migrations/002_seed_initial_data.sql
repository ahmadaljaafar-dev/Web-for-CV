-- 002_seed_initial_data.sql
-- Seeds Ahmad Sami Aljaafar's verified personal details and editable starter profile.
-- No employers, client work, years of experience, testimonials, or performance metrics are invented.

INSERT INTO profile (
  id,
  full_name,
  professional_title,
  hero_headline,
  about_text,
  email,
  phone,
  skills_json
)
VALUES (
  1,
  'Ahmad Sami Aljaafar',
  'Full-Stack Developer & Automation Engineer',
  'I build web apps and automate the work behind them.',
  'I turn practical ideas into responsive websites, web and mobile applications, and automated workflows. My focus is building clean interfaces connected to reliable APIs and databases—then removing repetitive manual tasks behind the scenes with n8n automation so teams and solo founders can move faster with fewer handoffs.',
  'ahmato-123@hotmail.com',
  '71085511',
  '[
    {
      "group": "Software Engineering",
      "description": "Structuring maintainable application logic, relational data models, server-side validation, and clean API integrations.",
      "technologies": ["TypeScript", "PostgreSQL", "API Integration"]
    },
    {
      "group": "Web Development",
      "description": "Building responsive websites and full-stack web applications with clear hierarchy, accessible interactions, and admin dashboards.",
      "technologies": ["Next.js", "Tailwind CSS", "React Three Fiber"]
    },
    {
      "group": "App Development",
      "description": "Designing and developing web and mobile applications with connected backends, structured state flows, and reliable user experiences.",
      "technologies": ["Web & Mobile Apps", "API Integration"]
    },
    {
      "group": "n8n Automation",
      "description": "Connecting forms, webhooks, APIs, and internal tools into automated workflows that validate data, create tasks, and send notifications.",
      "technologies": ["n8n", "API Integration"]
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Starter portfolio entries (self-initiated builds, zero invented clients/metrics).
-- Edit, replace, publish, or unpublish from /admin at any time.
INSERT INTO projects (
  title,
  category,
  problem,
  contribution,
  tech_stack,
  screenshot_url,
  github_url,
  live_demo_url,
  is_published,
  sort_order
)
SELECT
  'Interactive 3D Portfolio & Admin CMS',
  'Web Development',
  'Static resumes rarely show how an engineer connects front-end interfaces, server APIs, databases, and automation into one working system.',
  'Designed and built a full-stack portfolio featuring a 3-layer 3D stack visual, editable profile and project CMS, server-validated contact inbox, and a clean print CV layout.',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'React Three Fiber', 'PostgreSQL'],
  NULL,
  NULL,
  NULL,
  TRUE,
  1
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO projects (
  title,
  category,
  problem,
  contribution,
  tech_stack,
  screenshot_url,
  github_url,
  live_demo_url,
  is_published,
  sort_order
)
SELECT
  'Automated Project Intake & Task Routing',
  'n8n Automation',
  'Incoming project inquiries often sit in shared inboxes until someone manually checks fields, creates a tracking task, and alerts the right person.',
  'Built an automated intake workflow that receives webhook payloads, validates required fields, creates a structured task record, and triggers team notifications.',
  ARRAY['n8n', 'API Integration', 'TypeScript'],
  NULL,
  NULL,
  NULL,
  TRUE,
  2
WHERE (SELECT COUNT(*) FROM projects) = 1;

INSERT INTO projects (
  title,
  category,
  problem,
  contribution,
  tech_stack,
  screenshot_url,
  github_url,
  live_demo_url,
  is_published,
  sort_order
)
SELECT
  'Cross-Platform Companion App (Draft)',
  'App Development',
  'Draft workspace entry ready to be updated with screenshots, repository links, and live demo URLs before publishing.',
  'Editable draft project kept hidden from the public portfolio until published from the admin dashboard.',
  ARRAY['TypeScript', 'API Integration'],
  NULL,
  NULL,
  NULL,
  FALSE,
  3
WHERE (SELECT COUNT(*) FROM projects) = 2;
