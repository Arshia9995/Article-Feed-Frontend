Article Platform A simple web app for users to sign up, log in, create and manage articles, and view content based on their preferences. Features

Register: Sign up with first name, last name, phone, email, date of birth, password, and article preferences. Login: Log in using email or phone and password. Dashboard: View articles from others based on your preferences. Like, dislike, or block articles (viewable in a popup or separate page). Settings: Update personal info, password, and article preferences. Create Articles: Add new articles with name, description, images, tags, and category. Article List: See all your articles with options to edit or delete, plus view likes, dislikes, and blocks. Edit Articles: Modify your existing articles.

Tech Used

React with TypeScript Vite (fast build tool) Tailwind CSS (for styling) React Router (for navigation)

Setup

Clone the repo: git clone https://github.com/your-username/article-platform.git cd article-platform

Install dependencies: npm install

Run the app: npm run dev

Open http://localhost:5173 in your browser.

How to Use

Go to /register to create an account. Log in at /login with email/phone and password. Check out articles on the /dashboard. Update your info at /settings. Create articles at /articles/create. View and manage your articles at /articles. Edit articles at /articles/edit/:id.

Notes

The app uses Tailwind CSS for a clean, responsive design. TypeScript ensures type-safe code. Feel free to report issues or suggest improvements!