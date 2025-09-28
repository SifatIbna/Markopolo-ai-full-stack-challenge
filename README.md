# AI Marketing Assistant

A modern, responsive chat interface for AI-powered marketing campaign recommendations built with Next.js 15, React 19, and TypeScript.

## ✨ Features

- **🤖 AI Chat Interface** - Interactive chat with streaming responses and typing indicators
- **📊 Data Source Integration** - Connect Google Ads, Facebook Pixel, and Shopify
- **📱 Marketing Channels** - Support for Email, SMS, WhatsApp, and Advertising platforms
- **🎨 Modern UI/UX** - Built with Tailwind CSS and Radix UI components
- **🌙 Dark/Light Theme** - Fully responsive theme switching with system preference detection
- **📈 Campaign Recommendations** - AI-generated marketing strategies with detailed metrics
- **📋 JSON Export** - Copy and download campaign recommendations as JSON
- **⚡ Real-time Updates** - Live chat with simulated AI streaming responses

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide React Icons
- **Theme**: Next-themes for dark/light mode
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/perplexity-chat-interface.git
cd perplexity-chat-interface
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect Data Sources**: Click on the data sources in the left panel to simulate connections to Google Ads, Facebook Pixel, and Shopify.

2. **Enable Channels**: Toggle the marketing channels you want to use for campaign recommendations.

3. **Chat with AI**: Ask questions about marketing strategies, such as:
   - "Create a cart abandonment campaign"
   - "What's the best channel for new customer acquisition?"
   - "Design a retention campaign for high-value customers"
   - "Suggest a flash sale strategy"

4. **Get Recommendations**: The AI will provide detailed campaign recommendations including:
   - Target audience analysis
   - Optimal timing and frequency
   - Channel selection with reasoning
   - Personalized messaging
   - Budget and performance projections
   - Executable JSON campaign configuration

## Example Campaign JSON Output

```json
{
  "audience": {
    "segment": "Cart abandoners",
    "criteria": {
      "behavior": "abandoned_cart",
      "demographics": {
        "age_range": "25-45",
        "location": "US, CA, UK"
      }
    },
    "size": 35000
  },
  "timing": {
    "optimal_time": "6:00 PM - 8:00 PM",
    "timezone": "UTC-5 (EST)",
    "frequency": "Every 3 days"
  },
  "channel": {
    "primary": "Email Marketing",
    "secondary": ["SMS Campaigns"],
    "reason": "Email has the highest ROI for cart abandoners and allows for detailed personalization"
  },
  "message": {
    "subject": "Exclusive 15% off for our valued customers",
    "content": "We miss you! Come back and save 15% on your favorite items.",
    "call_to_action": "Shop Now & Save"
  },
  "campaign_config": {
    "duration": "2 weeks",
    "targeting_parameters": {
      "retargeting": true,
      "geographic_targeting": "US, CA, UK"
    },
    "expected_metrics": {
      "reach": 28000,
      "engagement_rate": 0.045,
      "conversion_rate": 0.025
    }
  }
}
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── channels/         # Channel management components
│   └── data-sources/     # Data source components
├── lib/                  # Utility functions
│   └── campaignGenerator.ts # AI campaign recommendation logic
└── types/                # TypeScript type definitions
    └── index.ts          # Main type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Perplexity's clean and intuitive chat interface
- Built with modern React and Next.js best practices
- Designed for scalable marketing automation workflows