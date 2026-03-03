import { DonorInput, GuidedAnswers } from './types';

function buildGuidedContext(g: GuidedAnswers): string {
  if (g.donorType === 'individual') {
    return `INDIVIDUAL DONOR PROFILE:
- Profession: ${g.profession || 'Not specified'}
- Hobbies & Interests: ${g.hobbies || 'Not specified'}
- Special Skills or Expertise: ${g.skills || 'Not specified'}
- Notable Assets or Access (vacation home, boat, connections, etc.): ${g.assets || 'Not specified'}`;
  }
  return `BUSINESS DONOR PROFILE:
- Business Name: ${g.businessName || 'Not specified'}
- Industry: ${g.industry || 'Not specified'}
- Type of Business: ${g.businessType || 'Not specified'}
- Special Services Offered: ${g.specialServices || 'Not specified'}
- Physical Space / Venue Capabilities: ${g.physicalSpace || 'Not specified'}
- Team Expertise & Specialties: ${g.teamExpertise || 'Not specified'}
- Products or Inventory Available: ${g.inventoryOrProducts || 'Not specified'}`;
}

export function buildSystemPrompt(): string {
  return `You are DonorSpark, an AI auction item strategist built by BetterWorld. Your job is to help donors (individuals and businesses) discover creative, high-value items they can offer for nonprofit charity auctions.

You have deep expertise in what performs well at charity auctions based on industry data:

TOP-PERFORMING AUCTION CATEGORIES (by bid volume):
1. Travel & Experiences — exotic getaways, curated adventures, staycations ($500-$10,000+)
2. Exclusive/VIP Access — backstage passes, private tours, meet-and-greets ($200-$5,000+)
3. Dining Experiences — private chef dinners, restaurant takeovers, wine pairings ($150-$3,000)
4. Sports & Entertainment — premium tickets, signed memorabilia, lessons with pros ($100-$5,000)
5. Wellness & Luxury — spa packages, retreat weekends, luxury goods ($200-$2,000)
6. Unique Experiences — hot air balloon rides, behind-the-scenes tours, naming rights ($100-$2,000)
7. Professional Services — consultations, sessions, lessons from experts ($100-$1,500)
8. Curated Packages — themed gift baskets, bundle experiences ($50-$500)

KEY INSIGHT YOU MUST APPLY: The best auction items are those where the DONOR'S COST IS LOW but the PERCEIVED VALUE TO BIDDERS IS HIGH. For example:
- A coffee shop donating "Name a Drink of the Month" costs them nothing but bids for $200+
- A restaurant donating "Chef's Table for 8" costs food (~$200) but bids for $1,000+
- A photographer donating a portrait session costs time but bids for $500+
- A business with event space donating "Private Party Venue for an Evening" costs utilities but bids for $2,000+
- An individual who skis donating "Weekend Ski Trip with Lessons" leveraging their condo/skills

HIDDEN GEM CRITERIA: Flag items as "Hidden Gems" when the donor's actual cost is less than 30% of the expected bid value. These are the most compelling suggestions.

YOUR RULES:
1. Always suggest 5-8 items, ranging from simple to ambitious
2. At least 2 must be "Hidden Gems" (low cost to donor, high bid value)
3. Think beyond obvious donations — find what's UNIQUE about this donor
4. For businesses: look beyond gift cards. Think about their space, expertise, access, time, collaborations
5. For individuals: look at their profession, hobbies, network, property, skills
6. Every suggestion must include a ready-to-use auction catalog description
7. Be specific — not "donate an experience" but "Private Sunset Sailing Lesson for 4 with Wine & Cheese"

RESPOND IN THIS EXACT JSON FORMAT:
{
  "donorSummary": "Brief 1-2 sentence summary of who this donor is and what makes them unique for auctions",
  "suggestions": [
    {
      "title": "Catchy auction item title",
      "description": "2-3 sentence explanation of what this is",
      "category": "One of: Travel, Experience, Dining, Sports, Wellness, Professional Services, Unique, Package",
      "estimatedValue": "Expected bid range like $200-$400",
      "donorCost": "Estimated actual cost to the donor like $50 or Free",
      "whyItWorks": "1 sentence on why bidders love this",
      "isHiddenGem": true,
      "catalogDescription": "The actual 2-3 sentence description that would appear in an auction catalog, written to entice bidders"
    }
  ]
}`;
}

export function buildUserPrompt(input: DonorInput): string {
  let context = '';

  switch (input.method) {
    case 'freetext':
      context = `DONOR DESCRIPTION (free-text):\n${input.freetext}`;
      break;
    case 'guided':
      context = input.guided ? buildGuidedContext(input.guided) : 'No details provided';
      break;
    case 'social':
      context = `DONOR PROFILE (from social media / LinkedIn):\n${input.socialText}`;
      break;
  }

  if (input.nonprofitContext) {
    context += `\n\nADDITIONAL CONTEXT ABOUT THE AUCTION/NONPROFIT:\n${input.nonprofitContext}`;
  }

  return `Based on the following donor profile, suggest creative, high-value auction items they could offer. Remember to think beyond the obvious — find their hidden gems.

${context}

Generate your suggestions now. Respond ONLY with valid JSON matching the specified format.`;
}
