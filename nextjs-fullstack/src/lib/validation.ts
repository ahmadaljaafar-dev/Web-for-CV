import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  message: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters about your project or inquiry.")
    .max(3000),
});

export const skillGroupSchema = z.object({
  group: z.enum([
    "Software Engineering",
    "Web Development",
    "App Development",
    "n8n Automation",
  ]),
  description: z.string().trim().min(5).max(400),
  technologies: z.array(z.string().trim().min(1).max(40)).max(12),
});

export const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  professional_title: z.string().trim().min(2).max(160),
  hero_headline: z.string().trim().min(5).max(200),
  about_text: z.string().trim().min(20).max(2000),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(4).max(40),
  skills_json: z.array(skillGroupSchema).min(1).max(6),
});

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine(
    (v) => v === null || /^https?:\/\//i.test(v) || v.startsWith("/uploads/"),
    "Must be an http(s) URL or uploaded image path."
  );

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  category: z.enum([
    "Software Engineering",
    "Web Development",
    "App Development",
    "n8n Automation",
  ]),
  problem: z.string().trim().min(10).max(1000),
  contribution: z.string().trim().min(10).max(1000),
  tech_stack: z.array(z.string().trim().min(1).max(40)).max(12),
  screenshot_url: optionalUrl,
  github_url: optionalUrl,
  live_demo_url: optionalUrl,
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(999).default(0),
});
