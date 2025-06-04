export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      competitive_data: {
        Row: {
          category: string
          competitor_name: string
          id: string
          industry: string | null
          last_analyzed: string | null
          score: number | null
          website_url: string
        }
        Insert: {
          category: string
          competitor_name: string
          id?: string
          industry?: string | null
          last_analyzed?: string | null
          score?: number | null
          website_url: string
        }
        Update: {
          category?: string
          competitor_name?: string
          id?: string
          industry?: string | null
          last_analyzed?: string | null
          score?: number | null
          website_url?: string
        }
        Relationships: []
      }
      training_data: {
        Row: {
          created_at: string | null
          feature_data: Json
          feature_type: string
          id: string
          quality_score: number | null
          website_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_data: Json
          feature_type: string
          id?: string
          quality_score?: number | null
          website_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_data?: Json
          feature_type?: string
          id?: string
          quality_score?: number | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_data_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "website_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      website_analyses: {
        Row: {
          analysis_data: Json
          created_at: string | null
          id: string
          score: number
          screenshot_url: string | null
          title: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          analysis_data: Json
          created_at?: string | null
          id?: string
          score: number
          screenshot_url?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string | null
          id?: string
          score?: number
          screenshot_url?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      website_analysis_results: {
        Row: {
          analysis_data: Json
          annotations: Json | null
          code_suggestions: Json | null
          competitive_data: Json | null
          created_at: string | null
          design_score: number
          id: string
          issues: Json
          screenshot_url: string | null
          suggestions: Json
          title: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          analysis_data: Json
          annotations?: Json | null
          code_suggestions?: Json | null
          competitive_data?: Json | null
          created_at?: string | null
          design_score: number
          id?: string
          issues: Json
          screenshot_url?: string | null
          suggestions: Json
          title?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          analysis_data?: Json
          annotations?: Json | null
          code_suggestions?: Json | null
          competitive_data?: Json | null
          created_at?: string | null
          design_score?: number
          id?: string
          issues?: Json
          screenshot_url?: string | null
          suggestions?: Json
          title?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
