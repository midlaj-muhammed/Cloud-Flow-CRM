# Cloud-Flow-CRM

A modern, AI-powered Customer Relationship Management (CRM) system built with Next.js, Supabase, and TypeScript.

## Features

- 🤖 AI-powered assistant for managing customers and tasks
- 👥 Customer management with detailed profiles
- ✅ Task management and tracking
- 📊 Dashboard with key metrics and insights
- 🔐 Secure authentication with Supabase
- 🎨 Beautiful UI with Tailwind CSS and Shadcn UI
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Pattern-based NLP (Natural Language Processing)
- **State Management**: React Hooks
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Cloud-Flow-CRM.git
cd Cloud-Flow-CRM
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Assistant Commands

The CRM includes an AI assistant that can help with various tasks. Here are some example commands:

- "add a customer John Doe from ABC Company"
- "create a task Follow up with client"
- "show my customers"
- "list tasks"
- Type "help" to see all available commands

## Project Structure

```
Cloud-Flow-CRM/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── supabase/           # Supabase configurations
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
