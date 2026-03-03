export type DonorType = 'individual' | 'business';

export type InputMethod = 'freetext' | 'guided' | 'social';

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

export interface DonorInput {
  method: InputMethod;
  freetext?: string;
  guided?: GuidedAnswers;
  socialText?: string;
  nonprofitContext?: string;
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
}

export interface SuggestionsResponse {
  donorSummary: string;
  suggestions: AuctionSuggestion[];
}
