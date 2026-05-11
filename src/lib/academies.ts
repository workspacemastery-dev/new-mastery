// Database-backed academy type. Visual styling lives in academy-styles.ts.
export interface Academy {
  id: string;
  slug: string;
  name: string;
  subject: string;
  description: string;
  teacher_id: string | null;
  teacher_name: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  accent_color: string;
  is_published: boolean;
}
