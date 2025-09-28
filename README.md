# AI Marketing Assistant

A modern, responsive chat interface for AI-powered marketing campaign recommendations built with Next.js 15, React 19, and TypeScript.

## ✨ Features

- **🤖 AI Chat Interface** - Interactive chat with streaming responses and typing indicators
- **📊 Data Source Integration** - Connect Google Ads, Facebook Pixel, and Shopify
- **📱 Marketing Channels** - Support for Email, SMS, WhatsApp, and Advertising platforms
- **🎨 Modern UI/UX** - Built with Tailwind CSS and Radix UI components
- **🌙 Dark/Light Theme** - Fully responsive theme switching with system preference detection
- **📈 Campaign Recommendations** - AI-generated marketing strategies with detailed metrics
- **🚀 Campaign Execution** - Visual campaign flow builder with React Flow integration
- **📋 JSON Export** - Copy and download campaign recommendations as JSON
- **📝 Campaign History** - Previous questions stored and accessible via history button
- **⚡ Real-time Updates** - Live chat with simulated AI streaming responses
- **🧪 Comprehensive Testing** - Unit tests (Jest) and E2E tests (Cypress)

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide React Icons
- **Flow Builder**: React Flow for campaign visualization
- **Theme**: Next-themes for dark/light mode
- **Testing**: Jest, React Testing Library, Cypress
- **Deployment**: Vercel with optimized GitHub Actions workflows
- **CI/CD**: GitHub Actions with parallel validation and caching

## Getting Started

### Prerequisites
- Node.js 20+
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

5. **Execute Campaigns**: Click the "Execute Campaign" button on recommendations to:
   - Visualize campaign flow with React Flow
   - View detailed execution steps
   - Monitor campaign progress
   - Access campaign data and configuration

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
│   ├── page.tsx           # Main application page
│   ├── api/chat/          # Chat API routes
│   └── execute/           # Campaign execution pages
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── channels/         # Channel management components
│   ├── data-sources/     # Data source components
│   ├── ui/               # Reusable UI components
│   └── campaign/         # Campaign execution components
├── lib/                  # Utility functions
│   └── campaignGenerator.ts # AI campaign recommendation logic
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
└── __tests__/            # Test files
    ├── components/       # Component tests
    └── lib/              # Library tests
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Cypress E2E tests
- `npm run test:e2e:ui` - Open Cypress in interactive mode
- `npm run test:all` - Run all tests (unit + E2E)

### Testing

The project includes comprehensive testing setup:

**Unit Tests (Jest + React Testing Library)**
```bash
npm run test                # Run all unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

**E2E Tests (Cypress)**
```bash
npm run test:e2e          # Run headless E2E tests
npm run test:e2e:ui       # Open Cypress interactive mode
```

**Run All Tests**
```bash
npm run test:all          # Run both unit and E2E tests
```

### Building for Production

```bash
npm run build
npm run start
```

### GitHub Actions Workflows

The project includes optimized CI/CD workflows:

- **Preview Deployment** - Parallel validation (lint + test) and Vercel deployment
- **Dependency Caching** - Shared dependency installation across jobs
- **Matrix Testing** - Concurrent lint and test execution
- **Environment URLs** - Preview deployments with GitHub environment integration

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