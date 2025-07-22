declare module '@tryghost/admin-api' {
  interface GhostAdminAPIConfig {
    url: string;
    key: string;
    version: string;
  }

  interface GhostMember {
    id: string;
    email: string;
    name?: string;
    subscribed: boolean;
    labels?: string[];
    created_at: string;
    updated_at: string;
  }

  interface GhostMemberCreateData {
    email: string;
    name?: string;
    subscribed?: boolean;
    labels?: string[];
  }

  interface GhostMemberUpdateData {
    id: string;
    email?: string;
    name?: string;
    subscribed?: boolean;
    labels?: string[];
  }

  interface GhostMemberBrowseOptions {
    filter?: string;
    limit?: number;
    page?: number;
    order?: string;
  }

  interface GhostMembersAPI {
    add(data: GhostMemberCreateData): Promise<GhostMember>;
    edit(data: GhostMemberUpdateData): Promise<GhostMember>;
    browse(options?: GhostMemberBrowseOptions): Promise<GhostMember[]>;
    read(data: { id: string } | { email: string }): Promise<GhostMember>;
    delete(data: { id: string }): Promise<void>;
  }

  class GhostAdminAPI {
    constructor(config: GhostAdminAPIConfig);
    members: GhostMembersAPI;
  }

  export = GhostAdminAPI;
}
