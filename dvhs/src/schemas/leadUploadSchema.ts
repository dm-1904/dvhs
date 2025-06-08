// src/schemas/LeadUploadSchema.ts
import { z } from "zod";

export const LeadUploadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  status: z.string().optional(),
  labels: z.string().optional(),
  qualityScore: z.number().optional(),
  phone: z.string(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),

  agentAssigned: z.string().optional(),
  partnerAssigned: z.string().optional(),

  registered: z.coerce.date().optional(),
  source: z.string().optional(),
  lastLogin: z.coerce.date().optional(),
  loginCount: z.number().optional(),

  lastTouchType: z.string().optional(),
  lastTouchDate: z.coerce.date().optional(),
  lastTouchNotes: z.string().optional(),

  averagePrice: z.number().optional(),
  medianPrice: z.number().optional(),
  favoriteCity: z.string().optional(),
  timeframe: z.string().optional(),

  propertyInquiries: z.number().optional(),
  favoriteProperties: z.number().optional(),
  propertyViews: z.number().optional(),
  propertyFavorites: z.number().optional(),
  savedSearches: z.number().optional(),

  preQualifiedForMortgage: z.boolean().optional(),
  houseToSell: z.boolean().optional(),
  firstTimeBuyer: z.boolean().optional(),

  ip: z.string().optional(),
  buyerSeller: z.string().optional(),

  optedInEmail: z.boolean().optional(),
  optedInText: z.boolean().optional(),

  pipelineStage: z.string().optional(),
  notes: z.string().optional(),
  notes2: z.string().optional(),
});

export type LeadUpload = z.infer<typeof LeadUploadSchema>;
