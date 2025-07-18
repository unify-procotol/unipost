
export class ProjectEntity implements Record<string, unknown> {
  id = 0;
  uid = 0;
  name = "";
  ghost_api_key = "";
  ghost_domain = "";
  created_at = "";
  updated_at = "";
  locales: string[] = [];
  rule = "";

  [key: string]: unknown;
}
