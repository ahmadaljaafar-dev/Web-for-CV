export type SkillGroup = {
  group: "Software Engineering" | "Web Development" | "App Development" | "n8n Automation";
  description: string;
  technologies: string[];
};

export type Profile = {
  id: number;
  full_name: string;
  professional_title: string;
  hero_headline: string;
  about_text: string;
  email: string;
  phone: string;
  skills_json: SkillGroup[];
  updated_at: string;
};

export type ProjectCategory =
  | "Software Engineering"
  | "Web Development"
  | "App Development"
  | "n8n Automation";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  problem: string;
  contribution: string;
  tech_stack: string[];
  screenshot_url: string | null;
  github_url: string | null;
  live_demo_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactInquiry = {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
