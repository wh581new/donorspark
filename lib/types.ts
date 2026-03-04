export type DonorType = 'individual' | 'business';

export type InputMethod = 'freetext' | 'guided' | 'social' | 'unified';

export interface GuidedAnswers {
  donorType: DonorType;
  // Individual fields
  profession?: string;
  hobbies?: string;
  skills?: string;
  assets?: string;
  // Business fields
  businessName?: string;
  industry?: string;
  businessType?: string;
  specialServices?: string;
  physicalSpace?: string;
  teamExpertise?: string;
  inventoryOrProducts?: string;
}

export interface UnifiedAnswers {
  donorType: DonorType;
  // Screen 2
  occupation?: string;
  businessName?: string;
  industry?: string;
  // Screen 3
  interests: string[];
  interestsOther?: string;
  // Screen 4
  hiddenTalents?: string;
  // Screen 5
  assets: string[];
  assetsOther?: string;
  // Screen 6
  socialText?: string;
}

export interface DonorInput {
  method: InputMethod;
  freetext?: string;
  guided?: GuidedAnswers;
  socialText?: string;
  unified?: UnifiedAnswers;
  nonprofitContext?: string;
  previousSuggestions?: string[]; // titles of already-suggested items to avoid repeats
}

export interface AuctionSuggestion {
  title: string;
  description: string;
  category: string;
  estimatedValue: string;
  donorCost: string;
  whyItWorks: string;
  isHiddenGem: boolean;
  catalogDescription: string;
  selected?: boolean; // user has picked this one to share with org
}

export interface SuggestionsResponse {
  donorSummary: string;
  suggestions: AuctionSuggestion[];
}

export interface SharePayload {
  donorName: string;
  donorEmail: string;
  orgEmail?: string;
  orgName: string;
  orgSlug?: string;
  selectedOfferings: AuctionSuggestion[];
  donorSummary: string;
}
