# GoalPredict - AI-Powered Football Predictions

GoalPredict is a Base MiniApp that provides AI-driven football match predictions to users on the Base network, enhancing their betting strategies and engagement with the sport.

## 🎯 Features

### Core Features
- **AI Match Prediction Engine**: Advanced AI analysis using OpenAI models for accurate football predictions
- **Personalized Prediction Alerts**: Customizable notifications for high-probability matches
- **Performance Tracking & Transparency**: Historical accuracy rates and win percentages
- **On-Chain Integration**: Seamless USDC payments on Base network
- **Farcaster Social Integration**: Share predictions and engage with the community

### Technical Features
- **Real-time Match Data**: Integration with Sportmonks API for live football data
- **Web3 Wallet Integration**: RainbowKit and Wagmi for wallet connectivity
- **Micro-transaction Payments**: x402-axios for seamless USDC payments
- **Responsive Design**: Mobile-first design optimized for Base MiniApp
- **Notification System**: Browser notifications and in-app alerts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Base wallet (Coinbase Wallet, MetaMask, etc.)
- API keys (optional for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-9828.git
   cd this-is-a-9828
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # OpenAI API Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Sports Data API (Optional)
   VITE_SPORTMONKS_API_KEY=your_sportmonks_api_key_here
   
   # Farcaster Integration (Optional)
   VITE_NEYNAR_API_KEY=your_neynar_api_key_here
   
   # Base Network Configuration
   VITE_BASE_RPC_URL=https://mainnet.base.org
   
   # API endpoints
   VITE_API_BASE_URL=https://api.goalpredict.app
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Beautiful, customizable icons

### Web3 Integration
- **RainbowKit**: Wallet connection and management
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **x402-axios**: Micro-payment integration

### API Integration
- **OpenAI API**: AI-powered prediction generation
- **Sportmonks API**: Real-time football match data
- **Neynar API**: Farcaster social integration
- **Base RPC**: Blockchain interactions

## 📱 User Flows

### 1. User Onboarding & Wallet Connection
1. User accesses GoalPredict via Farcaster or Base Wallet
2. Connect Base wallet using RainbowKit
3. Set initial team/league preferences
4. Review terms of service

### 2. Getting a Prediction
1. Browse upcoming matches or search for specific games
2. Select a match to view AI prediction details
3. Purchase prediction with USDC on Base
4. View detailed analysis and reasoning
5. Option to share prediction on Farcaster

### 3. Performance Tracking
1. Navigate to Performance section
2. View overall accuracy, win rates, and statistics
3. Filter by league or time period
4. Analyze monthly performance trends

### 4. Social Interaction
1. Share predictions on Farcaster via frames
2. View community predictions feed
3. Follow successful predictors
4. Engage with prediction discussions

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(217, 91%, 54%)` - Blue for primary actions
- **Accent**: `hsl(172, 75%, 50%)` - Teal for highlights
- **Background**: `hsl(217, 38%, 10%)` - Dark background
- **Surface**: `hsl(217, 38%, 15%)` - Card backgrounds
- **Text Primary**: `hsl(0, 0%, 95%)` - Main text
- **Text Secondary**: `hsl(0, 0%, 75%)` - Secondary text

### Typography
- **Display**: `text-6xl font-bold` - Large headings
- **Heading**: `text-3xl font-semibold` - Section headings
- **Body**: `text-base font-normal` - Regular text
- **Caption**: `text-sm font-light` - Small text

### Components
- **PredictionCard**: Match prediction display with variants
- **TeamLogo**: Team branding with size variants
- **BettingButton**: Action buttons with state variants
- **AlertNotification**: System notifications
- **FarcasterFrame**: Social sharing components

## 🔧 API Documentation

### Internal APIs

#### Matches API
```javascript
// Get upcoming matches
const matches = await apiService.getUpcomingMatches(date, leagues);

// Get match predictions
const predictions = await apiService.getMatchPredictions(fixtureId);

// Get team statistics
const stats = await apiService.getTeamStats(teamId, season);
```

#### User API
```javascript
// Save user prediction
const prediction = await apiService.savePrediction(predictionData);

// Get user predictions
const predictions = await apiService.getUserPredictions(userId);

// Get user statistics
const stats = await apiService.getUserStats(userId);
```

#### Farcaster API
```javascript
// Share prediction to Farcaster
const result = await farcasterService.sharePrediction(prediction, match, userFid);

// Get prediction feed
const feed = await farcasterService.getPredictionFeed(userFid);

// Get trending predictions
const trending = await farcasterService.getTrendingPredictions();
```

### External APIs

#### OpenAI Integration
- **Purpose**: Generate AI-powered football predictions
- **Model**: Google Gemini 2.0 Flash via OpenRouter
- **Rate Limits**: Managed with fallback to mock data

#### Sportmonks API
- **Purpose**: Real-time football match data and statistics
- **Endpoints**: Fixtures, predictions, teams, leagues
- **Fallback**: Mock data when API unavailable

#### Neynar API
- **Purpose**: Farcaster social integration
- **Features**: Cast creation, feed retrieval, user profiles
- **Fallback**: Demo data for development

## 🔐 Security & Privacy

### Payment Security
- **On-chain Payments**: All transactions on Base network
- **Wallet Integration**: Secure wallet connections via RainbowKit
- **No Private Keys**: Never store or handle private keys

### Data Privacy
- **Local Storage**: User preferences stored locally
- **No Personal Data**: Only wallet addresses and predictions stored
- **API Security**: All API keys properly secured

### Error Handling
- **Graceful Degradation**: Fallback to mock data when APIs fail
- **User Feedback**: Clear error messages and recovery options
- **Retry Logic**: Automatic retries for transient failures

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Ensure all production environment variables are set:
- `VITE_OPENAI_API_KEY`
- `VITE_SPORTMONKS_API_KEY`
- `VITE_NEYNAR_API_KEY`
- `VITE_API_BASE_URL`

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] Match data loads correctly
- [ ] Predictions can be purchased
- [ ] Payments process successfully
- [ ] Notifications appear
- [ ] Social sharing works
- [ ] Performance stats display
- [ ] Mobile responsiveness

## 📈 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Lazy loading for route components
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization

### Runtime Performance
- **React Optimization**: Memoization and efficient re-renders
- **API Caching**: Intelligent caching of API responses
- **State Management**: Optimized state updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Network**: For providing the blockchain infrastructure
- **OpenAI**: For AI prediction capabilities
- **Sportmonks**: For football data API
- **Farcaster**: For social integration
- **RainbowKit**: For wallet connectivity

## 📞 Support

For support, email support@goalpredict.app or join our [Discord](https://discord.gg/goalpredict).

---

Built with ❤️ for the Base ecosystem
