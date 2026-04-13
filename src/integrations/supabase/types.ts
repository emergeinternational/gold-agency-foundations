export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_us_profiles: {
        Row: {
          bio: string
          created_at: string
          full_name: string
          id: string
          photo_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          full_name: string
          id?: string
          photo_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          full_name?: string
          id?: string
          photo_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academy_courses: {
        Row: {
          admin_override: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          hosted: boolean | null
          id: string
          image_url: string | null
          locked: boolean | null
          role_tags: string[] | null
          source: string | null
          source_url: string | null
          students: number | null
          title: string
        }
        Insert: {
          admin_override?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          hosted?: boolean | null
          id?: string
          image_url?: string | null
          locked?: boolean | null
          role_tags?: string[] | null
          source?: string | null
          source_url?: string | null
          students?: number | null
          title: string
        }
        Update: {
          admin_override?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          hosted?: boolean | null
          id?: string
          image_url?: string | null
          locked?: boolean | null
          role_tags?: string[] | null
          source?: string | null
          source_url?: string | null
          students?: number | null
          title?: string
        }
        Relationships: []
      }
      admin_audit: {
        Row: {
          action: string | null
          admin_user: string | null
          created_at: string | null
          data: Json | null
          id: number
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action?: string | null
          admin_user?: string | null
          created_at?: string | null
          data?: Json | null
          id?: number
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string | null
          admin_user?: string | null
          created_at?: string | null
          data?: Json | null
          id?: number
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_id: number
          ai_assisted: boolean | null
          ai_model: string | null
          ai_response: string | null
          created_at: string | null
          id: number
          ip_address: string | null
          target_data: Json | null
          target_user_id: number | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id: number
          ai_assisted?: boolean | null
          ai_model?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: number
          ip_address?: string | null
          target_data?: Json | null
          target_user_id?: number | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: number
          ai_assisted?: boolean | null
          ai_model?: string | null
          ai_response?: string | null
          created_at?: string | null
          id?: number
          ip_address?: string | null
          target_data?: Json | null
          target_user_id?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_content_audit: {
        Row: {
          action: string
          admin_user_id: string
          id: string
          ip_address: unknown
          new_content: Json | null
          old_content: Json | null
          page_route: string
          section_name: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          id?: string
          ip_address?: unknown
          new_content?: Json | null
          old_content?: Json | null
          page_route: string
          section_name: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          id?: string
          ip_address?: unknown
          new_content?: Json | null
          old_content?: Json | null
          page_route?: string
          section_name?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          created_at: string
          id: string
          note: string | null
          submission_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          submission_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          data: Json | null
          id: string
          message: string
          priority: string | null
          read_at: string | null
          source_id: string | null
          source_table: string | null
          title: string
          type: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          priority?: string | null
          read_at?: string | null
          source_id?: string | null
          source_table?: string | null
          title: string
          type: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          priority?: string | null
          read_at?: string | null
          source_id?: string | null
          source_table?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      affiliate_applications: {
        Row: {
          admin_notes: string | null
          agreement_accepted: boolean
          application_reason: string
          certifications_url: string | null
          city_region: string
          contact_email: string
          contact_person_name: string
          contact_phone: string
          country: string
          created_at: string
          facility_photo_url: string | null
          id: string
          languages_spoken: string[]
          legal_business_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          teaching_capacity_per_week: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          agreement_accepted?: boolean
          application_reason: string
          certifications_url?: string | null
          city_region: string
          contact_email: string
          contact_person_name: string
          contact_phone: string
          country: string
          created_at?: string
          facility_photo_url?: string | null
          id?: string
          languages_spoken?: string[]
          legal_business_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          teaching_capacity_per_week: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          agreement_accepted?: boolean
          application_reason?: string
          certifications_url?: string | null
          city_region?: string
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string
          country?: string
          created_at?: string
          facility_photo_url?: string | null
          id?: string
          languages_spoken?: string[]
          legal_business_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          teaching_capacity_per_week?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_attendance: {
        Row: {
          affiliate_id: string
          attendance_notes: string | null
          attendance_status: string
          created_at: string
          feedback_content: string | null
          feedback_uploaded: boolean
          id: string
          marked_at: string
          marked_by: string
          student_id: string
          workshop_id: string
        }
        Insert: {
          affiliate_id: string
          attendance_notes?: string | null
          attendance_status: string
          created_at?: string
          feedback_content?: string | null
          feedback_uploaded?: boolean
          id?: string
          marked_at?: string
          marked_by: string
          student_id: string
          workshop_id: string
        }
        Update: {
          affiliate_id?: string
          attendance_notes?: string | null
          attendance_status?: string
          created_at?: string
          feedback_content?: string | null
          feedback_uploaded?: boolean
          id?: string
          marked_at?: string
          marked_by?: string
          student_id?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_attendance_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "affiliate_workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_availability: {
        Row: {
          affiliate_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          max_students: number
          start_time: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          max_students?: number
          start_time: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          max_students?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_payouts: {
        Row: {
          admin_notes: string | null
          affiliate_id: string
          amount: number
          created_at: string
          currency: string
          id: string
          payout_method: string
          payout_status: string
          processed_at: string | null
          processed_by: string | null
          transaction_reference: string | null
          updated_at: string
          workshop_id: string
        }
        Insert: {
          admin_notes?: string | null
          affiliate_id: string
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payout_method?: string
          payout_status?: string
          processed_at?: string | null
          processed_by?: string | null
          transaction_reference?: string | null
          updated_at?: string
          workshop_id: string
        }
        Update: {
          admin_notes?: string | null
          affiliate_id?: string
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payout_method?: string
          payout_status?: string
          processed_at?: string | null
          processed_by?: string | null
          transaction_reference?: string | null
          updated_at?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "affiliate_workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_workshops: {
        Row: {
          admin_notes: string | null
          affiliate_id: string
          affiliate_notes: string | null
          course_track: string
          created_at: string
          currency: string
          id: string
          location_address: string | null
          module_id: string | null
          payment_amount: number | null
          payment_status: string
          status: string
          student_contact_info: string
          student_contact_method: string
          student_id: string
          updated_at: string
          workshop_date: string
          workshop_time: string
        }
        Insert: {
          admin_notes?: string | null
          affiliate_id: string
          affiliate_notes?: string | null
          course_track: string
          created_at?: string
          currency?: string
          id?: string
          location_address?: string | null
          module_id?: string | null
          payment_amount?: number | null
          payment_status?: string
          status?: string
          student_contact_info: string
          student_contact_method?: string
          student_id: string
          updated_at?: string
          workshop_date: string
          workshop_time: string
        }
        Update: {
          admin_notes?: string | null
          affiliate_id?: string
          affiliate_notes?: string | null
          course_track?: string
          created_at?: string
          currency?: string
          id?: string
          location_address?: string | null
          module_id?: string | null
          payment_amount?: number | null
          payment_status?: string
          status?: string
          student_contact_info?: string
          student_contact_method?: string
          student_id?: string
          updated_at?: string
          workshop_date?: string
          workshop_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_workshops_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string | null
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_submissions: {
        Row: {
          admin_notes: string | null
          age: number | null
          applicant_role: string | null
          bust_chest: string | null
          buyer_platform: string | null
          casting_id: string | null
          city: string | null
          contact_app: string | null
          country: string | null
          created_at: string | null
          email: string | null
          experience_link: string | null
          full_name: string | null
          gender: string | null
          height: string | null
          hips: string | null
          id: string
          instagram: string | null
          is_featured: boolean | null
          is_public: boolean | null
          messaging_handle: string | null
          phone: string | null
          photo_urls: string[] | null
          portfolio_link: string | null
          preferred_contact_app: string | null
          referred_by_team: string | null
          roles: string[] | null
          shirt_size: string | null
          shoe_size: string | null
          status: string | null
          submission_status: string | null
          suit_size: string | null
          talent_description: string | null
          tiktok: string | null
          user_id: string | null
          vendor_details: string | null
          video_url: string | null
          waist: string | null
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          applicant_role?: string | null
          bust_chest?: string | null
          buyer_platform?: string | null
          casting_id?: string | null
          city?: string | null
          contact_app?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          experience_link?: string | null
          full_name?: string | null
          gender?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          instagram?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          messaging_handle?: string | null
          phone?: string | null
          photo_urls?: string[] | null
          portfolio_link?: string | null
          preferred_contact_app?: string | null
          referred_by_team?: string | null
          roles?: string[] | null
          shirt_size?: string | null
          shoe_size?: string | null
          status?: string | null
          submission_status?: string | null
          suit_size?: string | null
          talent_description?: string | null
          tiktok?: string | null
          user_id?: string | null
          vendor_details?: string | null
          video_url?: string | null
          waist?: string | null
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          applicant_role?: string | null
          bust_chest?: string | null
          buyer_platform?: string | null
          casting_id?: string | null
          city?: string | null
          contact_app?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          experience_link?: string | null
          full_name?: string | null
          gender?: string | null
          height?: string | null
          hips?: string | null
          id?: string
          instagram?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          messaging_handle?: string | null
          phone?: string | null
          photo_urls?: string[] | null
          portfolio_link?: string | null
          preferred_contact_app?: string | null
          referred_by_team?: string | null
          roles?: string[] | null
          shirt_size?: string | null
          shoe_size?: string | null
          status?: string | null
          submission_status?: string | null
          suit_size?: string | null
          talent_description?: string | null
          tiktok?: string | null
          user_id?: string | null
          vendor_details?: string | null
          video_url?: string | null
          waist?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          tags: string[] | null
          title: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      community_reports: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          post_id: string | null
          reason: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          post_id?: string | null
          reason: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          post_id?: string | null
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_voices: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      contact_methods: {
        Row: {
          country_code: string
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          method_type: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          country_code: string
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          method_type: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          country_code?: string
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          method_type?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contest_entries: {
        Row: {
          additional_info: Json | null
          city: string | null
          claimed: boolean | null
          contest_id: string
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          instagram: string | null
          ip_address: unknown
          phone: string | null
          role: string | null
          status: string
          telegram: string | null
          tiktok: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_info?: Json | null
          city?: string | null
          claimed?: boolean | null
          contest_id: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          instagram?: string | null
          ip_address?: unknown
          phone?: string | null
          role?: string | null
          status?: string
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_info?: Json | null
          city?: string | null
          claimed?: boolean | null
          contest_id?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          instagram?: string | null
          ip_address?: unknown
          phone?: string | null
          role?: string | null
          status?: string
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_entries_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contest_entries_addis2025: {
        Row: {
          age_confirmed: boolean
          created_at: string | null
          full_name: string
          id: string
          instagram_handle: string
          ip_address: unknown
          page_source: string | null
          screenshot_url: string | null
          telegram_username: string
          tiktok_handle: string | null
          updated_at: string | null
        }
        Insert: {
          age_confirmed?: boolean
          created_at?: string | null
          full_name: string
          id?: string
          instagram_handle: string
          ip_address?: unknown
          page_source?: string | null
          screenshot_url?: string | null
          telegram_username: string
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Update: {
          age_confirmed?: boolean
          created_at?: string | null
          full_name?: string
          id?: string
          instagram_handle?: string
          ip_address?: unknown
          page_source?: string | null
          screenshot_url?: string | null
          telegram_username?: string
          tiktok_handle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contest_rejections: {
        Row: {
          contest_id: string
          created_at: string | null
          email: string | null
          id: string
          ip_address: unknown
          phone: string | null
          reason: string
          user_id: string | null
        }
        Insert: {
          contest_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          phone?: string | null
          reason: string
          user_id?: string | null
        }
        Update: {
          contest_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          phone?: string | null
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contest_rejections_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          allow_duplicate_entries: boolean
          announcement_date: string | null
          contact_info: string | null
          created_at: string | null
          created_by: string | null
          description: string
          enable_confetti: boolean
          enable_live_feed: boolean
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean
          is_visible: boolean
          location: string | null
          prize_description: string
          rules: string | null
          short_description: string | null
          start_date: string
          success_message: string | null
          title: string
          updated_at: string | null
          winning_message: string | null
        }
        Insert: {
          allow_duplicate_entries?: boolean
          announcement_date?: string | null
          contact_info?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          enable_confetti?: boolean
          enable_live_feed?: boolean
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_visible?: boolean
          location?: string | null
          prize_description: string
          rules?: string | null
          short_description?: string | null
          start_date: string
          success_message?: string | null
          title: string
          updated_at?: string | null
          winning_message?: string | null
        }
        Update: {
          allow_duplicate_entries?: boolean
          announcement_date?: string | null
          contact_info?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          enable_confetti?: boolean
          enable_live_feed?: boolean
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_visible?: boolean
          location?: string | null
          prize_description?: string
          rules?: string | null
          short_description?: string | null
          start_date?: string
          success_message?: string | null
          title?: string
          updated_at?: string | null
          winning_message?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          badge_image_url: string | null
          course_track: string
          created_at: string | null
          description: string | null
          id: string
          module_number: number
          title: string
          track_id: string | null
          video_fallback_image: string | null
          video_url: string | null
          visual_aid_url: string | null
        }
        Insert: {
          badge_image_url?: string | null
          course_track: string
          created_at?: string | null
          description?: string | null
          id?: string
          module_number: number
          title: string
          track_id?: string | null
          video_fallback_image?: string | null
          video_url?: string | null
          visual_aid_url?: string | null
        }
        Update: {
          badge_image_url?: string | null
          course_track?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module_number?: number
          title?: string
          track_id?: string | null
          video_fallback_image?: string | null
          video_url?: string | null
          visual_aid_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "course_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      course_tracks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      designer_submissions: {
        Row: {
          created_at: string | null
          description: string | null
          designer_name: string | null
          id: string
          images: string[] | null
          price: number
          status: string | null
          title: string
          user_id: string | null
          video: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          designer_name?: string | null
          id?: string
          images?: string[] | null
          price: number
          status?: string | null
          title: string
          user_id?: string | null
          video?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          designer_name?: string | null
          id?: string
          images?: string[] | null
          price?: number
          status?: string | null
          title?: string
          user_id?: string | null
          video?: string | null
        }
        Relationships: []
      }
      directory_requests: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_featured: boolean | null
          last_name: string | null
          photo_url: string | null
          role: string | null
          social_links: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_featured?: boolean | null
          last_name?: string | null
          photo_url?: string | null
          role?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_featured?: boolean | null
          last_name?: string | null
          photo_url?: string | null
          role?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      directory_submissions: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_featured: boolean
          last_name: string
          photo_url: string | null
          role: string
          social_links: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_featured?: boolean
          last_name: string
          photo_url?: string | null
          role: string
          social_links?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_featured?: boolean
          last_name?: string
          photo_url?: string | null
          role?: string
          social_links?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          donor_name: string | null
          id: string
          payment_method: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
        }
        Relationships: []
      }
      enrollment_applications: {
        Row: {
          admin_decision: string
          admin_notes: string | null
          city: string
          contact_handle: string | null
          country: string
          created_at: string
          experience_level: string
          full_name: string
          id: string
          motivation: string
          phone: string | null
          phone_number: string | null
          portfolio_link: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_interest: string
          social_links: Json | null
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_decision?: string
          admin_notes?: string | null
          city: string
          contact_handle?: string | null
          country: string
          created_at?: string
          experience_level?: string
          full_name: string
          id?: string
          motivation: string
          phone?: string | null
          phone_number?: string | null
          portfolio_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_interest: string
          social_links?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_decision?: string
          admin_notes?: string | null
          city?: string
          contact_handle?: string | null
          country?: string
          created_at?: string
          experience_level?: string
          full_name?: string
          id?: string
          motivation?: string
          phone?: string | null
          phone_number?: string | null
          portfolio_link?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_interest?: string
          social_links?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          application_id: string
          created_at: string
          enrolled_tracks: string[] | null
          enrollment_date: string
          id: string
          status: string
          suspended_at: string | null
          suspended_by: string | null
          suspended_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          enrolled_tracks?: string[] | null
          enrollment_date?: string
          id?: string
          status?: string
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          enrolled_tracks?: string[] | null
          enrollment_date?: string
          id?: string
          status?: string
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          event_id: string
          id: string
          payment_proof_url: string | null
          payment_status: string | null
          registration_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          payment_proof_url?: string | null
          payment_status?: string | null
          registration_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          payment_proof_url?: string | null
          payment_status?: string | null
          registration_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_requests: {
        Row: {
          city: string
          community_goal: string
          country: string
          created_at: string
          email: string
          event_type: string
          full_name: string
          has_partners: string
          id: string
          message: string
          phone: string
          proposed_date: string
          status: string
          support_needed: string
          updated_at: string
        }
        Insert: {
          city: string
          community_goal: string
          country: string
          created_at?: string
          email: string
          event_type: string
          full_name: string
          has_partners: string
          id?: string
          message: string
          phone: string
          proposed_date: string
          status?: string
          support_needed: string
          updated_at?: string
        }
        Update: {
          city?: string
          community_goal?: string
          country?: string
          created_at?: string
          email?: string
          event_type?: string
          full_name?: string
          has_partners?: string
          id?: string
          message?: string
          phone?: string
          proposed_date?: string
          status?: string
          support_needed?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_suggestions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          location: string | null
          status: string | null
          suggested_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          status?: string | null
          suggested_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          status?: string | null
          suggested_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          additional_images: string[] | null
          capacity: number | null
          category: string
          created_at: string | null
          currency: string | null
          description: string
          downloadable_assets: Json | null
          end_time: string
          featured: boolean | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          livestream_url: string | null
          location: string | null
          location_type: string
          organizer_id: string | null
          payment_methods: string[] | null
          price: number | null
          rsvp_type: string
          short_description: string
          start_time: string
          tags: string[] | null
          timezone: string
          title: string
          updated_at: string | null
        }
        Insert: {
          additional_images?: string[] | null
          capacity?: number | null
          category: string
          created_at?: string | null
          currency?: string | null
          description: string
          downloadable_assets?: Json | null
          end_time: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          livestream_url?: string | null
          location?: string | null
          location_type: string
          organizer_id?: string | null
          payment_methods?: string[] | null
          price?: number | null
          rsvp_type: string
          short_description: string
          start_time: string
          tags?: string[] | null
          timezone?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          additional_images?: string[] | null
          capacity?: number | null
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          downloadable_assets?: Json | null
          end_time?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          livestream_url?: string | null
          location?: string | null
          location_type?: string
          organizer_id?: string | null
          payment_methods?: string[] | null
          price?: number | null
          rsvp_type?: string
          short_description?: string
          start_time?: string
          tags?: string[] | null
          timezone?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      global_banners: {
        Row: {
          banner_color: string
          countdown_end: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          link_text: string | null
          link_url: string | null
          message: string
          title: string
          updated_at: string
        }
        Insert: {
          banner_color?: string
          countdown_end?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message: string
          title: string
          updated_at?: string
        }
        Update: {
          banner_color?: string
          countdown_end?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_trips: {
        Row: {
          accommodation: string | null
          admin_notes: string | null
          booking_instructions: string | null
          contact_handle: string | null
          contact_method: string | null
          created_at: string | null
          deposit_amount: number | null
          destination: string
          end_date: string
          gallery_images: string[] | null
          hero_image_url: string | null
          id: string
          inclusions: string[] | null
          is_visible: boolean | null
          itinerary: Json | null
          legal_terms: string | null
          price_couples: number | null
          price_double: number | null
          price_single: number | null
          pricing: Json | null
          sort_order: number | null
          start_date: string
          subtitle: string | null
          title: string
          trip_name: string | null
          updated_at: string | null
        }
        Insert: {
          accommodation?: string | null
          admin_notes?: string | null
          booking_instructions?: string | null
          contact_handle?: string | null
          contact_method?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          destination: string
          end_date: string
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          inclusions?: string[] | null
          is_visible?: boolean | null
          itinerary?: Json | null
          legal_terms?: string | null
          price_couples?: number | null
          price_double?: number | null
          price_single?: number | null
          pricing?: Json | null
          sort_order?: number | null
          start_date: string
          subtitle?: string | null
          title: string
          trip_name?: string | null
          updated_at?: string | null
        }
        Update: {
          accommodation?: string | null
          admin_notes?: string | null
          booking_instructions?: string | null
          contact_handle?: string | null
          contact_method?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          destination?: string
          end_date?: string
          gallery_images?: string[] | null
          hero_image_url?: string | null
          id?: string
          inclusions?: string[] | null
          is_visible?: boolean | null
          itinerary?: Json | null
          legal_terms?: string | null
          price_couples?: number | null
          price_double?: number | null
          price_single?: number | null
          pricing?: Json | null
          sort_order?: number | null
          start_date?: string
          subtitle?: string | null
          title?: string
          trip_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      host_interest: {
        Row: {
          city_region: string
          club_name: string
          club_recognition: string
          club_website: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at: string
          hosting_reason: string
          id: string
          image_url: string | null
          player_capacity: number
          status: string
          training_days: string
          updated_at: string
        }
        Insert: {
          city_region: string
          club_name: string
          club_recognition: string
          club_website?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at?: string
          hosting_reason: string
          id?: string
          image_url?: string | null
          player_capacity: number
          status?: string
          training_days: string
          updated_at?: string
        }
        Update: {
          city_region?: string
          club_name?: string
          club_recognition?: string
          club_website?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          country?: string
          created_at?: string
          hosting_reason?: string
          id?: string
          image_url?: string | null
          player_capacity?: number
          status?: string
          training_days?: string
          updated_at?: string
        }
        Relationships: []
      }
      host_team_applications: {
        Row: {
          accept_values: boolean
          age_groups: string[]
          city_region: string
          club_affiliation: string | null
          club_name: string
          club_recognition: string
          club_website: string | null
          confirm_accuracy: boolean
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at: string | null
          hosting_reason: string
          id: string
          image_url: string | null
          messaging_app: string | null
          messaging_handle: string | null
          player_capacity: number
          registration_proof: string | null
          training_days: string
          wants_media_exposure: string | null
        }
        Insert: {
          accept_values: boolean
          age_groups: string[]
          city_region: string
          club_affiliation?: string | null
          club_name: string
          club_recognition: string
          club_website?: string | null
          confirm_accuracy: boolean
          contact_email: string
          contact_name: string
          contact_phone: string
          country: string
          created_at?: string | null
          hosting_reason: string
          id?: string
          image_url?: string | null
          messaging_app?: string | null
          messaging_handle?: string | null
          player_capacity: number
          registration_proof?: string | null
          training_days: string
          wants_media_exposure?: string | null
        }
        Update: {
          accept_values?: boolean
          age_groups?: string[]
          city_region?: string
          club_affiliation?: string | null
          club_name?: string
          club_recognition?: string
          club_website?: string | null
          confirm_accuracy?: boolean
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          country?: string
          created_at?: string | null
          hosting_reason?: string
          id?: string
          image_url?: string | null
          messaging_app?: string | null
          messaging_handle?: string | null
          player_capacity?: number
          registration_proof?: string | null
          training_days?: string
          wants_media_exposure?: string | null
        }
        Relationships: []
      }
      join_team_applications: {
        Row: {
          accept_values: boolean
          age: number
          city: string
          confirm_accuracy: boolean
          confirm_charity_ack: boolean
          country: string
          created_at: string | null
          current_club: string | null
          experience_level: string
          full_name: string
          gender: string
          id: string
          instagram_or_tiktok: string | null
          message_to_coaches: string | null
          messaging_app: string | null
          messaging_handle: string | null
          phone: string
          position: string
        }
        Insert: {
          accept_values: boolean
          age: number
          city: string
          confirm_accuracy: boolean
          confirm_charity_ack: boolean
          country: string
          created_at?: string | null
          current_club?: string | null
          experience_level: string
          full_name: string
          gender: string
          id?: string
          instagram_or_tiktok?: string | null
          message_to_coaches?: string | null
          messaging_app?: string | null
          messaging_handle?: string | null
          phone: string
          position: string
        }
        Update: {
          accept_values?: boolean
          age?: number
          city?: string
          confirm_accuracy?: boolean
          confirm_charity_ack?: boolean
          country?: string
          created_at?: string | null
          current_club?: string | null
          experience_level?: string
          full_name?: string
          gender?: string
          id?: string
          instagram_or_tiktok?: string | null
          message_to_coaches?: string | null
          messaging_app?: string | null
          messaging_handle?: string | null
          phone?: string
          position?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message_body: string
          read_status: boolean
          receiver_id: string
          role_visibility: string
          sender_id: string
          subject: string
          thread_id: string | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_body: string
          read_status?: boolean
          receiver_id: string
          role_visibility?: string
          sender_id: string
          subject: string
          thread_id?: string | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_body?: string
          read_status?: boolean
          receiver_id?: string
          role_visibility?: string
          sender_id?: string
          subject?: string
          thread_id?: string | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_quizzes: {
        Row: {
          created_at: string | null
          id: string
          module_id: string | null
          passing_score: number | null
          questions: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number | null
          questions?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number | null
          questions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "module_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          admin_message: string | null
          created_at: string
          id: string
          message: string | null
          product_id: string | null
          product_name: string | null
          read: boolean
          status: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_message?: string | null
          created_at?: string
          id?: string
          message?: string | null
          product_id?: string | null
          product_name?: string | null
          read?: boolean
          status?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_message?: string | null
          created_at?: string
          id?: string
          message?: string | null
          product_id?: string | null
          product_name?: string | null
          read?: boolean
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_receipts: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          order_id: string
          payment_method: string
          receipt_url: string
          updated_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          payment_method: string
          receipt_url: string
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          payment_method?: string
          receipt_url?: string
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_receipts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_info: Json | null
          id: string
          items: Json | null
          payment_method: string | null
          payment_status: string | null
          requires_receipt_verification: boolean | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_info?: Json | null
          id?: string
          items?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          requires_receipt_verification?: boolean | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_info?: Json | null
          id?: string
          items?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          requires_receipt_verification?: boolean | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          created_at: string
          cta_text: string | null
          cta_url: string | null
          description: string | null
          embed_code: string | null
          id: string
          image_url: string | null
          is_active: boolean
          page_route: string
          previous_version_id: string | null
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          embed_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          page_route: string
          previous_version_id?: string | null
          section_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          embed_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          page_route?: string
          previous_version_id?: string | null
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "page_content_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "page_content"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          countries: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          requires_receipt: boolean | null
          type: string
          updated_at: string | null
        }
        Insert: {
          countries?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          requires_receipt?: boolean | null
          type: string
          updated_at?: string | null
        }
        Update: {
          countries?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          requires_receipt?: boolean | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prequalification_results: {
        Row: {
          answers: Json | null
          category: string | null
          created_at: string
          critical_pass: boolean | null
          id: string
          outcome: string | null
          score: number | null
          submission_id: string | null
        }
        Insert: {
          answers?: Json | null
          category?: string | null
          created_at?: string
          critical_pass?: boolean | null
          id?: string
          outcome?: string | null
          score?: number | null
          submission_id?: string | null
        }
        Update: {
          answers?: Json | null
          category?: string | null
          created_at?: string
          critical_pass?: boolean | null
          id?: string
          outcome?: string | null
          score?: number | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequalification_results_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          admin_notes: string | null
          approval_status: string | null
          available_sizes: string[] | null
          category: string | null
          collection_id: string | null
          created_at: string
          description: string | null
          designer_id: string
          designer_name: string | null
          id: string
          images: string[] | null
          is_published: boolean | null
          name: string
          price: number
          size_info: string | null
          tags: string[] | null
          updated_at: string
          variations: Json | null
        }
        Insert: {
          admin_notes?: string | null
          approval_status?: string | null
          available_sizes?: string[] | null
          category?: string | null
          collection_id?: string | null
          created_at?: string
          description?: string | null
          designer_id: string
          designer_name?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          name: string
          price: number
          size_info?: string | null
          tags?: string[] | null
          updated_at?: string
          variations?: Json | null
        }
        Update: {
          admin_notes?: string | null
          approval_status?: string | null
          available_sizes?: string[] | null
          category?: string | null
          collection_id?: string | null
          created_at?: string
          description?: string | null
          designer_id?: string
          designer_name?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean | null
          name?: string
          price?: number
          size_info?: string | null
          tags?: string[] | null
          updated_at?: string
          variations?: Json | null
        }
        Relationships: []
      }
      promotion_team_questions: {
        Row: {
          created_at: string | null
          id: string
          question: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          id: string
          module_id: string | null
          passed: boolean | null
          quiz_id: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          passed?: boolean | null
          quiz_id?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          passed?: boolean | null
          quiz_id?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "module_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          role_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          role_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      rsvp: {
        Row: {
          answers: Json
          city: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          recommended_path: string | null
          referrer: string | null
          role: Database["public"]["Enums"]["rsvp_role"]
          src: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          telegram_user_id: string | null
          updated_at: string
          whatsapp_opt_in: boolean | null
        }
        Insert: {
          answers?: Json
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          recommended_path?: string | null
          referrer?: string | null
          role: Database["public"]["Enums"]["rsvp_role"]
          src?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          telegram_user_id?: string | null
          updated_at?: string
          whatsapp_opt_in?: boolean | null
        }
        Update: {
          answers?: Json
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          recommended_path?: string | null
          referrer?: string | null
          role?: Database["public"]["Enums"]["rsvp_role"]
          src?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          telegram_user_id?: string | null
          updated_at?: string
          whatsapp_opt_in?: boolean | null
        }
        Relationships: []
      }
      rsvp_settings: {
        Row: {
          created_at: string
          global_capacity: number
          id: string
          is_open: boolean
          max_complimentary_by_role: Json
          updated_at: string
          vip_hold: number
          waitlist_threshold: number
        }
        Insert: {
          created_at?: string
          global_capacity?: number
          id?: string
          is_open?: boolean
          max_complimentary_by_role?: Json
          updated_at?: string
          vip_hold?: number
          waitlist_threshold?: number
        }
        Update: {
          created_at?: string
          global_capacity?: number
          id?: string
          is_open?: boolean
          max_complimentary_by_role?: Json
          updated_at?: string
          vip_hold?: number
          waitlist_threshold?: number
        }
        Relationships: []
      }
      rsvp_submissions: {
        Row: {
          affiliation: string | null
          age: number | null
          anticipation: string | null
          attending_with_group: boolean | null
          buyer_platform: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          event_type: Database["public"]["Enums"]["pass_type"] | null
          followers: string | null
          full_name: string
          group_name: string | null
          id: string
          instagram_handle: string | null
          interest_category: string | null
          pass_type: string | null
          phone_number: string | null
          photo_url: string | null
          photo_urls: string[] | null
          platform: string | null
          referred_by_team: string | null
          region: string | null
          role: string | null
          source: string | null
          telegram: string | null
          telegram_username: string | null
          updated_at: string | null
          vendor_details: string | null
          vendor_info: string | null
        }
        Insert: {
          affiliation?: string | null
          age?: number | null
          anticipation?: string | null
          attending_with_group?: boolean | null
          buyer_platform?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          event_type?: Database["public"]["Enums"]["pass_type"] | null
          followers?: string | null
          full_name: string
          group_name?: string | null
          id?: string
          instagram_handle?: string | null
          interest_category?: string | null
          pass_type?: string | null
          phone_number?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          platform?: string | null
          referred_by_team?: string | null
          region?: string | null
          role?: string | null
          source?: string | null
          telegram?: string | null
          telegram_username?: string | null
          updated_at?: string | null
          vendor_details?: string | null
          vendor_info?: string | null
        }
        Update: {
          affiliation?: string | null
          age?: number | null
          anticipation?: string | null
          attending_with_group?: boolean | null
          buyer_platform?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          event_type?: Database["public"]["Enums"]["pass_type"] | null
          followers?: string | null
          full_name?: string
          group_name?: string | null
          id?: string
          instagram_handle?: string | null
          interest_category?: string | null
          pass_type?: string | null
          phone_number?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          platform?: string | null
          referred_by_team?: string | null
          region?: string | null
          role?: string | null
          source?: string | null
          telegram?: string | null
          telegram_username?: string | null
          updated_at?: string | null
          vendor_details?: string | null
          vendor_info?: string | null
        }
        Relationships: []
      }
      rsvp_submissions_backup: {
        Row: {
          anticipation: string | null
          applicant_type: string
          created_at: string | null
          full_name: string
          id: string
          interest_category: string | null
          message: string | null
          phone: string | null
          photo_url: string | null
          photo_urls: string[] | null
          role: string | null
          telegram: string | null
          telegram_username: string
          vendor_info: string | null
        }
        Insert: {
          anticipation?: string | null
          applicant_type: string
          created_at?: string | null
          full_name: string
          id?: string
          interest_category?: string | null
          message?: string | null
          phone?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          role?: string | null
          telegram?: string | null
          telegram_username: string
          vendor_info?: string | null
        }
        Update: {
          anticipation?: string | null
          applicant_type?: string
          created_at?: string | null
          full_name?: string
          id?: string
          interest_category?: string | null
          message?: string | null
          phone?: string | null
          photo_url?: string | null
          photo_urls?: string[] | null
          role?: string | null
          telegram?: string | null
          telegram_username?: string
          vendor_info?: string | null
        }
        Relationships: []
      }
      scrape_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      scraper_config: {
        Row: {
          fallback_used: boolean | null
          frequency: string | null
          id: string
          keywords: string[] | null
          last_run: string | null
        }
        Insert: {
          fallback_used?: boolean | null
          frequency?: string | null
          id?: string
          keywords?: string[] | null
          last_run?: string | null
        }
        Update: {
          fallback_used?: boolean | null
          frequency?: string | null
          id?: string
          keywords?: string[] | null
          last_run?: string | null
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          created_at: string | null
          description: string | null
          designer_name: string | null
          id: string
          images: string[] | null
          price: number
          source_submission_id: string | null
          title: string
          video: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          designer_name?: string | null
          id?: string
          images?: string[] | null
          price: number
          source_submission_id?: string | null
          title: string
          video?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          designer_name?: string | null
          id?: string
          images?: string[] | null
          price?: number
          source_submission_id?: string | null
          title?: string
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_source_submission_id_fkey"
            columns: ["source_submission_id"]
            isOneToOne: false
            referencedRelation: "designer_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          value?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assignee: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          emerge_ready: boolean
          evaluation_scores: Json
          experience_level: string | null
          full_name: string | null
          id: string
          instagram: string | null
          level: string | null
          notes: string | null
          next_action: string | null
          phone: string | null
          portfolio_url: string | null
          sample_url: string | null
          source: string | null
          status: string | null
          tiktok: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          assignee?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          emerge_ready?: boolean
          evaluation_scores?: Json
          experience_level?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          level?: string | null
          notes?: string | null
          next_action?: string | null
          phone?: string | null
          portfolio_url?: string | null
          sample_url?: string | null
          source?: string | null
          status?: string | null
          tiktok?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          assignee?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          emerge_ready?: boolean
          evaluation_scores?: Json
          experience_level?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          level?: string | null
          notes?: string | null
          next_action?: string | null
          phone?: string | null
          portfolio_url?: string | null
          sample_url?: string | null
          source?: string | null
          status?: string | null
          tiktok?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      talent_details: {
        Row: {
          data: Json
          talent_id: string
        }
        Insert: {
          data: Json
          talent_id: string
        }
        Update: {
          data?: Json
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_details_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: true
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_media: {
        Row: {
          id: number
          kind: string | null
          meta: Json | null
          position: number | null
          talent_id: string | null
          url: string
        }
        Insert: {
          id?: number
          kind?: string | null
          meta?: Json | null
          position?: number | null
          talent_id?: string | null
          url: string
        }
        Update: {
          id?: number
          kind?: string | null
          meta?: Json | null
          position?: number | null
          talent_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_media_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profiles: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          display_name: string
          email: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["talent_role"]
          socials: Json | null
          status: string
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          display_name: string
          email?: string | null
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["talent_role"]
          socials?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string
          email?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["talent_role"]
          socials?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      talent_publications: {
        Row: {
          created_at: string | null
          id: string
          section: string | null
          talent_id: string | null
          url_slug: string | null
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          section?: string | null
          talent_id?: string | null
          url_slug?: string | null
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          section?: string | null
          talent_id?: string | null
          url_slug?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_publications_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_reviews: {
        Row: {
          created_at: string | null
          decision: string | null
          id: number
          notes: string | null
          reviewer: string | null
          talent_id: string | null
        }
        Insert: {
          created_at?: string | null
          decision?: string | null
          id?: number
          notes?: string | null
          reviewer?: string | null
          talent_id?: string | null
        }
        Update: {
          created_at?: string | null
          decision?: string | null
          id?: number
          notes?: string | null
          reviewer?: string | null
          talent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_reviews_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_interest: {
        Row: {
          age: number
          city: string
          country: string
          created_at: string
          email: string
          experience_level: string
          full_name: string
          gender: string
          id: string
          motivation: string
          past_clubs: string | null
          phone: string
          preferred_position: string
          social_handle: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age: number
          city: string
          country: string
          created_at?: string
          email: string
          experience_level: string
          full_name: string
          gender: string
          id?: string
          motivation: string
          past_clubs?: string | null
          phone: string
          preferred_position: string
          social_handle?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age?: number
          city?: string
          country?: string
          created_at?: string
          email?: string
          experience_level?: string
          full_name?: string
          gender?: string
          id?: string
          motivation?: string
          past_clubs?: string | null
          phone?: string
          preferred_position?: string
          social_handle?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      travel_cta_content: {
        Row: {
          background_color: string
          created_at: string | null
          cta_primary_link: string
          cta_primary_text: string
          cta_secondary_link: string
          cta_secondary_text: string
          description: string
          headline: string
          id: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          background_color?: string
          created_at?: string | null
          cta_primary_link?: string
          cta_primary_text?: string
          cta_secondary_link?: string
          cta_secondary_text?: string
          description?: string
          headline?: string
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          background_color?: string
          created_at?: string | null
          cta_primary_link?: string
          cta_primary_text?: string
          cta_secondary_link?: string
          cta_secondary_text?: string
          description?: string
          headline?: string
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_destinations: {
        Row: {
          country: string
          created_at: string | null
          id: string
          image_url: string
          is_visible: boolean
          name: string
          preview: string
          sort_order: number
          tours_count: number
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          image_url: string
          is_visible?: boolean
          name: string
          preview: string
          sort_order?: number
          tours_count?: number
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          image_url?: string
          is_visible?: boolean
          name?: string
          preview?: string
          sort_order?: number
          tours_count?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_hero_content: {
        Row: {
          created_at: string | null
          cta_primary_link: string
          cta_primary_text: string
          cta_secondary_text: string
          description: string
          headline: string
          hero_images: Json
          id: string
          is_active: boolean
          subheading: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_primary_link?: string
          cta_primary_text?: string
          cta_secondary_text?: string
          description?: string
          headline?: string
          hero_images?: Json
          id?: string
          is_active?: boolean
          subheading?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_primary_link?: string
          cta_primary_text?: string
          cta_secondary_text?: string
          description?: string
          headline?: string
          hero_images?: Json
          id?: string
          is_active?: boolean
          subheading?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_tours: {
        Row: {
          created_at: string | null
          description: string | null
          destination: string
          duration: string
          gallery_images: Json
          group_size: string
          id: string
          image_url: string
          is_available: boolean
          is_featured: boolean
          is_visible: boolean
          metadata: Json
          price: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination: string
          duration: string
          gallery_images?: Json
          group_size: string
          id?: string
          image_url: string
          is_available?: boolean
          is_featured?: boolean
          is_visible?: boolean
          metadata?: Json
          price: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination?: string
          duration?: string
          gallery_images?: Json
          group_size?: string
          id?: string
          image_url?: string
          is_available?: boolean
          is_featured?: boolean
          is_visible?: boolean
          metadata?: Json
          price?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string | null
          destination: string | null
          id: string
          itinerary: Json | null
          media: Json | null
          price: number | null
          published_at: string | null
          slug: string
          status: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          id?: string
          itinerary?: Json | null
          media?: Json | null
          price?: number | null
          published_at?: string | null
          slug: string
          status?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          id?: string
          itinerary?: Json | null
          media?: Json | null
          price?: number | null
          published_at?: string | null
          slug?: string
          status?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          assigned_by: string | null
          badge_description: string | null
          badge_icon: string | null
          badge_name: string
          badge_type: string
          created_at: string
          earned_at: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_name: string
          badge_type: string
          created_at?: string
          earned_at?: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_name?: string
          badge_type?: string
          created_at?: string
          earned_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_certificates: {
        Row: {
          certificate_name: string
          certificate_url: string
          course_track: string
          created_at: string
          id: string
          issued_at: string
          issued_by: string | null
          user_id: string
          verification_code: string | null
        }
        Insert: {
          certificate_name: string
          certificate_url: string
          course_track: string
          created_at?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          user_id: string
          verification_code?: string | null
        }
        Update: {
          certificate_name?: string
          certificate_url?: string
          course_track?: string
          created_at?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          user_id?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          admin_notes: string | null
          certificate_released: boolean
          certificate_url: string | null
          completed_modules: number
          course_completed: boolean | null
          course_track: string
          created_at: string
          eligible_for_certificate: boolean
          eligible_for_workshop: boolean | null
          id: string
          progress_percentage: number | null
          total_modules: number
          updated_at: string
          user_id: string
          workshop_completed: boolean
        }
        Insert: {
          admin_notes?: string | null
          certificate_released?: boolean
          certificate_url?: string | null
          completed_modules?: number
          course_completed?: boolean | null
          course_track: string
          created_at?: string
          eligible_for_certificate?: boolean
          eligible_for_workshop?: boolean | null
          id?: string
          progress_percentage?: number | null
          total_modules?: number
          updated_at?: string
          user_id: string
          workshop_completed?: boolean
        }
        Update: {
          admin_notes?: string | null
          certificate_released?: boolean
          certificate_url?: string | null
          completed_modules?: number
          course_completed?: boolean | null
          course_track?: string
          created_at?: string
          eligible_for_certificate?: boolean
          eligible_for_workshop?: boolean | null
          id?: string
          progress_percentage?: number | null
          total_modules?: number
          updated_at?: string
          user_id?: string
          workshop_completed?: boolean
        }
        Relationships: []
      }
      user_module_progress: {
        Row: {
          badge_earned: boolean | null
          completed_at: string | null
          course_track: string
          created_at: string | null
          id: string
          module_id: string | null
          quiz_completed: boolean | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          worksheet_completed: boolean | null
        }
        Insert: {
          badge_earned?: boolean | null
          completed_at?: string | null
          course_track: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          quiz_completed?: boolean | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          worksheet_completed?: boolean | null
        }
        Update: {
          badge_earned?: boolean | null
          completed_at?: string | null
          course_track?: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          quiz_completed?: boolean | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          worksheet_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_progress: {
        Row: {
          academy_completed: boolean | null
          casting_completed: boolean | null
          completed_at: string | null
          created_at: string | null
          dashboard_completed: boolean | null
          id: string
          overall_completed: boolean | null
          shop_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          academy_completed?: boolean | null
          casting_completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          dashboard_completed?: boolean | null
          id?: string
          overall_completed?: boolean | null
          shop_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          academy_completed?: boolean | null
          casting_completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          dashboard_completed?: boolean | null
          id?: string
          overall_completed?: boolean | null
          shop_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          contact: string | null
          country: string | null
          created_at: string | null
          directory_access_status: string | null
          email: string | null
          full_name: string | null
          id: string
          instagram: string | null
          is_verified: boolean | null
          language: string | null
          location: string | null
          profile_image_url: string | null
          region: string | null
          role: string | null
          role_id: string | null
          telegram: string | null
          tiktok: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          contact?: string | null
          country?: string | null
          created_at?: string | null
          directory_access_status?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          language?: string | null
          location?: string | null
          profile_image_url?: string | null
          region?: string | null
          role?: string | null
          role_id?: string | null
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          contact?: string | null
          country?: string | null
          created_at?: string | null
          directory_access_status?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          language?: string | null
          location?: string | null
          profile_image_url?: string | null
          region?: string | null
          role?: string | null
          role_id?: string | null
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles_backup: {
        Row: {
          avatar_url: string | null
          city: string | null
          contact: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          instagram: string | null
          is_verified: boolean | null
          language: string | null
          location: string | null
          profile_image_url: string | null
          role: string | null
          role_id: string | null
          telegram: string | null
          tiktok: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          contact?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          language?: string | null
          location?: string | null
          profile_image_url?: string | null
          role?: string | null
          role_id?: string | null
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          contact?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          language?: string | null
          location?: string | null
          profile_image_url?: string | null
          role?: string | null
          role_id?: string | null
          telegram?: string | null
          tiktok?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          region: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          region?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          region?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      worksheet_responses: {
        Row: {
          created_at: string | null
          id: string
          module_id: string | null
          responses: Json
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          responses?: Json
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          responses?: Json
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worksheet_responses_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_user_progress_view: {
        Row: {
          admin_notes: string | null
          certificate_issued_at: string | null
          certificate_released: boolean | null
          certificate_url: string | null
          completed_modules: number | null
          course_completed: boolean | null
          course_track: string | null
          eligible_for_certificate: boolean | null
          eligible_for_workshop: boolean | null
          email: string | null
          enrollment_date: string | null
          full_name: string | null
          last_activity: string | null
          progress_percentage: number | null
          role: string | null
          total_modules: number | null
          user_id: string | null
          verification_code: string | null
          workshop_completed: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_mark_workshop_completed: {
        Args: {
          completed: boolean
          target_course_track: string
          target_user_id: string
        }
        Returns: boolean
      }
      admin_release_certificate: {
        Args: {
          certificate_url_param: string
          target_course_track: string
          target_user_id: string
        }
        Returns: string
      }
      admin_toggle_certificate_eligibility: {
        Args: {
          eligible: boolean
          target_course_track: string
          target_user_id: string
        }
        Returns: boolean
      }
      get_user_dashboard_data: {
        Args: { target_user_id?: string }
        Returns: {
          certificate_released: boolean
          certificate_url: string
          completed_modules: number
          course_completed: boolean
          course_track: string
          eligible_for_certificate: boolean
          eligible_for_workshop: boolean
          next_module_number: number
          next_module_title: string
          progress_percentage: number
          total_modules: number
          verification_code: string
          workshop_completed: boolean
        }[]
      }
      has_directory_access: { Args: { user_uuid?: string }; Returns: boolean }
      has_regional_access: { Args: { target_region: string }; Returns: boolean }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_uuid: string }; Returns: boolean }
      is_privileged_user: { Args: never; Returns: boolean }
      send_admin_notification: {
        Args: {
          notification_data?: Json
          notification_message: string
          notification_priority?: string
          notification_source_id?: string
          notification_source_table?: string
          notification_title: string
          notification_type: string
        }
        Returns: string
      }
    }
    Enums: {
      admin_decision_enum: "pending" | "approved" | "rejected" | "waitlisted"
      applicant_type:
        | "General"
        | "Model"
        | "Musician"
        | "Designer"
        | "Vendor"
        | "Press"
        | "Influencer"
        | "Promotion Team Member"
      pass_type:
        | "General Admission"
        | "Influencer"
        | "Press"
        | "Performer"
        | "Vendor"
        | "Buyer"
        | "Designer"
        | "Promotion Team Member"
      rsvp_role:
        | "guest"
        | "influencer"
        | "industry"
        | "press"
        | "designer"
        | "model"
        | "performer"
        | "sponsor"
        | "vip"
      rsvp_status: "WAITLIST" | "CONF_COMP" | "REQUIRES_PAYMENT" | "DECLINED"
      talent_role:
        | "model"
        | "fashion_designer"
        | "musician"
        | "performer"
        | "visual_artist"
        | "creator"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_decision_enum: ["pending", "approved", "rejected", "waitlisted"],
      applicant_type: [
        "General",
        "Model",
        "Musician",
        "Designer",
        "Vendor",
        "Press",
        "Influencer",
        "Promotion Team Member",
      ],
      pass_type: [
        "General Admission",
        "Influencer",
        "Press",
        "Performer",
        "Vendor",
        "Buyer",
        "Designer",
        "Promotion Team Member",
      ],
      rsvp_role: [
        "guest",
        "influencer",
        "industry",
        "press",
        "designer",
        "model",
        "performer",
        "sponsor",
        "vip",
      ],
      rsvp_status: ["WAITLIST", "CONF_COMP", "REQUIRES_PAYMENT", "DECLINED"],
      talent_role: [
        "model",
        "fashion_designer",
        "musician",
        "performer",
        "visual_artist",
        "creator",
        "other",
      ],
    },
  },
} as const
